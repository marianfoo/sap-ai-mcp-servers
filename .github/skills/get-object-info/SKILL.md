---
name: get-object-info
description: Retrieve ABAP object information and source code. Use when viewing, inspecting, analyzing, or understanding any ABAP object (programs, classes, interfaces, CDS views, tables, function modules, etc.). Keywords: get source, show code, view object, inspect program, read class, CDS definition, table structure, interface definition, function module code
license: MIT
---

# Get ABAP Object Information

Retrieve detailed information and source code for any ABAP object using the MCP `GetObjectInfo` tool.

## When to Use This Skill

Use this skill when you need to:
- View source code of ABAP programs, classes, interfaces, includes
- Inspect CDS view definitions, behavior definitions, service definitions
- Review table/structure definitions and fields
- Read function module implementations
- Analyze metadata extensions, DCL access controls, annotations
- Understand existing ABAP objects before modification

## Supported Object Types

The tool supports 18 ABAP object types via the `object_type` parameter:

| Object Type | Description | Example |
|------------|-------------|---------|
| `program` | ABAP programs/reports | ZMY_REPORT |
| `class` | Global ABAP classes | ZCL_MY_CLASS |
| `interface` | Global interfaces | ZIF_MY_INTERFACE |
| `include` | Include programs | ZMY_INCLUDE_TOP |
| `function_group` | Function groups | ZMY_FUNCTION_GROUP |
| `function` | Function modules | Z_MY_FUNCTION |
| `cds_view` | CDS views/entities | ZI_MY_VIEW |
| `annotation` | SAP standard annotations (read-only) | Used for @Semantics, @UI reference |
| `metadata_annotation` | Custom metadata extensions (DDLX) | ZMY_EXTENSION |
| `dcl` | Data Control Language (DCLS) | ZMY_ACCESS_CONTROL |
| `behaviour_definition` | RAP behavior definitions | ZI_MY_BO |
| `service_definition` | OData service definitions | ZUI_MY_SERVICE |
| `table` | Database tables | ZMY_TABLE |
| `structure` | ABAP structures | ZMY_STRUCTURE |
| `table_type` | Table types | ZMY_TABLE_TYPE |
| `badi_implementation` | BAdI implementations | ZMY_BADI_IMPL |
| `transaction` | Transaction codes | ZMY_TCODE |
| `type_info` | Type information | Various types |

## Important Distinctions

**Annotations vs Metadata Extensions:**
- `annotation`: SAP standard DDLA files (read-only) - utility reference for CDS @Semantics and @UI annotations
- `metadata_annotation`: Custom Metadata Extensions (DDLX) - supports full CRUD operations

**DCL**: Data Control Language (DCLS) - Access Control objects for CDS view authorization

## Required Parameters

- `object_type`: Type from the enum above
- `object_name`: Name of the ABAP object
- `function_group`: Required ONLY when `object_type` is `function`

## Output Format

The tool returns:
- Object metadata (name, type, package, description)
- Complete source code
- For multi-section objects (classes): separate sections for definitions, implementations, test classes, macros
- For tables/structures: field definitions with types and descriptions

## Usage Examples

**View a class:**
```
I need to see the source code of class ZCL_MY_UTIL
```

**Inspect a CDS view:**
```
Show me the definition of CDS view ZI_SALESORDER
```

**Read a function module:**
```
Get the implementation of function module Z_CALCULATE_PRICE in function group ZMY_FG
```

**Check table structure:**
```
What fields are in table ZMARA_EXT?
```

**Review behavior definition:**
```
Display the behavior definition for ZI_BOOKING
```

## Workflow Integration

This skill is typically the FIRST step in many workflows:

1. **Before Modification**: Use `get-object-info` to understand current implementation
2. **Research**: Analyze existing patterns and structure
3. **Then**: Use other skills like `change-ai-object` or `activate-object` for modifications

## Output Expectations

When Copilot uses this skill, expect:
- Complete, formatted source code
- Metadata context (package, description, activation status)
- For classes: organized sections (public/private/protected, methods)
- For CDS: associations, compositions, field annotations
- For tables: complete field catalog with types

## Tips for Effective Use

- Be specific with object names (exact match required)
- For function modules, always provide the function group
- Use this before making changes to understand current state
- Combine with `search-object` skill when you don't know the exact name
