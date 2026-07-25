"""Command-line interface for local audiobook production."""

import json
import sys
from pathlib import Path
from typing import Annotated, cast

import typer
from rich.console import Console
from rich.table import Table

from audiobook_studio.bakeoff import approve_voice, doctor_backends, generate_bakeoff
from audiobook_studio.doctor import doctor_json, run_doctor
from audiobook_studio.errors import AudiobookError, ExitCode
from audiobook_studio.extractors import MarkdownExtractor
from audiobook_studio.narration_plan import create_plan, persist_plan
from audiobook_studio.orchestration import render_project, verify_full_cache
from audiobook_studio.packaging import (
    assemble_project,
    package_project,
    verify_delivery,
)
from audiobook_studio.project_store import (
    build_source_metadata,
    export_schemas,
    load_project,
    persist_extraction,
    update_manifest,
    validate_manifest,
)
from audiobook_studio.qa import approve_g2_audio, close_g2, run_qa

app = typer.Typer(no_args_is_help=True, help="Local-first Joshua audiobook production.")
manifest_app = typer.Typer(no_args_is_help=True, help="Project manifest operations.")
schema_app = typer.Typer(no_args_is_help=True, help="JSON Schema operations.")
voice_app = typer.Typer(no_args_is_help=True, help="Voice bake-off and approval.")
app.add_typer(manifest_app, name="manifest")
app.add_typer(schema_app, name="schema")
app.add_typer(voice_app, name="voice")
console = Console()

ProjectOption = Annotated[
    Path,
    typer.Option(
        "--project",
        exists=True,
        file_okay=True,
        dir_okay=False,
        readable=True,
        resolve_path=True,
        help="Path to project.yaml.",
    ),
]


def _fail(error: AudiobookError) -> None:
    console.print(f"[red]Error:[/red] {error}")
    raise typer.Exit(code=int(error.exit_code))


@app.command()
def doctor(
    json_output: Annotated[
        bool, typer.Option("--json", help="Print and write the machine-readable report.")
    ] = False,
    output: Annotated[
        Path | None, typer.Option("--output", help="Optional report output path.")
    ] = None,
) -> None:
    """Inspect the local Slice 0 environment without changing it."""

    try:
        report = run_doctor()
    except AudiobookError as error:
        _fail(error)
        return
    rendered = doctor_json(report)
    if json_output:
        destination = output or Path.cwd() / "doctor.json"
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(rendered, encoding="utf-8")
        console.print(rendered, end="")
        console.print(f"Wrote {destination.resolve()}", style="dim")
    else:
        table = Table(title=f"Doctor: {report['overall_status']}")
        table.add_column("Check")
        table.add_column("Status")
        table.add_column("Detail")
        checks = cast(list[dict[str, object]], report["checks"])
        for check in checks:
            table.add_row(
                str(check["name"]),
                str(check["status"]),
                str(check["detail"]),
            )
        console.print(table)
    if report["overall_status"] != "pass":
        raise typer.Exit(code=int(ExitCode.ENVIRONMENT_FAILURE))


@app.command()
def inspect(project: ProjectOption) -> None:
    """List Markdown headings and report the configured selection."""

    try:
        loaded = load_project(project)
        index = MarkdownExtractor().inspect(loaded.source_path)
    except AudiobookError as error:
        _fail(error)
        return
    table = Table(title=f"Headings: {loaded.source_path.name}")
    table.add_column("Line", justify="right")
    table.add_column("Level", justify="right")
    table.add_column("Heading")
    for heading in index.headings:
        table.add_row(str(heading.line_number), str(heading.level), heading.text)
    console.print(table)
    console.print(
        "Configured selection: "
        f"{loaded.config.source.selector.start_heading!r} -> "
        f"{loaded.config.source.selector.end_before_heading!r}"
    )


@app.command()
def extract(project: ProjectOption) -> None:
    """Extract the configured Markdown heading range and persist source artifacts."""

    try:
        loaded = load_project(project)
        selection = MarkdownExtractor().extract(loaded.source_path, loaded.config.source.selector)
        metadata = build_source_metadata(
            loaded,
            heading=selection.heading,
            start_line=selection.start_line,
            end_line=selection.end_line,
            original_selection=selection.original_selection,
            narration_text=selection.narration_text,
            word_count=selection.word_count,
            paragraph_count=selection.paragraph_count,
        )
        manifest = persist_extraction(
            loaded,
            original_selection=selection.original_selection,
            narration_text=selection.narration_text,
            metadata=metadata,
        )
        export_schemas(loaded.workspace_root / "Audiobook_Studio" / "schemas")
    except AudiobookError as error:
        _fail(error)
        return
    console.print(f"[green]Extracted:[/green] {selection.heading}")
    console.print(
        f"{selection.word_count} words; {selection.paragraph_count} prose paragraphs; "
        f"lines {selection.start_line}-{selection.end_line}"
    )
    console.print(f"Manifest: {loaded.project_dir / 'manifest.json'}")
    console.print(f"Narration SHA256: {manifest.source.narration_text_sha256}")


@app.command()
def plan(project: ProjectOption) -> None:
    """Create a source-faithful deterministic narration plan with optional Ollama annotations."""

    try:
        loaded = load_project(project)
        narration_plan = create_plan(loaded)
        path = persist_plan(loaded, narration_plan)
        update_manifest(
            loaded,
            stage="plan",
            status="qa_pass",
            outputs={"narration_plan": "planning/narration-plan.json"},
        )
        export_schemas(loaded.workspace_root / "Audiobook_Studio" / "schemas")
    except AudiobookError as error:
        _fail(error)
        return
    console.print(
        f"[green]Plan created:[/green] {len(narration_plan.chunks)} chunks via "
        f"{narration_plan.planner}"
    )
    for warning in narration_plan.warnings:
        console.print(f"[yellow]Warning:[/yellow] {warning}")
    console.print(f"Plan: {path}")


@app.command("pronunciation-diff")
def pronunciation_diff(project: ProjectOption) -> None:
    """Show every approved source-to-spoken pronunciation replacement."""

    try:
        loaded = load_project(project)
        from audiobook_studio.narration_plan import NarrationPlan

        narration_plan = NarrationPlan.model_validate_json(
            (loaded.project_dir / "planning" / "narration-plan.json").read_text(encoding="utf-8")
        )
    except (AudiobookError, OSError) as error:
        if isinstance(error, AudiobookError):
            _fail(error)
        else:
            console.print(f"[red]Error:[/red] {error}")
            raise typer.Exit(code=int(ExitCode.INVALID_INPUT)) from error
        return
    table = Table(title="Approved pronunciation changes")
    table.add_column("Chunk")
    table.add_column("Source")
    table.add_column("Spoken")
    count = 0
    for chunk in narration_plan.chunks:
        for replacement in chunk.replacements:
            table.add_row(chunk.chunk_id, replacement.source, replacement.replacement)
            count += 1
    console.print(table)
    console.print(f"{count} approved replacements")


@app.command()
def render(
    project: ProjectOption,
    require_full_cache: Annotated[
        bool,
        typer.Option(
            "--require-full-cache",
            help="Fail unless every chunk is a valid cache hit.",
        ),
    ] = False,
    force_chunk: Annotated[
        list[str] | None,
        typer.Option(
            "--force-chunk",
            help="Regenerate one chunk with its next deterministic seed; repeat as needed.",
        ),
    ] = None,
) -> None:
    """Render all planned chunks, preserving successful cached work."""

    try:
        loaded = load_project(project)
        if require_full_cache and force_chunk:
            raise AudiobookError("--require-full-cache cannot be combined with --force-chunk")
        state = (
            verify_full_cache(loaded)
            if require_full_cache
            else render_project(loaded, force_chunks=set(force_chunk or []))
        )
        chunk_manifest = {
            chunk_id: {
                "render_key": record.render_key,
                "status": record.status,
                "attempts": record.attempts,
                "seeds": record.seeds,
                "duration_seconds": record.duration_seconds,
                "audio_sha256": record.audio_sha256,
                "mastered_audio": record.mastered_audio,
            }
            for chunk_id, record in state.chunks.items()
        }
        update_manifest(
            loaded,
            stage="render",
            status="qa_pass",
            outputs={"render_state": "chunks/render-state.json"},
            chunks=chunk_manifest,
        )
    except AudiobookError as error:
        _fail(error)
        return
    console.print(
        f"[green]Render complete:[/green] {state.generated} generated, "
        f"{state.cache_hits} cache hits, {state.failed} failed"
    )


@app.command()
def assemble(project: ProjectOption) -> None:
    """Standardise joins and globally master the complete chapter WAV."""

    try:
        loaded = load_project(project)
        master = assemble_project(loaded)
        update_manifest(
            loaded,
            stage="assemble",
            status="qa_pass",
            outputs={
                "wav_master": "output/Berani - Ginger Juice - Master.wav",
                "transcript": "output/Berani - Ginger Juice.transcript.txt",
            },
        )
    except AudiobookError as error:
        _fail(error)
        return
    console.print(f"[green]Master assembled:[/green] {master}")


@app.command()
def qa(
    project: ProjectOption,
    verification_model: Annotated[
        str | None,
        typer.Option(
            "--verification-model",
            help="Optional second ASR model used only for chunks above the WER limit.",
        ),
    ] = None,
) -> None:
    """Run batch Whisper fidelity checks and technical audio QA."""

    try:
        loaded = load_project(project)
        report = run_qa(loaded, verification_model=verification_model)
        update_manifest(
            loaded,
            stage="qa",
            status=report.status,
            outputs={
                "qa_report_json": "qa/report.json",
                "qa_report_markdown": "qa/report.md",
            },
        )
    except AudiobookError as error:
        _fail(error)
        return
    console.print(
        f"[green]QA complete:[/green] {report.status}; WER {report.overall_wer:.2%}; "
        f"{len(report.high_risk_differences)} chunks require difference review"
    )
    if report.status == "qa_fail":
        raise typer.Exit(code=int(ExitCode.QA_FAILURE))


@app.command("approve-g2-audio")
def approve_g2_audio_command(
    project: ProjectOption,
    approver: Annotated[str, typer.Option("--approver", help="Human listening reviewer.")],
) -> None:
    """Freeze the manually approved WAV master without bypassing the rights gate."""

    try:
        loaded = load_project(project)
        destination = approve_g2_audio(loaded, approver)
    except AudiobookError as error:
        _fail(error)
        return
    console.print(f"[green]Gate G2 audio approved:[/green] {destination}")
    if not loaded.config.rights.confirmed:
        console.print(
            "[yellow]Rights confirmation remains required before delivery packaging "
            "and formal Gate G2 closure.[/yellow]"
        )


@app.command("close-g2")
def close_g2_command(
    project: ProjectOption,
    approver: Annotated[str, typer.Option("--approver", help="Gate G2 approver.")],
) -> None:
    """Record formal Gate G2 closure after every required check passes."""

    try:
        loaded = load_project(project)
        close_g2(loaded, approver)
    except AudiobookError as error:
        _fail(error)
        return
    console.print("[green]PASS — Gate G2 closed.[/green]")


@app.command()
def package(
    project: ProjectOption,
    include_mp3: Annotated[
        bool, typer.Option("--mp3/--no-mp3", help="Also create a 96 kbps mono MP3.")
    ] = True,
) -> None:
    """Create verified classroom delivery files after the rights gate."""

    try:
        loaded = load_project(project)
        outputs = package_project(loaded, include_mp3=include_mp3)
        verify_delivery(outputs)
        relative = {
            f"delivery_{path.suffix.removeprefix('.') or 'transcript'}": str(
                path.relative_to(loaded.project_dir)
            ).replace("\\", "/")
            for path in outputs
        }
        update_manifest(
            loaded,
            stage="package",
            status="packaged",
            outputs=relative,
        )
    except AudiobookError as error:
        _fail(error)
        return
    console.print("[green]Delivery package verified:[/green]")
    for output in outputs:
        console.print(output)


@app.command()
def status(project: ProjectOption) -> None:
    """Show current project stages and evidence paths."""

    try:
        loaded = load_project(project)
        manifest = validate_manifest(loaded.project_dir)
    except AudiobookError as error:
        _fail(error)
        return
    table = Table(title=loaded.config.title)
    table.add_column("Stage")
    table.add_column("Status")
    table.add_column("Completed")
    for name, stage in manifest.stages.items():
        table.add_row(name, stage.status, str(stage.completed_at or ""))
    console.print(table)


@voice_app.command("sample")
def voice_sample(
    project: ProjectOption,
    backend: Annotated[
        str,
        typer.Option(
            "--backend",
            help="Generate all candidates or only kokoro, qwen, or chatterbox.",
        ),
    ] = "all",
) -> None:
    """Generate source-identical passages and pronunciation comparisons."""

    if backend not in {"all", "kokoro", "qwen", "chatterbox"}:
        console.print(f"[red]Error:[/red] Unknown backend: {backend}")
        raise typer.Exit(code=int(ExitCode.INVALID_INPUT))
    try:
        loaded = load_project(project)
        report = generate_bakeoff(loaded, selected_backend=backend)
    except AudiobookError as error:
        _fail(error)
        return
    candidates = cast(list[dict[str, object]], report["candidates"])
    table = Table(title="Voice bake-off")
    table.add_column("Candidate")
    table.add_column("Backend")
    table.add_column("Status")
    table.add_column("Detail")
    failed = False
    for candidate in candidates:
        status = str(candidate["status"])
        selected_candidate = backend == "all" or candidate["backend"] == backend
        failed = failed or (selected_candidate and status == "failed")
        table.add_row(
            str(candidate["candidate_id"]),
            str(candidate["backend"]),
            status,
            str(candidate.get("error", "")),
        )
    console.print(table)
    console.print(
        f"Results: {loaded.project_dir / 'voice-bakeoff' / 'results.json'}",
        style="dim",
    )
    if failed:
        raise typer.Exit(code=int(ExitCode.GENERATION_FAILURE))


@voice_app.command("doctor")
def voice_doctor(project: ProjectOption) -> None:
    """Verify each isolated speech worker without loading model weights."""

    try:
        loaded = load_project(project)
        report = doctor_backends(loaded)
    except AudiobookError as error:
        _fail(error)
        return
    checks = cast(list[dict[str, object]], report["checks"])
    table = Table(title="Speech workers")
    table.add_column("Backend")
    table.add_column("Status")
    table.add_column("Detail")
    failed = False
    for check in checks:
        status = str(check["status"])
        failed = failed or status == "fail"
        table.add_row(
            str(check["backend"]),
            status,
            str(check.get("error", check.get("data", ""))),
        )
    console.print(table)
    if failed:
        raise typer.Exit(code=int(ExitCode.ENVIRONMENT_FAILURE))


@voice_app.command("approve")
def voice_approve(
    project: ProjectOption,
    candidate: Annotated[str, typer.Option("--candidate", help="Selected candidate ID.")],
    approver: Annotated[str, typer.Option("--approver", help="Human approver name.")],
    confirm_reviewed: Annotated[
        bool,
        typer.Option(
            "--confirm-reviewed",
            help="Confirm the scorecard, integrity checks, and pronunciation trials are complete.",
        ),
    ] = False,
    waive_scorecard: Annotated[
        bool,
        typer.Option(
            "--waive-scorecard",
            help="Record an explicit project-owner waiver instead of numeric scores.",
        ),
    ] = False,
    waiver_rationale: Annotated[
        str,
        typer.Option("--waiver-rationale", help="Reason for waiving numeric scoring."),
    ] = "",
) -> None:
    """Freeze a human-selected production voice after listening review."""

    if confirm_reviewed and waive_scorecard:
        console.print("[red]Error:[/red] choose review confirmation or scorecard waiver, not both.")
        raise typer.Exit(code=int(ExitCode.INVALID_INPUT))
    if not confirm_reviewed and not waive_scorecard:
        console.print(
            "[yellow]Approval required:[/yellow] complete the scorecard and pass "
            "--confirm-reviewed, or explicitly pass --waive-scorecard."
        )
        raise typer.Exit(code=int(ExitCode.APPROVAL_REQUIRED))
    if waive_scorecard and not waiver_rationale.strip():
        console.print("[red]Error:[/red] --waiver-rationale is required with a waiver.")
        raise typer.Exit(code=int(ExitCode.INVALID_INPUT))
    try:
        loaded = load_project(project)
        profile = approve_voice(
            loaded,
            candidate,
            approver,
            scorecard_waived=waive_scorecard,
            waiver_rationale=waiver_rationale,
        )
    except AudiobookError as error:
        _fail(error)
        return
    console.print(f"[green]Voice locked:[/green] {candidate}")
    console.print(f"Profile: {profile}")


@manifest_app.command("validate")
def manifest_validate(project: Annotated[Path, typer.Option("--project", exists=True)]) -> None:
    """Validate a generated project manifest."""

    project_dir = project.resolve()
    if project_dir.is_file():
        project_dir = project_dir.parent
    try:
        manifest = validate_manifest(project_dir)
    except AudiobookError as error:
        _fail(error)
        return
    console.print(
        f"[green]PASS[/green] manifest schema {manifest.schema_version}: "
        f"{project_dir / 'manifest.json'}"
    )


@schema_app.command("export")
def schema_export(
    output: Annotated[Path, typer.Option("--output", file_okay=False)] = Path("schemas"),
) -> None:
    """Export current persisted JSON Schemas."""

    export_schemas(output.resolve())
    console.print(f"Wrote schemas to {output.resolve()}")


def main() -> None:
    try:
        app()
    except AudiobookError as error:
        console.print(f"[red]Error:[/red] {error}")
        sys.exit(int(error.exit_code))
    except json.JSONDecodeError as error:
        console.print(f"[red]Invalid JSON:[/red] {error}")
        sys.exit(int(ExitCode.INVALID_INPUT))


if __name__ == "__main__":
    main()
