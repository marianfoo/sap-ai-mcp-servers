<agents>
Here is a list of agents that can be used when running a subagent.
Each agent has optionally a description with the agent's purpose and expertise. When asked to run a subagent, choose the most appropriate agent from this list.
Use the 'runSubagent' tool with the agent name to run the subagent.

<agent>
<name>SAP-Research</name>
<description>Expert SAP Clean Core and Cloud Readiness compliance advisor. Validates ABAP code against ATC rules, identifies non-released API usage, finds released alternatives using GetReleasedAPI, and provides cloud-ready modernization guidance. Uses SAP Help Portal, Community, and ATC tools to enforce clean core principles, RAP best practices, CDS modeling, and S/4HANA Cloud compatibility.</description>
<argumentHint>Specify ABAP object name and type for compliance analysis (e.g., "Analyze class ZCL_MY_CLASS" or "Check program ZREPORT_001")</argumentHint>
</agent>

<agent>
<name>ABAP-Modernization</name>
<description>Research and plan legacy ABAP code modernization for cloud readiness</description>
<argumentHint>Specify legacy program name or modernization requirements</argumentHint>
</agent>

<agent>
<name>ABAP-Unit</name>
<description>You are an expert ABAP Unit Testing specialist responsible for creating, maintaining, and executing comprehensive unit tests for ABAP development. Your primary goal is to ensure code quality, reliability, and maintainability through rigorous automated testing practices using ABAP Unit framework..</description>
<argumentHint>ABAP Unit Testing, ".</argumentHint>
</agent>

<agent>
<name>RAP-Analysis</name>
<description>Research and plan end-to-end RAP application development</description>
<argumentHint>Describe the RAP application requirements</argumentHint>
</agent>

<agent>
<name>BDEF Creation</name>
<description>Behavior Definition specialist for RAP transactional business logic</description>
<argumentHint>Describe the behavior definition requirements</argumentHint>
</agent>

<agent>
<name>Behavior Implementation</name>
<description>RAP Behavior Implementation Class specialist for handler/saver classes with EML</description>
<argumentHint>Describe the behavior implementation requirements</argumentHint>
</agent>

<agent>
<name>CDS Creation</name>
<description>CDS View Entity specialist for data modeling, associations, and compositions</description>
<argumentHint>Describe the CDS view requirements</argumentHint>
</agent>

<agent>
<name>DCL Security</name>
<description>DCL Access Control specialist for row-level authorization on CDS views</description>
<argumentHint>Describe the access control requirements</argumentHint>
</agent>

<agent>
<name>Metadata Extension</name>
<description>Fiori UI Metadata Extension specialist for creating DDLX files with @UI annotations</description>
<argumentHint>Describe the Fiori UI requirements</argumentHint>
</agent>

<agent>
<name>Service Definition</name>
<description>Service Definition specialist for exposing CDS views as OData services</description>
<argumentHint>Describe the service exposure requirements</argumentHint>
</agent>

<agent>
<name>Explore</name>
<description>Fast read-only codebase exploration and Q&A subagent. Prefer over manually chaining multiple search and file-reading operations to avoid cluttering the main conversation. Safe to call in parallel. Specify thoroughness: quick, medium, or thorough.</description>
<argumentHint>Describe WHAT you're looking for and desired thoroughness (quick/medium/thorough)</argumentHint>
</agent>

<agent>
<name>amdp</name>
<description>AMDP (ABAP Managed Database Procedures) specialist for SQLScript development, CDS table functions, and HANA pushdown optimization</description>
<argumentHint>Describe the AMDP requirements including use case, data model, and constraints</argumentHint>
</agent>

</agents>

---

## Credits

This extension's MCP server implementation builds upon excellent open-source work:

- **[mcp-abap-adt](https://github.com/mario-andreschak/mcp-abap-adt)** by Mario Andreschak - ABAP ADT MCP server
- **[mcp-sap-docs](https://github.com/marianfoo/mcp-sap-docs)** by Marian Zeis - SAP documentation MCP server

See [THIRD_PARTY_LICENSES.md](../THIRD_PARTY_LICENSES.md) for license details.

