# AGENTS.md — LLM Guide for mcp-sap-list

This file explains how the repository works and how to make changes to it correctly. Read this before editing any files.

---

## What this repo does

This is a **curated, auto-generated list** of SAP-related MCP servers, AI skills, and adjacent developer tools hosted on GitHub.

The `README.md` is **never edited by hand**. It is always generated from structured data via scripts. The pipeline is:

```
data/catalog.json          ← source of truth for entries
data/overrides.json        ← manual metadata corrections (e.g. license)
         │
         ▼
scripts/enrich-data.mjs    ← fetches live GitHub metadata (stars, license, lastChange)
         │
         ▼
generated/catalog.enriched.json
         │
         ▼
scripts/render-readme.mjs  ← renders README.md from template + enriched data
templates/README.template.md
         │
         ▼
README.md                  ← final output, committed to repo
```

Run `npm run build` to execute the full pipeline locally.

---

## How to add a new entry

**All new entries go into `data/catalog.json`.** That is the only file you need to edit to add a repo to the list.

### Step 1 — Choose the right section

`catalog.json` has three top-level arrays:

| Key | What goes here |
|---|---|
| `categories` | MCP servers, grouped by topic (ABAP/ADT, OData, Docs, etc.) |
| `skills` | AI skill files / prompt packs (Claude Code skills, Kiro packs, etc.) |
| `adjacentTools` | Useful non-MCP tools adjacent to the SAP AI dev ecosystem |

Each `categories` entry has an `id` and `title`. Current category IDs:

- `sap-mcp-server` — Official SAP MCP servers
- `sap-docs-mcp-server` — SAP documentation MCP servers
- `abap-and-adt-mcp-server` — ABAP/ADT MCP servers
- `sap-integration` — SAP Integration Suite / CPI
- `sap-datasphere` — SAP Datasphere / BDC
- `sap-odata-gateway-graph-mcp-server` — OData / Gateway / SAP Graph bridges
- `sap-gui` — SAP GUI automation
- `sap-hana` — SAP HANA

### Step 2 — Add the entry object

Append a new object to the `entries` array of the correct category (or to `skills` / `adjacentTools`).

**Standard GitHub repo entry:**

```json
{
  "type": "Community SAP",
  "name": "My SAP MCP Server",
  "repo": "owner/repo-name",
  "purpose": "One sentence describing what it does.",
  "notes": "Optional extra context or caveats."
}
```

**Monorepo sub-package** (repo contains the project in a subfolder):

```json
{
  "type": "SAP",
  "name": "SAP Fiori MCP Server",
  "repo": "SAP/open-ux-tools",
  "repoPath": "packages/fiori-mcp-server",
  "displayUrl": "https://github.com/SAP/open-ux-tools/tree/main/packages/fiori-mcp-server",
  "purpose": "Fiori app generation and modification workflows.",
  "notes": "MCP package inside SAP Open UX Tools monorepo."
}
```

**Non-GitHub URL** (documentation page, topic page, etc.):

```json
{
  "type": "SAP",
  "name": "SAP Build Code and Joule",
  "url": "https://pages.community.sap.com/topics/build-code",
  "linkLabel": "SAP Build Code Topic",
  "purpose": "Entry point for SAP Build Code and Joule-related resources.",
  "notes": "Official SAP topic page, not a single repository."
}
```

### Field reference

| Field | Required | Description |
|---|---|---|
| `type` | yes | `"SAP"` for official SAP org repos, `"Community SAP"` for everything else |
| `name` | yes | Display name shown in the README table |
| `repo` | yes* | `owner/repo` — omit only for non-GitHub URLs |
| `purpose` | yes | One concise sentence. End with a period. |
| `notes` | no | Extra context, caveats, setup requirements |
| `repoPath` | no | Sub-path inside a monorepo (shown in the link label) |
| `displayUrl` | no | Override the link URL (use with `repoPath` for monorepos) |
| `url` | no | Use instead of `repo` for non-GitHub entries |
| `linkLabel` | no | Custom link label when using `url` |

### Step 3 — Run the build

```bash
npm run build
```

This will:
1. Fetch live metadata for all repos (requires `GH_TOKEN` in `.env` for best results)
2. Apply any manual overrides from `data/overrides.json`
3. Regenerate `README.md`

### Step 4 — Commit both files

Always commit `data/catalog.json` together with the updated `README.md` and `generated/catalog.enriched.json`.

---

## How to fix incorrect metadata (e.g. wrong license)

If a repo's license, description, or other metadata is wrong or missing (e.g. the license is only stated in the README, not detected by GitHub), add a manual override to `data/overrides.json`:

```json
{
  "repos": {
    "owner/repo": {
      "license": "MIT"
    }
  }
}
```

Overrides are applied as the last step of `enrich-data.mjs` and are **never overwritten** by automated runs. Supported fields: any key in a `repoMetadata` entry (`license`, `description`, etc.).

---

## Rules and constraints

- **Never edit `README.md` directly.** It is overwritten on every build.
- **Never edit `generated/catalog.enriched.json` directly.** It is overwritten on every build.
- Forks are automatically excluded from all rendered tables — do not add fork repos to the catalog.
- The `type` field must be either `"SAP"` or `"Community SAP"`. No other values are used.
- `purpose` should be one sentence, ending with a period, describing what the tool does for a developer — not marketing language.
- Do not add entries without an open-source license (check `data/overrides.json` if the license is only declared informally).

---

## File map

```
data/
  catalog.json              ← edit this to add/remove entries
  overrides.json            ← edit this to fix metadata

scripts/
  enrich-data.mjs           ← fetches GitHub metadata, writes enriched JSON
  render-readme.mjs         ← renders README.md from template + enriched JSON

templates/
  README.template.md        ← README structure and section headings

generated/
  catalog.enriched.json     ← auto-generated, do not edit

docs/
  AUTOMATION.md             ← human-readable automation and process docs

.github/
  workflows/
    update-sap-mcp-list.yml ← daily GitHub Actions workflow
  ISSUE_TEMPLATE/
    add-entry.yml           ← issue form for community submissions

README.md                   ← auto-generated output
LICENSE                     ← MIT
```
