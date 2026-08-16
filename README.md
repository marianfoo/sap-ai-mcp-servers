# SAP MCP Servers, SAP AI Skills, and Claude Plugins (Open Source)

Comprehensive list of SAP-related MCP servers, SAP AI development skills, and Claude plugin repositories.

> [!TIP]
> **Browse the interactive catalog:** [sap-ai-tools.marianzeis.de](https://sap-ai-tools.marianzeis.de/)
>
> Use the web UI for search, filters, sorting, package type colors, repository activity signals, and mobile-friendly browsing.

**New repositories:** [CHANGELOG.md](CHANGELOG.md) — dates when entries were added to this list.

> [!IMPORTANT]
> Last generated: **2026-08-16**
>
> Scope:
> - Open source or source-available repositories — primarily GitHub, with non-GitHub git hosts (Gitea, GitLab, etc.) also accepted
> - SAP-related MCP servers, MCP SDKs, Claude plugins/skills, and adjacent SAP AI developer assets
> - Forks are excluded automatically from rendered tables
> - Non-GitHub entries are listed without auto-fetched metadata (stars, license, last change)

## Add a missing entry

Know a project that belongs here? [Open an issue using the "Add new entry" template](../../issues/new?template=add-entry.yml) — fill in the category, repo, purpose, and a short note. That's it.

## Navigation

- **Official SAP**
  - [Official SAP MCP Servers](#official-sap-mcp-servers)
  - [Official SAP AI Skills & Claude Plugins](#official-sap-ai-skills--claude-plugins)
- **Community MCP Servers**
  - [ABAP & ADT](#abap--adt)
  - [SAP Docs & Knowledge](#sap-docs--knowledge)
  - [OData, Gateway & Graph](#odata-gateway--graph)
  - [SAP Integration (CPI / PI)](#sap-integration-cpi--pi)
  - [Data, Analytics & HANA](#data-analytics--hana)
  - [SAP GUI Automation](#sap-gui-automation)
  - [Operations, Monitoring & Lifecycle](#operations-monitoring--lifecycle)
  - [Business Apps, Security & Governance](#business-apps-security--governance)
- **[Community SAP AI Skills & Claude Plugins](#community-sap-ai-skills--claude-plugins)**
- **[Libraries, SDKs & Adjacent Tools](#libraries-sdks--adjacent-tools)**

# Official SAP

Repositories published under official SAP GitHub organizations.

## Official SAP MCP Servers

MCP servers built and maintained by SAP — Fiori app generation, CAP, UI5 and UI5 Web Components, the Mobile Development Kit, ADT access from ABAP Development Tools for VS Code, and SAP LeanIX enterprise architecture.

| Name | Repository | Purpose | License | Stars | Last Change |
| --- | --- | --- | --- | ---: | --- |
| SAP Fiori MCP Server | [SAP/open-ux-tools/packages/fiori-mcp-server](https://github.com/SAP/open-ux-tools/tree/main/packages/fiori-mcp-server) | Fiori app generation and modification workflows. | Apache-2.0 | 155 | 2026-08-14 |
| CAP MCP Server | [cap-js/mcp-server](https://github.com/cap-js/mcp-server) | AI-assisted CAP development with CDS-aware context. | Apache-2.0 | 109 | 2026-08-13 |
| UI5 MCP Server | [UI5/mcp-server](https://github.com/UI5/mcp-server) | UI5-aware development support for OpenUI5 and SAPUI5. | Apache-2.0 | 97 | 2026-08-13 |
| SAP MDK MCP Server | [SAP/mdk-mcp-server](https://github.com/SAP/mdk-mcp-server) | AI-assisted SAP Mobile Development Kit workflows. | Apache-2.0 | 34 | 2026-08-14 |
| UI5 Web Components MCP Server | [UI5/webcomponents-mcp-server](https://github.com/UI5/webcomponents-mcp-server) | AI-assisted development with UI5 Web Components (component API, guidelines, docs). | Apache-2.0 | 19 | 2026-08-05 |
| ADT MCP Server | [SAP Help Portal](https://help.sap.com/docs/abap-cloud/abap-development-tools-for-visual-studio-code/enabling-adt-mcp-server?locale=en-US) | Enables MCP clients to access ADT capabilities from ABAP Development Tools for Visual Studio Code. | **NO LICENSE FOUND** | - | - |
| SAP LeanIX MCP Server | [help.sap.com/leanix-mcp-server](https://help.sap.com/docs/leanix/ea/mcp-server) | Hosted MCP server that connects AI agents to SAP LeanIX enterprise architecture data — inventory, automations, calculations, and custom reports. | **NO LICENSE FOUND** | - | - |

## Official SAP AI Skills & Claude Plugins

AI skills and Claude Code plugins maintained by SAP. The **Packages** column shows what each repository ships: a skill pack, a Claude Code plugin, or both.

| Name | Repository | Purpose | Packages | License | Stars | Last Change |
| --- | --- | --- | --- | --- | ---: | --- |
| UI5 Web Components Agent Skills | [UI5/webcomponents](https://github.com/UI5/webcomponents) | Agent skills shipped with the UI5 Web Components library covering accessibility (ARIA, keyboard, screen readers) and styling (CSS shadow parts, custom states, and variables). | Skill | Apache-2.0 | 1,770 | 2026-08-16 |
| SAP AI Skills Library | [SAP/ai-skills-library](https://github.com/SAP/ai-skills-library) | SAP-maintained library of AI skills for digital assistants — discover, search, filter, and install via a skills CLI. | Skill | Apache-2.0 | 42 | 2026-07-30 |
| UI5 Plugins for Coding Agents | [UI5/plugins-coding-agents](https://github.com/UI5/plugins-coding-agents) | Provide UI5-specific plugins for coding agents — project creation, UI5 error fixing, and framework guidance. | Claude Plugin | Apache-2.0 | 33 | 2026-08-11 |
| SAP Joule A2A Agent Toolkit Skills | [SAP-samples/joule-a2a-agent-toolkit](https://github.com/SAP-samples/joule-a2a-agent-toolkit) | Skills for the SAP BTP, Cloud Foundry, and Joule command-line tools and for building and deploying custom Joule A2A (agent-to-agent) agents on SAP BTP. | Skill | Apache-2.0 | 30 | 2026-04-21 |
| CAP Agentic Engineered Skills | [SAP-samples/cap-agentic-engineered](https://github.com/SAP-samples/cap-agentic-engineered) | Provide reusable MCP-routing AGENTS.md and SAP skills for CAP and Fiori Elements agentic development. | Skill | Apache-2.0 | 11 | 2026-05-27 |
| SAP Automation Pilot Agent Skills | [SAP/automation-pilot-agent-skills](https://github.com/SAP/automation-pilot-agent-skills) | Skills for generating, reviewing, debugging, and managing SAP Automation Pilot commands, executors, schedules, and MCP servers through the Automation Pilot Content and Executions APIs. | Skill | Apache-2.0 | 9 | 2026-07-30 |
| CAP Skills | [capire/skills](https://github.com/capire/skills) | Provide curated skills that help AI coding agents build and maintain SAP Cloud Application Programming Model applications. | Skill + Claude Plugin | Apache-2.0 | 8 | 2026-08-12 |
| SAP LeanIX AI Plugins | [SAP/leanix-ai-plugins](https://github.com/SAP/leanix-ai-plugins) | Claude plugin and agent skills that extend coding agents with SAP LeanIX enterprise architecture workflows — building and debugging LeanIX automations and calculations — via the LeanIX MCP server. | Skill + Claude Plugin | Apache-2.0 | 1 | 2026-07-29 |
| SAP UI Theme Designer Plugins for Coding Agents | [SAP/ui-theme-designer-plugins-for-coding-agents](https://github.com/SAP/ui-theme-designer-plugins-for-coding-agents) | Equip coding agents with knowledge and tooling for the SAP Design System, SAP Fiori design tokens, and UI theme designer, via the design-tokens and help skills. | Skill + Claude Plugin | Apache-2.0 | 1 | 2026-08-03 |
| SAP AI Skills Library (skills.cloud.sap) | [skills.cloud.sap](https://skills.cloud.sap/) | Official SAP portal to discover and install AI skills, plugins, marketplaces, and MCP servers for SAP Joule and coding agents, each installable with a single command. | Skill + Claude Plugin | **NO LICENSE FOUND** | - | - |

# Community MCP Servers

Community-built MCP servers, grouped by the SAP domain they target.

## ABAP & ADT

Connect AI agents to ABAP systems, mostly through the ADT REST APIs — read, write, test, transport, and document ABAP code on ECC, S/4HANA, and ABAP Cloud. Also includes an SDK for building MCP servers in ABAP itself.

| Name | Repository | Purpose | License | Stars | Last Change |
| --- | --- | --- | --- | ---: | --- |
| Vibing Steampunk | [oisee/vibing-steampunk](https://github.com/oisee/vibing-steampunk) | ADT-to-MCP bridge for ABAP and AMDP workflows. | MIT | 440 | 2026-06-15 |
| MCP ABAP (abap-adt-api wrapper) | [mario-andreschak/mcp-abap-abap-adt-api](https://github.com/mario-andreschak/mcp-abap-abap-adt-api) | ABAP operations through wrapped ADT API layer. | MIT | 179 | 2026-07-10 |
| MCP ABAP ADT Server | [mario-andreschak/mcp-abap-adt](https://github.com/mario-andreschak/mcp-abap-adt) | ABAP system interaction via ADT APIs. | MIT | 170 | 2026-08-16 |
| ARC-1 SAP ADT MCP Server | [arc-mcp/arc-1](https://github.com/arc-mcp/arc-1) | Secure-by-default, enterprise-ready SAP ABAP MCP server for developer IDEs, Microsoft Copilot, and any MCP client via BTP OAuth and the ADT REST API. | MIT | 160 | 2026-08-13 |
| ABAP MCP Server SDK | [abap-ai/mcp](https://github.com/abap-ai/mcp) | Build MCP servers directly in ABAP. | MIT | 79 | 2026-07-19 |
| mcp-abap-adt | [fr0ster/mcp-abap-adt](https://github.com/fr0ster/mcp-abap-adt) | ABAP ADT MCP server with CRUD and cloud/on-prem support. | MIT | 78 | 2026-08-11 |
| ABAP Accelerator MCP Server | [aws-solutions-library-samples/guidance-for-deploying-sap-abap-accelerator-for-amazon-q-developer](https://github.com/aws-solutions-library-samples/guidance-for-deploying-sap-abap-accelerator-for-amazon-q-developer) | Enterprise-grade MCP server for SAP ABAP: create, test, document, and transform ABAP code via Amazon Q Developer and Kiro. | MIT-0 | 54 | 2026-08-11 |
| MCP server for SAP Cloudification Repository | [ClementRingot/ROSA](https://github.com/ClementRingot/ROSA) | Gives AI agents real-time knowledge of which SAP objects are released for ABAP Cloud / Clean Core — and what to use instead when they're not. | MIT | 25 | 2026-08-03 |
| erpl-adt | [DataZooDE/erpl-adt](https://github.com/DataZooDE/erpl-adt) | CLI plus MCP exposure for ABAP ADT operations. | Apache-2.0 | 16 | 2026-08-11 |
| ARC-1 ADT ABAP MCP Extension | [arc-mcp/arc1-adt-abap-mcp-ext](https://github.com/arc-mcp/arc1-adt-abap-mcp-ext) | Extend SAP's Eclipse ADT MCP server with read-only ABAP repository tools and optional auto-login for AI clients. | MIT | 6 | 2026-06-12 |
| Dassian ADT | [DassianInc/dassian-adt](https://github.com/DassianInc/dassian-adt) | MCP server for SAP ABAP development via ADT API — read, write, test, and deploy ABAP code without SAP GUI. | MIT | 6 | 2026-07-03 |
| MCP ABAP ADT Powerup | [babamba2/abap-mcp-adt-powerup](https://github.com/babamba2/abap-mcp-adt-powerup) | Expose comprehensive ABAP ADT development, diagnostics, and object management workflows through MCP. | MIT | 6 | 2026-04-29 |
| aibap.mcp | [Hochfrequenz/aibap.mcp](https://github.com/Hochfrequenz/aibap.mcp) | Expose the SAP ABAP ADT REST API as an MCP server for on-prem ECC and S/4HANA, covering source editing, debugging, transports, ATC, and customizing/package export. | MIT | 4 | 2026-08-14 |
| mcp-abap-adt (workskong) | [workskong/mcp-abap-adt](https://github.com/workskong/mcp-abap-adt) | Lightweight ADT adapter for ABAP metadata and source. | MIT | 3 | 2026-07-29 |
| ARC-1 LSP ABAP MCP Server | [arc-mcp/arc-1-lsp](https://github.com/arc-mcp/arc-1-lsp) | Expose SAP ABAP MCP tools by delegating ADT operations to SAP's headless adt-ls language server. | MIT | 2 | 2026-06-17 |
| MCP ABAP (Validation + Metadata) | [fgalastri/MCP_ABAP](https://github.com/fgalastri/MCP_ABAP) | ABAP validation and metadata tool surface. | MIT | 2 | 2025-08-24 |
| ABAP ADT MCP Server (buettnerjulian) | [buettnerjulian/abap-adt-mcp](https://github.com/buettnerjulian/abap-adt-mcp) | ABAP ADT MCP with object, metadata and analysis tools. | MIT | 1 | 2025-08-11 |
| ABAPDocMCP | [SaurabhVC/ABAPDocMCP](https://github.com/SaurabhVC/ABAPDocMCP) | Generate WRICEF technical specs from transport content. | MIT | 1 | 2026-02-18 |
| ABAP MCP Server (chandrashekhar-mahajan) | [chandrashekhar-mahajan/abap-mcp-server](https://github.com/chandrashekhar-mahajan/abap-mcp-server) | ABAP ADT REST based MCP tooling for development operations. | MIT | 0 | 2026-03-05 |
| Erhan Keseli Eclipse MCP | [git.epod.dev/erhan/epod-adt-mcp-updatesite](https://git.epod.dev/erhan/epod-adt-mcp-updatesite) | Lets Claude or Codex use Eclipse ADT as an MCP server with SSO-based authentication. | **NO LICENSE FOUND** | - | - |

## SAP Docs & Knowledge

Make SAP documentation, SAP Notes, and product knowledge searchable for AI agents.

| Name | Repository | Purpose | License | Stars | Last Change |
| --- | --- | --- | --- | ---: | --- |
| MCP SAP Docs (Upstream) | [marianfoo/mcp-sap-docs](https://github.com/marianfoo/mcp-sap-docs) | Unified SAP developer docs search over curated sources. | Apache-2.0 | 213 | 2026-08-05 |
| ABAP MCP Server (Downstream Variant) | [marianfoo/abap-mcp-server](https://github.com/marianfoo/abap-mcp-server) | ABAP-focused doc and knowledge variant. | Apache-2.0 | 85 | 2026-07-22 |
| SAP Notes MCP Server | [marianfoo/mcp-sap-notes](https://github.com/marianfoo/mcp-sap-notes) | Search and retrieve SAP Notes and KB content. | Apache-2.0 | 56 | 2026-06-02 |
| SAP AI Core Docs MCP | [nickels/sap-ai-docs-mcp](https://github.com/nickels/sap-ai-docs-mcp) | Semantic search across SAP AI Core docs. | **NO LICENSE FOUND** | 0 | 2025-11-21 |
| SAP BTP Docs MCP | [nickels/sap-btp-docs-mcp](https://github.com/nickels/sap-btp-docs-mcp) | Semantic search across SAP BTP documentation. | **NO LICENSE FOUND** | 0 | 2025-11-16 |

## OData, Gateway & Graph

Bridges that expose SAP OData, Gateway, and SAP Graph services as MCP tools. This category also contains the [odata-mcp-proxy](https://github.com/lemaiwo/odata-mcp-proxy) family: odata-mcp-proxy is the config-driven foundation, and BTP MCP Server, CI MCP Server, and AI Core MCP Server are config-only consumers of it (single JSON + BTP destinations, no custom code).

| Name | Repository | Purpose | License | Stars | Last Change |
| --- | --- | --- | --- | ---: | --- |
| OData MCP Bridge (Go) | [oisee/odata_mcp_go](https://github.com/oisee/odata_mcp_go) | Go OData-to-MCP bridge with v2/v4 support. | MIT | 138 | 2026-02-19 |
| SAP OData to MCP Server for BTP | [lemaiwo/btp-sap-odata-to-mcp-server](https://github.com/lemaiwo/btp-sap-odata-to-mcp-server) | Expose SAP OData services as MCP tools. | MIT | 129 | 2026-05-22 |
| OData MCP Wrapper (Python) | [oisee/odata_mcp](https://github.com/oisee/odata_mcp) | Bridge OData v2 services into MCP tools. | MIT | 38 | 2025-08-24 |
| OData MCP Proxy | [lemaiwo/odata-mcp-proxy](https://github.com/lemaiwo/odata-mcp-proxy) | Config-driven MCP server exposing OData/REST APIs as MCP tools; BTP destinations, dual transport (stdio/HTTP). | MIT | 27 | 2026-08-12 |
| SAP OData MCP Server (TypeScript) | [GutjahrAI/sap-odata-mcp-server](https://github.com/GutjahrAI/sap-odata-mcp-server) | TypeScript OData MCP implementation. | MIT | 12 | 2025-06-26 |
| CI MCP Server | [lemaiwo/ci-mcp-server](https://github.com/lemaiwo/ci-mcp-server) | SAP Cloud Integration (CPI) OData API as MCP tools. | MIT | 11 | 2026-05-16 |
| SAP OData MCP Server (Python) | [GutjahrAI/sap-odata-mcp-py](https://github.com/GutjahrAI/sap-odata-mcp-py) | Python OData MCP implementation. | **NO LICENSE FOUND** | 9 | 2025-07-09 |
| SAP Graph API Sandbox MCP | [CostingGeek/sap-mcp](https://github.com/CostingGeek/sap-mcp) | MCP wrapper for SAP Graph sandbox scenarios. | MIT | 6 | 2025-04-28 |
| SAP MCP Gateway Server | [midasol/sap-mcp-server](https://github.com/midasol/sap-mcp-server) | SAP Gateway/OData interaction via MCP. | MIT | 6 | 2026-05-07 |
| AI Core MCP Server | [lemaiwo/ai-core-mcp-server](https://github.com/lemaiwo/ai-core-mcp-server) | SAP AI Core lifecycle and admin APIs as MCP tools. | MIT | 5 | 2026-03-09 |
| BTP MCP Server | [lemaiwo/btp-mcp-server](https://github.com/lemaiwo/btp-mcp-server) | BTP Core Services (accounts, entitlements, provisioning) as MCP tools. | MIT | 1 | 2026-08-12 |

## SAP Integration (CPI / PI)

Operate SAP Integration Suite / Cloud Integration (CPI) and classic PI/PO from MCP clients — iFlows, message monitoring, B2B trading partner management, and migration analysis.

| Name | Repository | Purpose | License | Stars | Last Change |
| --- | --- | --- | --- | ---: | --- |
| MCP Integration Suite | [1nbuc/mcp-integration-suite](https://github.com/1nbuc/mcp-integration-suite) | General SAP Integration Suite/CPI operations. | **NO LICENSE FOUND** | 27 | 2025-12-24 |
| CPI MCP Server | [vadimklimov/cpi-mcp-server](https://github.com/vadimklimov/cpi-mcp-server) | SAP Cloud Integration operations via MCP. | MIT | 23 | 2026-06-30 |
| SAP CPI MCP Server (Keelside) | [Keelside/mcp-sap-cpi](https://github.com/Keelside/mcp-sap-cpi) | Monitor and manage SAP Cloud Integration messages, iFlows, security artifacts, and runtime status via MCP. | MIT | 6 | 2026-05-16 |
| MCP Trading Partner Management | [1nbuc/mcp-is-tpm](https://github.com/1nbuc/mcp-is-tpm) | SAP Integration Suite TPM workflows. | **NO LICENSE FOUND** | 2 | 2025-07-04 |
| SAP PI MCP Server | [lopezmas/sap-pi-mcp-server](https://github.com/lopezmas/sap-pi-mcp-server) | Expose read-only SAP PI/PO monitoring, Integration Directory, ESR mapping, and Value Mapping export tools through MCP for migration planning to SAP Integration Suite / CPI. | MIT | 0 | 2026-06-12 |

## Data, Analytics & HANA

MCP servers for SAP's data and analytics products: Datasphere, Business Data Cloud, BW/4HANA modeling, HANA, and SAP Analytics Cloud.

| Name | Repository | Purpose | License | Stars | Last Change |
| --- | --- | --- | --- | ---: | --- |
| HANA MCP Server | [HatriGt/hana-mcp-server](https://github.com/HatriGt/hana-mcp-server) | MCP integration for SAP HANA and HANA Cloud. | MIT | 63 | 2026-07-18 |
| BW Modeling MCP Server | [dnic-dev/bw-modeling-mcp](https://github.com/dnic-dev/bw-modeling-mcp) | Read, create, and modify SAP BW/4HANA objects directly in a live system via the internal BWMT REST API. | MIT | 55 | 2026-08-05 |
| SAP Datasphere MCP (MarioDeFelipe) | [MarioDeFelipe/sap-datasphere-mcp](https://github.com/MarioDeFelipe/sap-datasphere-mcp) | Feature-rich Datasphere API interaction via MCP. | MIT | 42 | 2026-08-10 |
| SAP Analytics Cloud MCP Server | [JumenEngels/sap_analytics_cloud_mcp](https://github.com/JumenEngels/sap_analytics_cloud_mcp) | Exposes SAP Analytics Cloud APIs as MCP tools. | MIT | 12 | 2026-03-02 |
| SAP Datasphere MCP (rahulsethi) | [rahulsethi/SAPDatasphereMCP](https://github.com/rahulsethi/SAPDatasphereMCP) | Datasphere read-only and analytics operations via MCP. | Apache-2.0 | 10 | 2026-07-01 |
| SAP Business Data Cloud MCP | [rahulsethi/SAPBDCMCP](https://github.com/rahulsethi/SAPBDCMCP) | MCP tooling for SAP Business Data Cloud workflows. | Apache-2.0 | 4 | 2026-07-06 |
| SAP Datasphere MCP Tools | [pmankineni/mcp-datasphere-tools](https://github.com/pmankineni/mcp-datasphere-tools) | Expose SAP Datasphere exploration, querying, modeling, administration, and audit workflows via MCP. | ISC | 1 | 2026-03-13 |

## SAP GUI Automation

Drive the classic SAP GUI through the Windows Scripting API — screen navigation, field input, table operations, and screenshots for workflows that have no API.

| Name | Repository | Purpose | License | Stars | Last Change |
| --- | --- | --- | --- | ---: | --- |
| MCP SAP GUI Server | [mario-andreschak/mcp-sap-gui](https://github.com/mario-andreschak/mcp-sap-gui) | Coordinate and input automation for SAP GUI. | MIT | 124 | 2025-02-26 |
| MCP SAP GUI (Scripting API) | [kts982/mcp-sap-gui](https://github.com/kts982/mcp-sap-gui) | Full SAP GUI for Windows automation via Scripting API — 52 MCP tools for screen discovery, navigation, field I/O, table and tree operations, and screenshot capture. | MIT | 24 | 2026-07-05 |
| SAPient MCP | [toni-ramchandani/sapient-mcp](https://github.com/toni-ramchandani/sapient-mcp) | RoboSAPiens-based SAP GUI automation server. | **NO LICENSE FOUND** | 11 | 2026-02-24 |
| sapgui.mcp | [Hochfrequenz/sapgui.mcp](https://github.com/Hochfrequenz/sapgui.mcp) | Expose SAP GUI Scripting API and SAP Web GUI interactions via FastMCP. | MIT | 5 | 2026-08-13 |
| sap_gui_mcp | [jduncan8142/sap_gui_mcp](https://github.com/jduncan8142/sap_gui_mcp) | SAP GUI Scripting API exposed via FastMCP. | MIT | 1 | 2025-12-01 |

## Operations, Monitoring & Lifecycle

Landscape operations and lifecycle management — query SAP Cloud ALM ITSM and SAP Focused Run system data from AI agents.

| Name | Repository | Purpose | License | Stars | Last Change |
| --- | --- | --- | --- | ---: | --- |
| SAP Cloud ALM ITSM MCP Server | [gregorwolf/cloud-alm-itsm-mcp](https://github.com/gregorwolf/cloud-alm-itsm-mcp) | Query installations within SAP Cloud ALM ITSM API with filtering and search. | **NO LICENSE FOUND** | 4 | 2026-03-19 |
| SAP FocusedRun MCP | [derekvincent/mcp-sap-focusedrun](https://github.com/derekvincent/mcp-sap-focusedrun) | Expose SAP Focused Run LMDB API endpoints with search and filtering via MCP. | Apache-2.0 | 1 | 2026-07-21 |

## Business Apps, Security & Governance

MCP servers for SAP line-of-business applications and cross-cutting concerns — security and compliance auditing, SuccessFactors HR, and general-purpose SAP system access.

| Name | Repository | Purpose | License | Stars | Last Change |
| --- | --- | --- | --- | ---: | --- |
| SAP SuccessFactors MCP Server | [aiadiguru2025/sf-mcp](https://github.com/aiadiguru2025/sf-mcp) | SuccessFactors HR operations via MCP tools. | MIT | 11 | 2026-07-04 |
| SAP MCP Server (MarkWuRY168) | [MarkWuRY168/SAP_MCP](https://github.com/MarkWuRY168/SAP_MCP) | Publish configurable SAP system tools through MCP services and a web management interface. | MIT | 2 | 2026-03-11 |
| SyntaAI SAP Security MCP Server | [SYNTAAI/sap-security-mcp](https://github.com/SYNTAAI/sap-security-mcp) | SAP security analysis and compliance auditing via MCP. 19 read-only tools for user access reviews, SoD violation checks, critical authorization detection, compliance reporting (SOX, GDPR, ISO 27001, NIST), RFC security analysis, password policy audits, and role/authorization review. | Apache-2.0 | 2 | 2026-03-10 |

# Community SAP AI Skills & Claude Plugins

Community-built AI skills, prompt packs, and Claude Code plugins for SAP development. Each repository is listed once — the **Packages** column shows whether it ships a skill pack, a Claude Code plugin, or both.

| Name | Repository | Purpose | Packages | License | Stars | Last Change |
| --- | --- | --- | --- | --- | ---: | --- |
| SAP Skills for Claude Code | [secondsky/sap-skills](https://github.com/secondsky/sap-skills) | Large SAP skill set for Claude Code across CAP, Fiori, ABAP and BTP. | Skill + Claude Plugin | GPL-3.0 | 409 | 2026-08-12 |
| ARC-1 SAP Skills & Claude Plugin | [arc-mcp/arc-1/skills](https://github.com/arc-mcp/arc-1/tree/main/skills) | ABAP development skills for coding agents — RAP service scaffolding, unit test generation, Clean Core audits, and legacy migration — also installable as a Claude Code plugin bundled with the ARC-1 MCP server. | Skill + Claude Plugin | MIT | 160 | 2026-08-13 |
| SuperClaude for SAP | [babamba2/superclaude-for-sap](https://github.com/babamba2/superclaude-for-sap) | Claude Code plugin and skill set for SAP ABAP development across ECC, S/4HANA, and ABAP Cloud systems. | Skill + Claude Plugin | MIT | 46 | 2026-07-20 |
| SAP Datasphere Plugin for Claude | [MarioDeFelipe/sap-datasphere-plugin-for-claude-cowork](https://github.com/MarioDeFelipe/sap-datasphere-plugin-for-claude-cowork) | Claude skills and MCP configuration for SAP Datasphere exploration, modeling, administration, and governance workflows. | Skill + Claude Plugin | MIT | 25 | 2026-05-08 |
| ABAP Skills for Claude Code | [matt1as/claude-abap-skills](https://github.com/matt1as/claude-abap-skills) | Provide opinionated ABAP Cloud rules and slash commands for Claude Code development. | Skill + Claude Plugin | Apache-2.0 | 23 | 2026-08-12 |
| RAP Skills | [weiserman/rap-skills](https://github.com/weiserman/rap-skills) | SAP RAP-focused Claude Code skills. | Skill | MIT | 22 | 2026-02-24 |
| sapcli Claude Code Plugin | [jfilak/sapcli-claude-plugin](https://github.com/jfilak/sapcli-claude-plugin) | ABAP system exploration and development skills and agents for Claude Code, built on top of sapcli. | Skill + Claude Plugin | Apache-2.0 | 16 | 2026-07-24 |
| SAP Commerce Skill | [Emenowicz/sap-commerce-skill](https://github.com/Emenowicz/sap-commerce-skill) | Provide SAP Commerce Cloud and Hybris development guidance, templates, and utilities for AI coding agents. | Skill | MIT | 13 | 2026-03-19 |
| SAP API Policy Skill | [marianfoo/sap-api-policy-skill](https://github.com/marianfoo/sap-api-policy-skill) | Assess whether an SAP API usage scenario aligns with the SAP API Policy, using evidence gathered from official SAP sources. | Skill | MIT | 9 | 2026-06-02 |
| SAP Power for Kiro | [mfigueir/sap-power](https://github.com/mfigueir/sap-power) | SAP development knowledge package for Kiro IDE. | Skill | GPL-3.0 | 9 | 2026-01-20 |
| sap-odata CLI Agent Skill | [kts982/sap-odata-explorer/skills/sap-odata-cli](https://github.com/kts982/sap-odata-explorer/tree/main/skills/sap-odata-cli) | Agent skill for the sap-odata CLI that lets coding agents discover SAP Gateway/OData services, inspect $metadata and SAP/UI5 annotations, run test queries, lint Fiori readiness, and browse offline EDMX snapshots. | Skill | MIT | 7 | 2026-08-12 |
| SAP Claude Skills | [KEIDAI-TechTime/sap-claude-skills](https://github.com/KEIDAI-TechTime/sap-claude-skills) | SAP add-on development skill bundles for Claude workflows. | Skill | **NO LICENSE FOUND** | 1 | 2026-03-03 |

# Libraries, SDKs & Adjacent Tools

Non-MCP-server projects that support the SAP AI developer ecosystem — SDKs and auth libraries for building MCP servers, IDE and CLI tooling, and reference material.

| Name | Repository | Purpose | License | Stars | Last Change |
| --- | --- | --- | --- | ---: | --- |
| ABAP Remote Filesystem for VS Code | [marcellourbani/vscode_abap_remote_fs](https://github.com/marcellourbani/vscode_abap_remote_fs) | Remote ABAP filesystem access in VS Code. | MIT | 372 | 2026-08-14 |
| SAP CLI (sapcli) | [jfilak/sapcli](https://github.com/jfilak/sapcli) | Python CLI for SAP ADT and RFC operations: ABAP unit tests, ATC checks, transports, gCTS, abapGit install, and more. | Apache-2.0 | 99 | 2026-08-13 |
| CAP MCP Plugin | [gavdilabs/cap-mcp-plugin](https://github.com/gavdilabs/cap-mcp-plugin) | Generates MCP servers from CAP services. | Apache-2.0 | 61 | 2026-07-17 |
| abap_wiki | [Gixsy95/abap_wiki](https://github.com/Gixsy95/abap_wiki) | Agent-driven engine that turns SAP S/4HANA custom ABAP objects into citable Markdown/Obsidian knowledge for humans and AI agents. | MIT | 42 | 2026-08-10 |
| GitHub Copilot for Eclipse | [eclipse-copilot/eclipse-copilot](https://github.com/eclipse-copilot/eclipse-copilot) | GitHub Copilot integration plugin for Eclipse IDE. | EPL-2.0 | 33 | 2026-04-27 |
| SAP TechEd 2025 CA261 Sample | [SAP-samples/teched2025-CA261](https://github.com/SAP-samples/teched2025-CA261) | Hands-on sample for AI + Fiori + MCP workflows. | Apache-2.0 | 12 | 2026-06-09 |
| SAP OData Explorer | [kts982/sap-odata-explorer](https://github.com/kts982/sap-odata-explorer) | Desktop app and CLI for exploring SAP Gateway OData services — catalog discovery, entity metadata with decoded SAP/UI5 annotations, test queries, Fiori-readiness lint, and an offline EDMX library. | MIT | 7 | 2026-08-12 |
| adt-ls TypeScript SDK | [arc-mcp/adt-ls](https://github.com/arc-mcp/adt-ls) | Provide a reusable TypeScript SDK for driving SAP's headless adt-ls language server from developer tools and CI. | Apache-2.0 | 6 | 2026-06-17 |
| @arc-mcp/xsuaa-auth | [arc-mcp/xsuaa-auth](https://github.com/arc-mcp/xsuaa-auth) | Drop-in XSUAA OAuth authentication and BTP principal propagation for MCP servers built on Express and the MCP SDK. | MIT | 2 | 2026-08-10 |
| arc-mcp-hub | [arc-mcp/mcp-hub](https://github.com/arc-mcp/mcp-hub) | Thin, deterministic multi-system MCP hub that fronts multiple ARC-1 instances (one SAP system each) behind one BTP front door with one login. | MIT | 0 | 2026-06-29 |
| SAP MCP Config | [Hochfrequenz/sap-mcp-config](https://github.com/Hochfrequenz/sap-mcp-config) | Provide shared Go and Python models for SAP credentials used by MCP servers. | MIT | 0 | 2026-08-11 |
| Amazon Q Developer for Eclipse (Official Docs) | [docs.aws.amazon.com/amazon-q-eclipse](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/q-in-IDE_setup.html) | Official setup docs for Amazon Q in Eclipse IDE. | **NO LICENSE FOUND** | - | - |
| GitHub Copilot in Eclipse (Official Docs) | [docs.github.com/eclipse-copilot](https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-in-the-ide?tool=eclipse) | Official setup and usage docs for Copilot in Eclipse. | **NO LICENSE FOUND** | - | - |
| SAP Build Code and Joule (Official Topic Page) | [SAP Build Code Topic](https://pages.community.sap.com/topics/build-code) | Entry point for SAP Build Code and Joule-related resources. | **NO LICENSE FOUND** | - | - |
