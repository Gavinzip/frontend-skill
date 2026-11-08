# Save and reuse approved design methods

Run commands from the directory containing `SKILL.md`. The standard-library helper requires Python 3.9 or newer. Its default library is `~/.local/share/frontend-skill/patterns`, outside the installed skill and repository. To use an existing compatible library or another private directory, pass `--library /absolute/library` before the command. Keep project data and approval records under the user's control.

## Find an applicable version

```sh
python3 scripts/patterns.py find 'submit feedback' --project 'github.com/owner/project'
python3 scripts/patterns.py verify project-submit-feedback v1
```

Use one stable project ID across its checkouts. A Git project can use `host/owner/repository` with credentials, query parameters and transport removed. The query returns the newest approved version for matching project and global scopes. Candidates stay out of reuse. A later retired record stops reuse and retains the history. Read applicability, source, license and validation before adapting a payload. Use the exact pattern ID and version returned by `find` when verifying in the same library.

## Capture a method

Capture only when the user asks to save a design or reusable implementation. Default to the current project. Global scope requires explicit approval for reuse across projects. An accepted visual reference, an accepted implementation and a candidate describe different evidence. Verify the actual approval and record the scope and result in the manifest.

Pattern IDs are unique within a library. Prefix a project pattern's ID with a short, distinct project slug to avoid collisions with the same design method in another project. Review an explicit list of files. Include only what implements or explains the pattern. Exclude credentials, internal data, unrelated business code, and build or dependency output. Keep relevant license notices. The helper screens common secret shapes and verifies captured bytes. Review the actual selected content and rights as part of saving.

```sh
python3 scripts/patterns.py capture --spec /absolute/spec.json --source /absolute/project
```

This example shows the specification. Replace the sample evidence, version and paths with details from the real task.

```json
{
  "id": "project-submit-feedback",
  "version": "v1",
  "title": "Submit feedback",
  "status": "approved",
  "kind": "implementation",
  "scope": {"kind": "project", "project": "github.com/owner/project"},
  "approval": {"evidence": "Where the user approved this implementation"},
  "tags": ["submit", "form", "async"],
  "applicability": "Single submit control with a server-confirmed result",
  "recipe": "Which states, controls and timing to preserve or adapt",
  "dependencies": [],
  "provenance": {"source": "Actual source and revision", "license": "Applicable rights and notice"},
  "validation": {"observed": "Actual checks", "limits": "Conditions still unverified"},
  "files": ["src/components/SubmitFeedback.tsx"]
}
```

Use `kind: reference` for a visual reference whose implementation was not approved. A reference may carry an empty payload. Use `status: candidate` while acceptance is pending. Global entries use `scope.kind: global` and a `scope.evidence` field describing the user's cross-project approval. Revisions get new version IDs. Changing a scope requires a new pattern ID. Use a `retired` record and the user's retirement evidence to stop reuse while keeping prior versions.

`list` inventories all entries. A capture is local. Reusing a pattern in a new context still requires checking the target stack and product flow. Use [browser verification](verification.md) for the adapted result.
