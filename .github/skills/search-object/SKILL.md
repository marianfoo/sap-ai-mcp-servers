---
name: search-object
description: Search for ABAP objects by name or pattern. Use when looking for objects, finding programs, locating classes, discovering CDS views, or when you don't know the exact object name. Keywords: find, search, locate, discover, list objects, what objects, object search, quick search
license: MIT
---

# Search ABAP Objects

Search for ABAP objects using quick search functionality via the MCP `SearchObject` tool.

## When to Use This Skill

Use this skill when you need to:
- Find objects by partial name or pattern
- Discover available objects in a namespace
- Locate objects when you don't know the exact name
- List all objects matching a criteria
- Explore what exists in the system

## Required Parameters

- `query`: Search query string (supports wildcards and patterns)
- `maxResults`: Maximum number of results (optional, default: 100)

## Search Patterns

The SAP quick search supports various patterns:

| Pattern | Example | Finds |
|---------|---------|-------|
| Prefix | `ZMY*` | All objects starting with ZMY |
| Contains | `*ORDER*` | Objects containing ORDER |
| Exact | `ZCL_MY_CLASS` | Exact match |
| Wildcard | `Z*_UTIL` | Z prefix, ends with _UTIL |

## Output Format

Returns a list of matching objects with:
- Object name
- Object type (PROG, CLAS, INTF, DDLS, etc.)
- Package
- Description
- URI for further operations

## Usage Examples

**Find all classes in a namespace:**
```
Search for all classes starting with ZCL_SALES
```

**Locate CDS views about customers:**
```
Find CDS views containing CUSTOMER
```

**Discover programs in a package:**
```
Show me all Z programs
```

**Find specific object type:**
```
Search for interfaces with name *_BOOKING_*
```

## Common Search Scenarios

### 1. Development Namespace Exploration
```
Search query: ZMY_*
Purpose: See all custom objects in ZMY namespace
```

### 2. Functional Area Discovery
```
Search query: *SALES*
Purpose: Find all sales-related objects
```

### 3. Pattern-Based Search
```
Search query: Z*_HELPER
Purpose: Find all helper classes/programs
```

### 4. Narrowing Down Results
```
Search query: ZCL_FI_*
Limit: 20
Purpose: First 20 finance-related classes
```

## Workflow Integration

This skill often PRECEDES other skills:

1. **Search** → Find candidates
2. **GetObjectInfo** → Inspect specific objects
3. **Modify/Analyze** → Work with the found objects

## Tips for Effective Searching

- Start broad, then narrow: `Z*` → `ZCL_*` → `ZCL_SALES_*`
- Use `*` wildcards strategically
- Set reasonable `maxResults` (default 100 is usually sufficient)
- Combine with domain knowledge (namespace conventions)
- Follow up with `get-object-info` to inspect results

## Output Expectations

When Copilot uses this skill, expect:
- List of matching objects with metadata
- Object counts and result limits
- Suggestions to narrow search if too many results
- Next steps: "Would you like to view any of these objects?"

## Search Performance

- Quick search is fast for most patterns
- Very broad searches (`*`) may return many results
- Use `maxResults` to limit large result sets
- Consider namespace prefixes to narrow scope

## Integration with Other Skills

**Typical workflow:**
1. Use `search-object` to find candidates
2. Use `get-object-info` to inspect specific objects
3. Use `where-used-search` to understand dependencies
4. Use `create-ai-object` or `change-ai-object` to modify
