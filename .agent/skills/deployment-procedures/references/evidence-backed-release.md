# Evidence-backed release gate

Use this gate when releasing code, reviewing a proposed release, or deciding whether a change is local, pushed, deployed, or verified live. Adapt commands to the repository's own documentation and deployment architecture.

## Inputs and stopping condition

Required inputs:

- the intended change scope and target environment;
- the repository's test, build, deployment, and rollback paths;
- the critical user flows affected by the change;
- the current worktree, branch, and upstream state.

Stop when every applicable evidence layer below has a recorded result, the release state is stated precisely, and any unverified external step is named. A failed or unavailable layer is an explicit limitation, not evidence of success.

## Establish scope before testing

1. Inspect the worktree and identify unrelated user changes.
2. Define the files and behaviours that belong to this release.
3. Review the actual diff, including staged paths, before committing or deploying.
4. Preserve unrelated changes; stage explicit paths when the worktree is mixed.
5. Identify the rollback unit, such as a commit, saved version, image tag, or migration reversal plan.

Do not call a worktree clean, a commit scoped, or a branch current without checking it in the same run.

## Verify in layers

Use the smallest sufficient set for the risk, but do not substitute one layer for another.

| Layer | Evidence to capture |
|---|---|
| Static quality | Relevant lint, type, schema, syntax, or security checks |
| Automated behaviour | Targeted tests for changed behaviour, then the appropriate broader suite |
| User workflow | Critical interactions driven in a real browser or application, including error/console checks |
| Production artefact | Production build and, where separate, deployment assembly/package output |
| Repository state | Reviewed diff, explicit staged paths, commit identifier, upstream/push status |
| Delivery system | CI/CD run identifier and terminal result for the exact revision |
| Live system | Public or environment-specific health checks and affected user flows against the deployed revision |

A page loading successfully is not feature coverage. Exercise the changed interaction and inspect its observable result. When timing, media, layout, or streaming matters, inspect the complete relevant sequence rather than relying only on checkpoints.

## Use precise release states

Report the highest state actually established:

1. **Verified locally** — local checks passed; no claim about a commit or remote system.
2. **Committed locally** — the exact commit exists locally; not necessarily pushed.
3. **Pushed** — the exact revision is present on the intended remote branch.
4. **CI passed** — the delivery workflow for that exact revision completed successfully.
5. **Deployed** — the target platform reports that exact revision/version as deployed.
6. **Verified live** — environment checks and critical affected flows passed against the deployed revision.

Never infer a higher state from a lower one. In particular, a local build or commit is not deployment evidence, and a successful CI build is not automatically proof that the public site or service is healthy.

## Record a compact evidence ledger

The handoff should include:

- change scope and excluded unrelated work;
- test/build/browser results with meaningful counts or named checks;
- commit or version identifier and whether it was pushed;
- CI/deployment identifier and terminal status, if applicable;
- live URLs or environment flows checked and their results;
- rollback unit;
- limitations, skipped credential-gated tests, unavailable tools, and user-owned external steps.

Distinguish product failures from tooling or infrastructure limitations. Do not turn an unavailable renderer, rate-limited audit, sandbox restriction, or skipped live test into a passing result.

## External ownership boundary

Some final evidence belongs to another system or to the user, such as Search Console indexing, app-store approval, human audio judgement, or a customer receipt. Verify everything available in scope, then name the remaining source of truth and the exact confirmation needed. Do not keep polling an external system without a user-requested monitor or a bounded wait.
