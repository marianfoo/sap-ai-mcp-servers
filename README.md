# SAP MCP Servers and SAP AI Skills (Open Source, GitHub)

Comprehensive list of SAP-related MCP servers and SAP AI development skills repositories.

> [!IMPORTANT]
> Last generated: **2026-03-05**
>
> Scope:
> - Open source or source-available repositories on GitHub
> - SAP-related MCP servers, MCP SDKs, and adjacent SAP AI developer assets
> - Forks are excluded automatically from rendered tables

## Add a missing entry

Know a project that belongs here? [Open an issue using the "Add new entry" template](../../issues/new?template=add-entry.yml) — fill in the category, repo, purpose, and a short note. That's it.

## Navigation

- [SAP MCP Servers and SAP AI Skills (Open Source, GitHub)](#sap-mcp-servers-and-sap-ai-skills-open-source-github)
  - [Navigation](#navigation)
- [SAP MCP Server](#sap-mcp-server)
- [SAP Community MCP Servers](#sap-community-mcp-servers)
  - [SAP Docs MCP Server](#sap-docs-mcp-server)
  - [ABAP and ADT MCP Server](#abap-and-adt-mcp-server)
  - [SAP Integration](#sap-integration)
  - [SAP Datasphere](#sap-datasphere)
  - [SAP OData Gateway Graph MCP Server](#sap-odata-gateway-graph-mcp-server)
  - [SAP GUI](#sap-gui)
  - [SAP HANA](#sap-hana)
  - [SAP Related Skills](#sap-related-skills)
  - [Adjacent SAP AI Developer Tools](#adjacent-sap-ai-developer-tools)

# SAP MCP Server

| Name | Repository | Purpose | Notes | License | Stars | Last Change |
| --- | --- | --- | --- | --- | ---: | --- |
| SAP Fiori MCP Server | [SAP/open-ux-tools/packages/fiori-mcp-server](https://github.com/SAP/open-ux-tools/tree/main/packages/fiori-mcp-server) | Fiori app generation and modification workflows. | MCP package inside SAP Open UX Tools monorepo. | Apache-2.0 | 130 | 2026-03-05 |
| CAP MCP Server | [cap-js/mcp-server](https://github.com/cap-js/mcp-server) | AI-assisted CAP development with CDS-aware context. | CAP-focused MCP server. | Apache-2.0 | 86 | 2026-03-03 |
| UI5 MCP Server | [UI5/mcp-server](https://github.com/UI5/mcp-server) | UI5-aware development support for OpenUI5 and SAPUI5. | Framework-specific MCP tooling. | Apache-2.0 | 64 | 2026-03-04 |
| SAP MDK MCP Server | [SAP/mdk-mcp-server](https://github.com/SAP/mdk-mcp-server) | AI-assisted SAP Mobile Development Kit workflows. | MDK-focused MCP server. | Apache-2.0 | 24 | 2026-02-23 |

# SAP Community MCP Servers

## SAP Docs MCP Server

| Name | Repository | Purpose | Notes | License | Stars | Last Change |
| --- | --- | --- | --- | --- | ---: | --- |
| MCP SAP Docs (Upstream) | [marianfoo/mcp-sap-docs](https://github.com/marianfoo/mcp-sap-docs) | Unified SAP developer docs search over curated sources. | Upstream source for SAP docs and ABAP variants. | Apache-2.0 | 137 | 2026-03-02 |
| ABAP MCP Server (Downstream Variant) | [marianfoo/abap-mcp-server](https://github.com/marianfoo/abap-mcp-server) | ABAP-focused doc and knowledge variant. | Derived from mcp-sap-docs upstream. | Apache-2.0 | 47 | 2026-03-02 |
| SAP Notes MCP Server | [marianfoo/mcp-sap-notes](https://github.com/marianfoo/mcp-sap-notes) | Search and retrieve SAP Notes and KB content. | Requires SAP support credentials/certificate setup. | Apache-2.0 | 41 | 2025-10-28 |
| SAP AI Core Docs MCP | [nickels/sap-ai-docs-mcp](https://github.com/nickels/sap-ai-docs-mcp) | Semantic search across SAP AI Core docs. | Documentation-focused MCP server. | **NO LICENSE FOUND** | 0 | 2025-11-21 |
| SAP BTP Docs MCP | [nickels/sap-btp-docs-mcp](https://github.com/nickels/sap-btp-docs-mcp) | Semantic search across SAP BTP documentation. | Documentation-focused MCP server. | **NO LICENSE FOUND** | 0 | 2025-11-16 |

## ABAP and ADT MCP Server

| Name | Repository | Purpose | Notes | License | Stars | Last Change |
| --- | --- | --- | --- | --- | ---: | --- |
| Vibing Steampunk | [oisee/vibing-steampunk](https://github.com/oisee/vibing-steampunk) | ADT-to-MCP bridge for ABAP and AMDP workflows. | ABAP coding and repo navigation focus. | MIT | 156 | 2026-03-01 |
| MCP ABAP (abap-adt-api wrapper) | [mario-andreschak/mcp-abap-abap-adt-api](https://github.com/mario-andreschak/mcp-abap-abap-adt-api) | ABAP operations through wrapped ADT API layer. | Community wrapper implementation. | MIT | 91 | 2025-02-27 |
| MCP ABAP ADT Server | [mario-andreschak/mcp-abap-adt](https://github.com/mario-andreschak/mcp-abap-adt) | ABAP system interaction via ADT APIs. | Early ABAP ADT MCP bridge project. | MIT | 88 | 2025-09-09 |
| ABAP MCP Server SDK | [abap-ai/mcp](https://github.com/abap-ai/mcp) | Build MCP servers directly in ABAP. | SDK/framework (not a ready-to-run business server by itself). | MIT | 59 | 2025-07-20 |
| ABAP Accelerator MCP Server | [aws-solutions-library-samples/guidance-for-deploying-sap-abap-accelerator-for-amazon-q-developer](https://github.com/aws-solutions-library-samples/guidance-for-deploying-sap-abap-accelerator-for-amazon-q-developer) | ABAP development assistant tools via MCP. | AWS solution sample for Amazon Q workflows. | MIT-0 | 19 | 2026-03-04 |
| mcp-abap-adt | [fr0ster/mcp-abap-adt](https://github.com/fr0ster/mcp-abap-adt) | ABAP ADT MCP server with CRUD and cloud/on-prem support. | Supports stdio, HTTP and SSE transports. | MIT | 13 | 2026-03-04 |
| erpl-adt | [DataZooDE/erpl-adt](https://github.com/DataZooDE/erpl-adt) | CLI plus MCP exposure for ABAP ADT operations. | Single-binary approach with tests/transports workflows. | Apache-2.0 | 2 | 2026-02-23 |
| MCP ABAP (Validation + Metadata) | [fgalastri/MCP_ABAP](https://github.com/fgalastri/MCP_ABAP) | ABAP validation and metadata tool surface. | Community implementation. | MIT | 2 | 2025-08-24 |
| mcp-abap-adt (workskong) | [workskong/mcp-abap-adt](https://github.com/workskong/mcp-abap-adt) | Lightweight ADT adapter for ABAP metadata and source. | Supports stdio and HTTP/SSE modes. | MIT | 2 | 2025-11-04 |
| ABAP ADT MCP Server (buettnerjulian) | [buettnerjulian/abap-adt-mcp](https://github.com/buettnerjulian/abap-adt-mcp) | ABAP ADT MCP with object, metadata and analysis tools. | Community ABAP ADT server. | MIT | 1 | 2025-08-11 |
| ABAP MCP Server (chandrashekhar-mahajan) | [chandrashekhar-mahajan/abap-mcp-server](https://github.com/chandrashekhar-mahajan/abap-mcp-server) | ABAP ADT REST based MCP tooling for development operations. | Community implementation with multiple auth options. | MIT | 0 | 2026-03-05 |
| ABAPDocMCP | [SaurabhVC/ABAPDocMCP](https://github.com/SaurabhVC/ABAPDocMCP) | Generate WRICEF technical specs from transport content. | Specialized ADT-based documentation flow. | MIT | 0 | 2026-02-18 |

## SAP Integration

| Name | Repository | Purpose | Notes | License | Stars | Last Change |
| --- | --- | --- | --- | --- | ---: | --- |
| MCP Integration Suite | [1nbuc/mcp-integration-suite](https://github.com/1nbuc/mcp-integration-suite) | General SAP Integration Suite/CPI operations. | Integration package and artifact workflows. | **NO LICENSE FOUND** | 15 | 2025-12-24 |
| CPI MCP Server | [vadimklimov/cpi-mcp-server](https://github.com/vadimklimov/cpi-mcp-server) | SAP Cloud Integration operations via MCP. | Go-based implementation with binary releases. | MIT | 10 | 2026-03-01 |
| OData MCP Proxy | [lemaiwo/odata-mcp-proxy](https://github.com/lemaiwo/odata-mcp-proxy) | BTP destination-driven proxy from OData/REST to MCP. | Integration Suite/OData admin API bridging pattern. | MIT | 3 | 2026-03-02 |
| MCP Trading Partner Management | [1nbuc/mcp-is-tpm](https://github.com/1nbuc/mcp-is-tpm) | SAP Integration Suite TPM workflows. | Focused on B2B TPM scenarios. | **NO LICENSE FOUND** | 0 | 2025-07-04 |

## SAP Datasphere

| Name | Repository | Purpose | Notes | License | Stars | Last Change |
| --- | --- | --- | --- | --- | ---: | --- |
| SAP Datasphere MCP (MarioDeFelipe) | [MarioDeFelipe/sap-datasphere-mcp](https://github.com/MarioDeFelipe/sap-datasphere-mcp) | Feature-rich Datasphere API interaction via MCP. | Broad tool surface, tenant-focused operations. | MIT | 10 | 2026-03-02 |
| SAP Datasphere MCP (rahulsethi) | [rahulsethi/SAPDatasphereMCP](https://github.com/rahulsethi/SAPDatasphereMCP) | Datasphere read-only and analytics operations via MCP. | Alternative community implementation. | MIT | 2 | 2026-01-05 |
| SAP Business Data Cloud MCP | [rahulsethi/SAPBDCMCP](https://github.com/rahulsethi/SAPBDCMCP) | MCP tooling for SAP Business Data Cloud workflows. | Read-only and contract-first focus in current scope. | MIT | 1 | 2026-01-06 |

## SAP OData Gateway Graph MCP Server

| Name | Repository | Purpose | Notes | License | Stars | Last Change |
| --- | --- | --- | --- | --- | ---: | --- |
| SAP OData to MCP Server for BTP | [lemaiwo/btp-sap-odata-to-mcp-server](https://github.com/lemaiwo/btp-sap-odata-to-mcp-server) | Expose SAP OData services as MCP tools. | BTP destination-based integration pattern. | MIT | 112 | 2026-01-16 |
| OData MCP Bridge (Go) | [oisee/odata_mcp_go](https://github.com/oisee/odata_mcp_go) | Go OData-to-MCP bridge with v2/v4 support. | Includes universal tool mode for large SAP OData services. | MIT | 108 | 2026-02-19 |
| OData MCP Wrapper (Python) | [oisee/odata_mcp](https://github.com/oisee/odata_mcp) | Bridge OData v2 services into MCP tools. | Dynamic tool generation from OData metadata. | MIT | 35 | 2025-08-24 |
| SAP OData MCP Server (Python) | [GutjahrAI/sap-odata-mcp-py](https://github.com/GutjahrAI/sap-odata-mcp-py) | Python OData MCP implementation. | Alternative implementation and packaging model. | **NO LICENSE FOUND** | 9 | 2025-07-09 |
| SAP OData MCP Server (TypeScript) | [GutjahrAI/sap-odata-mcp-server](https://github.com/GutjahrAI/sap-odata-mcp-server) | TypeScript OData MCP implementation. | CRUD plus service discovery support. | MIT | 8 | 2025-06-26 |
| SAP MCP Gateway Server | [midasol/sap-mcp-server](https://github.com/midasol/sap-mcp-server) | SAP Gateway/OData interaction via MCP. | Gateway-centric server architecture. | MIT | 5 | 2025-12-14 |
| SAP Graph API Sandbox MCP | [CostingGeek/sap-mcp](https://github.com/CostingGeek/sap-mcp) | MCP wrapper for SAP Graph sandbox scenarios. | Sandbox-first usage pattern. | MIT | 3 | 2025-04-28 |
| SAP OData to MCP Server (On-Prem) | [jfdurelle/onpremise-sap-odata-to-mcp-server](https://github.com/jfdurelle/onpremise-sap-odata-to-mcp-server) | On-prem adaptation of OData-to-MCP model. | Community variant for direct connectivity. | MIT | 0 | 2026-02-10 |

## SAP GUI

| Name | Repository | Purpose | Notes | License | Stars | Last Change |
| --- | --- | --- | --- | --- | ---: | --- |
| MCP SAP GUI Server | [mario-andreschak/mcp-sap-gui](https://github.com/mario-andreschak/mcp-sap-gui) | Coordinate and input automation for SAP GUI. | GUI scripting and automation workflow. | MIT | 93 | 2025-02-26 |
| SAPient MCP | [toni-ramchandani/sapient-mcp](https://github.com/toni-ramchandani/sapient-mcp) | RoboSAPiens-based SAP GUI automation server. | Focused on intelligent SAP GUI automation. | **NO LICENSE FOUND** | 2 | 2026-02-24 |
| sap_gui_mcp | [jduncan8142/sap_gui_mcp](https://github.com/jduncan8142/sap_gui_mcp) | SAP GUI Scripting API exposed via FastMCP. | Windows and SAP GUI scripting setup required. | MIT | 1 | 2025-12-01 |

## SAP HANA

| Name | Repository | Purpose | Notes | License | Stars | Last Change |
| --- | --- | --- | --- | --- | ---: | --- |
| HANA MCP Server | [HatriGt/hana-mcp-server](https://github.com/HatriGt/hana-mcp-server) | MCP integration for SAP HANA and HANA Cloud. | Direct HANA-focused MCP server. | MIT | 33 | 2025-09-24 |

## SAP Related Skills

| Name | Repository | Purpose | Notes | License | Stars | Last Change |
| --- | --- | --- | --- | --- | ---: | --- |
| SAP Skills for Claude Code | [secondsky/sap-skills](https://github.com/secondsky/sap-skills) | Large SAP skill set for Claude Code across CAP, Fiori, ABAP and BTP. | Most visible SAP skill marketplace style repository. | GPL-3.0 | 119 | 2026-03-04 |
| SAP OData Explorer Skill | [one-kash/sap-odata-explorer](https://github.com/one-kash/sap-odata-explorer) | Claude skill for SAP OData endpoint exploration. | Skill-style tooling, not an MCP server. | MIT | 17 | 2026-02-15 |
| RAP Skills | [weiserman/rap-skills](https://github.com/weiserman/rap-skills) | SAP RAP-focused Claude Code skills. | RAP-centric specialization. | MIT | 10 | 2026-02-24 |
| SAP Power for Kiro | [mfigueir/sap-power](https://github.com/mfigueir/sap-power) | SAP development knowledge package for Kiro IDE. | Similar scope to sap-skills-power, check overlap before adoption. | GPL-3.0 | 3 | 2026-01-20 |
| SAP Claude Skills | [KEIDAI-TechTime/sap-claude-skills](https://github.com/KEIDAI-TechTime/sap-claude-skills) | SAP add-on development skill bundles for Claude workflows. | Repository and docs are primarily Japanese. | **NO LICENSE FOUND** | 0 | 2026-03-03 |
| SAP Skills Power for Kiro | [mfigueir/sap-skills-power](https://github.com/mfigueir/sap-skills-power) | SAP development skill pack for Kiro IDE. | Kiro-specific power package. | GPL-3.0 | 0 | 2026-01-19 |

## Adjacent SAP AI Developer Tools

| Name | Repository | Purpose | Notes | License | Stars | Last Change |
| --- | --- | --- | --- | --- | ---: | --- |
| ABAP Remote Filesystem for VS Code | [marcellourbani/vscode_abap_remote_fs](https://github.com/marcellourbani/vscode_abap_remote_fs) | Remote ABAP filesystem access in VS Code. | Useful companion to ABAP MCP workflows. | MIT | 216 | 2026-02-28 |
| CAP MCP Plugin | [gavdilabs/cap-mcp-plugin](https://github.com/gavdilabs/cap-mcp-plugin) | Generates MCP servers from CAP services. | Community plugin, not an SAP-delivered MCP server. | Apache-2.0 | 55 | 2026-03-05 |
| GitHub Copilot for Eclipse | [eclipse-copilot/eclipse-copilot](https://github.com/eclipse-copilot/eclipse-copilot) | GitHub Copilot integration plugin for Eclipse IDE. | Adjacently relevant for ABAP/Eclipse-centric teams. | EPL-2.0 | 25 | 2025-08-25 |
| SAP TechEd 2025 CA261 Sample | [SAP-samples/teched2025-CA261](https://github.com/SAP-samples/teched2025-CA261) | Hands-on sample for AI + Fiori + MCP workflows. | Reference project, not a generic MCP server. | Apache-2.0 | 10 | 2025-11-25 |
| SAP Analytics Cloud MCP Server | [JumenEngels/sap_analytics_cloud_mcp](https://github.com/JumenEngels/sap_analytics_cloud_mcp) | Exposes SAP Analytics Cloud APIs as MCP tools. | Community project, not an SAP-delivered MCP server. | MIT | 3 | 2026-03-02 |
| SAP SuccessFactors MCP Server | [aiadiguru2025/sf-mcp](https://github.com/aiadiguru2025/sf-mcp) | SuccessFactors HR operations via MCP tools. | Community project, not an SAP-delivered MCP server. | MIT | 1 | 2026-03-03 |
| Amazon Q Developer for Eclipse (Official Docs) | [docs.aws.amazon.com/amazon-q-eclipse](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/q-in-IDE_setup.html) | Official setup docs for Amazon Q in Eclipse IDE. | Documentation reference, not a GitHub repository. | **NO LICENSE FOUND** | - | - |
| GitHub Copilot in Eclipse (Official Docs) | [docs.github.com/eclipse-copilot](https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-in-the-ide?tool=eclipse) | Official setup and usage docs for Copilot in Eclipse. | Documentation reference, not a GitHub repository. | **NO LICENSE FOUND** | - | - |
| SAP Build Code and Joule (Official Topic Page) | [SAP Build Code Topic](https://pages.community.sap.com/topics/build-code) | Entry point for SAP Build Code and Joule-related resources. | Official SAP topic page, not a single repository. | **NO LICENSE FOUND** | - | - |
