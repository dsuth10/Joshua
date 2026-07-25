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
from audiobook_studio.project_store import (
    build_source_metadata,
    export_schemas,
    load_project,
    persist_extraction,
    validate_manifest,
)

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
