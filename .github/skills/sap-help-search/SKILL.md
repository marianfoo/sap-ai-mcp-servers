---
name: sap-help-search
description: Search official SAP Help Portal (help.sap.com) for documentation, guides, API reference, and technical materials. Use when researching SAP features, learning APIs, understanding concepts, or finding official documentation. Returns search results with IDs for retrieving full content. Keywords: SAP documentation, help, official guide, API reference, SAP help, documentation search
license: MIT
---

# SAP Help Portal Search

Search the official SAP Help Portal (help.sap.com) for documentation, guides, and technical references using the MCP `sap_help_search` tool.

## When to Use This Skill

Use this skill when you need to:
- Find official SAP documentation
- Research SAP features and APIs
- Learn about SAP technologies
- Understand concepts and best practices
- Find release notes and what's new
- Locate configuration guides
- Research error messages and solutions

## What is SAP Help Portal?

SAP Help Portal (help.sap.com) is the official SAP documentation repository containing:
- **Product documentation**: Complete guides for all SAP products
- **API references**: Detailed API documentation
- **Release notes**: What's new in each version
- **Configuration guides**: Setup and customization
- **Best practices**: Recommended approaches
- **Migration guides**: Upgrade paths
- **Technical references**: Deep technical details

## Required Parameters

- `query`: Search query string (keywords, topics, concepts)

## Output Format

Returns up to 20 search results with:
- **ID**: Unique identifier (format: `sap-help-{loio}`)
- **Title**: Document title
- **URL**: Link to help.sap.com page
- **Preview**: Content snippet
- **Relevance**: Match score

Example:
```json
{
  "results": [
    {
      "id": "sap-help-12345abcdef",
      "title": "ABAP CDS - CDS View Entities",
      "url": "https://help.sap.com/docs/...",
      "preview": "CDS view entities are the recommended..."
    }
  ],
  "total": 15
}
```

## Retrieving Full Content

**Two-step workflow:**
1. Use `sap_help_search` to find relevant documents
2. Use `sap_help_get` with result ID to get full content

```
Step 1: Search for "ABAP CDS views"
Step 2: Get full content of result ID sap-help-12345abcdef
```

## Usage Examples

**Research API:**
```
Search SAP Help for "RAP Business Object implementation"
```

**Learn concept:**
```
Find SAP documentation about CDS view associations
```

**Find migration guide:**
```
Search for "S/4HANA migration to cloud"
```

**Error message research:**
```
Search SAP Help for error message RFC_ERROR_SYSTEM_FAILURE
```

**Best practices:**
```
Find SAP best practices for ABAP performance optimization
```

**Release notes:**
```
Search for "ABAP Cloud what's new 2024"
```

## Search Query Tips

### Effective Query Patterns

| Query Type | Example | Results |
|------------|---------|---------|
| Concept | "CDS view associations" | Tutorial, concept docs |
| API lookup | "I_SalesOrder API" | API reference |
| Feature | "RAP managed implementation" | Feature guides |
| Error code | "DBIF_RSQL_SQL_ERROR" | Error explanations |
| Product | "S/4HANA embedded analytics" | Product docs |
| Topic | "ABAP Unit testing" | How-to guides |

### Search Refinement

**Broad → Narrow:**
```
1. "ABAP" → Too broad
2. "ABAP CDS" → Better
3. "ABAP CDS view associations" → Specific
```

**Use specific terms:**
- ✅ "RAP Business Object"
- ❌ "business logic"

**Include version when relevant:**
- "S/4HANA 2023 features"
- "ABAP Cloud 7.58"

**Use exact names:**
- "I_SalesOrderTP" (exact CDS view name)
- "BAPI_PO_CREATE1" (exact function module)

## Common Search Scenarios

### 1. Learning New Technology
```
Query: "RAP managed scenario tutorial"
Use: Get started with new framework
Follow-up: Get full tutorial with sap_help_get
```

### 2. API Reference Lookup
```
Query: "I_SalesOrder API reference"
Use: Understand CDS view fields and associations
Follow-up: Review complete field catalog
```

### 3. Migration Research
```
Query: "Migrate to ABAP Cloud"
Use: Plan migration strategy
Follow-up: Get detailed migration guide
```

### 4. Troubleshooting
```
Query: "Error handling in RAP"
Use: Understand error patterns
Follow-up: Review code examples
```

### 5. Configuration
```
Query: "Configure OData service"
Use: Setup guide
Follow-up: Step-by-step instructions
```

## Workflow Integration

### Research → Implementation
1. `sap_help_search` → Find concept documentation
2. `sap_help_get` → Read full guide
3. `search_object` → Find similar implementations
4. `get_object_info` → Study existing code
5. `create_ai_object` → Implement with guidance

### Error Resolution
1. Get ATC error or runtime error
2. `sap_help_search` → Research error
3. `sap_help_get` → Read solution
4. `change_ai_object` → Apply fix

### API Discovery
1. `sap_help_search` → Find API documentation
2. `sap_help_get` → Review API details
3. `get_released_api` → Check if released
4. `create_ai_object` → Use API in code

## Output Expectations

When Copilot uses this skill, expect:
- List of relevant documentation pages
- Document titles and previews
- Result IDs for detailed retrieval
- Relevance ranking (best matches first)
- Recommendation: "Read result 1 with sap_help_get for details"
- Summary of key findings

## Tips for Effective Searching

1. **Start specific**: Use exact terms when possible
2. **Use product names**: Include "S/4HANA", "BTP", etc.
3. **Include version**: Add version numbers for release-specific info
4. **Try variations**: Rephrase if first search doesn't help
5. **Review multiple results**: Top result isn't always best for your case
6. **Get full content**: Use sap_help_get to read complete documentation

## Integration with Other Skills

**Learning workflow:**
1. `sap_help_search` + `sap_help_get` → Learn official approach
2. `sap_community_search` → Learn from practitioners
3. `search_object` → Find system examples
4. `get_object_info` → Study implementation

**Development workflow:**
1. `sap_help_search` → Research API/feature
2. `get_released_api` → Verify cloud readiness
3. `create_ai_object` → Implement
4. `get_atc_results` → Validate

**Troubleshooting workflow:**
1. `get_atc_results` → Find error
2. `sap_help_search` → Research error/solution
3. `sap_community_search` → Find community solutions
4. `change_ai_object` → Apply fix

## Result Interpretation

### High-Quality Results
**Indicators:**
- Exact match in title
- Recent publication date
- Official SAP content
- Comprehensive preview

**Action:** Get full content with sap_help_get

### Multiple Similar Results
**When you see:**
- Several docs on same topic
- Different versions

**Action:**
- Choose latest version
- Or version matching your system
- Compare multiple docs

### No Relevant Results
**Possible reasons:**
- Query too broad/vague
- Nonstandard terminology
- Very new feature (docs pending)
- Custom/non-SAP object

**Next steps:**
- Rephrase query
- Try sap_community_search instead
- Search for related concepts

## SAP Help vs SAP Community

| Aspect | SAP Help | SAP Community |
|--------|----------|---------------|
| **Source** | Official SAP | User-contributed |
| **Content** | Product docs, API ref | Blog posts, discussions |
| **Authority** | Authoritative | Practical insights |
| **Coverage** | Comprehensive | Topic-specific |
| **Style** | Formal reference | Tutorials, tips |
| **Use for** | Official features | Real-world solutions |

**When to use SAP Help:**
- Official API documentation
- Feature specifications
- Configuration requirements
- Supported approaches

**When to use SAP Community:**
- How-to guides and tutorials
- Workarounds and tips
- Real-world examples
- Community solutions

## Best Practices

1. **Search official first**: Start with SAP Help for authoritative info
2. **Supplement with community**: Add practical insights from community
3. **Verify version match**: Ensure docs match your system version
4. **Bookmark key docs**: Save frequently used documentation
5. **Follow examples**: Official code samples are reliable
6. **Check release notes**: Stay updated on new features

## Common Documentation Types

| Type | What to Search | Example Query |
|------|---------------|---------------|
| **Concept** | Understanding | "CDS view entities concept" |
| **API Reference** | Field/method details | "I_SalesOrder fields" |
| **Tutorial** | Step-by-step | "Create RAP business object" |
| **Configuration** | Setup guide | "Activate OData service" |
| **Release Notes** | What's new | "S/4HANA 2023 CDS features" |
| **Migration** | Upgrade path | "Migrate to RAP from BOPF" |
| **Best Practices** | Recommendations | "ABAP performance best practices" |

## Advanced Search Techniques

### Phrase Search
```
Query: "CDS view WITH HIERARCHY"
Results: Exact phrase match
```

### Multi-Topic
```
Query: "RAP validation determination"
Results: Docs covering both topics
```

### Product-Specific
```
Query: "S/4HANA Cloud OData service"
Results: Cloud-specific docs
```

### Version-Specific
```
Query: "ABAP 7.58 new features"
Results: Release-specific content
```
