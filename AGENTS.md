# AGENTS.md — LLM Guide for mcp-sap-list

This file explains how the repository works and how to make changes to it correctly. Read this before editing any files.

---

## What this repo does

This is a **curated, auto-generated list** of SAP-related MCP servers, AI skills, Claude plugins, and adjacent developer tools hosted on GitHub.

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

**New list entries go into `data/catalog.json`.** For any new GitHub **`repo`**, also update **`CHANGELOG.md`** (see Step 3) so the “new repositories” link in the README stays accurate.

### Step 1 — Choose the right section

`catalog.json` has four top-level arrays:

| Key | What goes here |
|---|---|
| `categories` | MCP servers, grouped by topic (ABAP/ADT, OData, Docs, etc.) |
| `skills` | Non-Claude AI skill files / prompt packs (Kiro packs, etc.) |
| `claudePlugins` | Claude Code plugins and Claude-compatible SAP skill packs |
| `adjacentTools` | Useful non-MCP tools adjacent to the SAP AI dev ecosystem |

Each `categories` entry has an `id` and `title`. Categories are grouped by SAP domain so the README and the web catalog stay easy to scan. Current category IDs:

- `sap-mcp-server` — Official SAP MCP servers (SAP GitHub orgs)
- `sap-skills` — Official SAP AI skills (SAP GitHub orgs)
- `abap-and-adt-mcp-server` — ABAP / ADT MCP servers (the largest group)
- `sap-docs-mcp-server` — SAP documentation and knowledge MCP servers
- `odata-gateway-graph` — OData, Gateway, and SAP Graph bridges, incl. the odata-mcp-proxy config-driven family (BTP, CI, AI Core)
- `sap-integration` — SAP Integration Suite / CPI / PI
- `sap-data-analytics` — Data, analytics, and HANA: Datasphere, BDC, BW modeling, HANA, SAP Analytics Cloud
- `sap-gui` — SAP GUI automation
- `sap-operations-lifecycle` — Operations, monitoring, and lifecycle: Cloud ALM, Focused Run
- `sap-business-security` — Security, HR, and other/general SAP MCP servers

When adding an MCP server, place it in the closest domain category above. Only create a new category when several entries share a domain that none of the existing categories cover; a single new entry usually fits an existing group (`sap-business-security` is the catch-all). If you add or rename a category, also update `templates/README.template.md` (section heading, navigation list, and the `{{CATEGORY:<id>}}` placeholder) so the render picks it up.

### Step 2 — Add the entry object

Append a new object to the `entries` array of the correct category (or to `skills` / `claudePlugins` / `adjacentTools`).

**Standard GitHub repo entry:**

```json
{
  "type": "Community SAP",
  "name": "My SAP MCP Server",
  "addedAt": "2026-07-13",
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
  "addedAt": "2026-07-13",
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
  "addedAt": "2026-07-13",
  "url": "https://pages.community.sap.com/topics/build-code",
  "linkLabel": "SAP Build Code Topic",
  "purpose": "Entry point for SAP Build Code and Joule-related resources.",
  "notes": "Official SAP topic page, not a single repository."
}
```

**Non-GitHub git repository** (Gitea, GitLab, Bitbucket, self-hosted, etc.):

```json
{
  "type": "Community SAP",
  "name": "Example Non-GitHub MCP",
  "addedAt": "2026-07-13",
  "url": "https://git.example.dev/owner/repo",
  "linkLabel": "git.example.dev/owner/repo",
  "purpose": "What it does.",
  "notes": "Hosted on a non-GitHub git server. Metadata is not auto-fetched.",
  "license": "MIT",
  "lastChange": "2026-04-26",
  "stars": 12
}
```

For non-GitHub entries you can optionally include inline `license`, `lastChange` (ISO date), and `stars` (integer). These render into the table the same way as fetched GitHub metadata. Leave them out if you don't have a reliable value — the columns will show `-` and `NO LICENSE FOUND`. The enrichment script does not touch these fields; treat them as a one-time manual snapshot.

### Field reference

| Field | Required | Description |
|---|---|---|
| `type` | yes | `"SAP"` for official SAP org repos, `"Community SAP"` for everything else |
| `name` | yes | Display name shown in the README table |
| `addedAt` | yes | Date the item was first added to the catalog (`YYYY-MM-DD`); use the commit date or today when preparing the commit |
| `repo` | yes* | `owner/repo` — omit only for non-GitHub URLs |
| `purpose` | yes | One concise sentence. End with a period. |
| `notes` | no | Extra context, caveats, setup requirements |
| `repoPath` | no | Sub-path inside a monorepo (shown in the link label) |
| `displayUrl` | no | Override the link URL (use with `repoPath` for monorepos) |
| `url` | no | Use instead of `repo` for non-GitHub entries |
| `linkLabel` | no | Custom link label when using `url` |
| `license` | no | Inline license for `url` entries (e.g. `MIT`). Ignored for `repo` entries. |
| `lastChange` | no | Inline last-change date for `url` entries (ISO 8601). Ignored for `repo` entries. |
| `stars` | no | Inline star count for `url` entries (integer). Ignored for `repo` entries. |

### Step 3 — Update CHANGELOG.md (new GitHub repos only)

The README links to [`CHANGELOG.md`](CHANGELOG.md) at the top so readers can see **when new repositories were added**. Whenever you add a catalog entry that includes a `repo` field (including `skills` / `claudePlugins` / `adjacentTools` entries that point at GitHub), append a line to `CHANGELOG.md`:

1. Use the **commit date** (or today’s date if you are about to commit) as the section heading: `## YYYY-MM-DD`.
2. If that date already has a section, add a bullet under it; otherwise create a new `## YYYY-MM-DD` section **above** older dates (newest first).
3. Each bullet should be a markdown link to `https://github.com/owner/repo` plus a short dash and label, e.g. `` [`owner/repo`](https://github.com/owner/repo) — One-line description. ``
4. If you add a **new category** block in `catalog.json` (not just a new repo), mention it in the bullet (e.g. new category name + the repo).

**Skip** `CHANGELOG.md` when the change is only metadata, text edits, or `overrides.json`. **Skip** for entries that use only `url` (no GitHub `repo`) unless you want a one-line note there for visibility.

### Step 4 — Run the build

```bash
npm run build
```

This will:
1. Validate that every entry has a valid `addedAt` date
2. Fetch live metadata for all repos (requires `GH_TOKEN` in `.env` for best results)
3. Apply any manual overrides from `data/overrides.json`
4. Regenerate `README.md`

### Step 5 — Commit the changed files

Always commit `data/catalog.json` together with the updated `README.md`, `generated/catalog.enriched.json`, and **`CHANGELOG.md`** when you edited it.

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
- **Update `CHANGELOG.md`** when adding a new entry with a GitHub `repo` (see Step 3 above). The daily workflow does not maintain it.
- Every catalog entry must have an `addedAt` date in `YYYY-MM-DD` format. Preserve it when moving, renaming, or recategorizing an existing item.
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
CHANGELOG.md                ← manual log of newly added repos (update when adding entries)
LICENSE                     ← MIT
```
