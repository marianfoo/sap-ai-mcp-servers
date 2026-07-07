---
name: create-ai-object
description: Create new ABAP objects (programs, classes, CDS views, etc.) with AI-generated code. Use when building, generating, or creating new ABAP development objects. Supports custom Z-prefixes or defaults to ZAI_ prefix. Always creates in $TMP package. Keywords: create, build, generate, new program, new class, new CDS, new object, create report, generate class
license: MIT
---

# Create AI-Managed ABAP Objects

Create new ABAP objects with AI-generated source code using the MCP `CreateAIObject` tool.

## When to Use This Skill

Use this skill when you need to:
- Create new ABAP programs/reports
- Generate new classes or interfaces
- Build new CDS views, behavior definitions, service definitions
- Create function groups and function modules
- Generate data elements, tables, structures
- Create metadata extensions (DDLX) for Fiori UI

## Supported Object Types

| Type | Description | Multi-Section Support |
|------|-------------|----------------------|
| `program` | ABAP reports/programs | No |
| `class` | Global classes | Yes (main, definitions, implementations, testclasses, macros) |
| `interface` | Global interfaces | No |
| `include` | Include programs | No |
| `function_group` | Function groups | No |
| `function` | Function modules | No |
| `function_group_include` | Function group includes | No |
| `data_element` | Data elements | Metadata-only |
| `table` | Database tables | DDL definition |
| `structure` | ABAP structures | DDL definition |
| `cds_view` | CDS views | DDL with associations |
| `dcl` | Access Control (DCLS) | DCL syntax |
| `behaviour_definition` | RAP behavior (BDEF) | Yes (main, implementations) |
| `service_definition` | Service definitions | Service exposure syntax |
| `metadata_extension` | Metadata extensions (DDLX) | @UI annotations |

## Required Parameters

- `object_name`: Name of object to create
- `source_code`: Complete ABAP source (string or multi-section object)

## Optional Parameters

- `description`: Object description (max 30 characters, defaults to "AI-Generated {Type}")
- `object_type`: Type from enum above (defaults to `program`)
- `additional_params`: Object-specific parameters (see below)

## Naming Conventions

### Custom Z-Prefixes (Preserved)
If you provide a custom Z-prefix, it's preserved as-is:
- `ZP_SALES_REPORT` → stays `ZP_SALES_REPORT`
- `ZF_HELPER` → stays `ZF_HELPER`
- `ZC_MY_VIEW` → stays `ZC_MY_VIEW`

### Default ZAI_ Prefix
Without a custom Z-prefix, auto-adds `ZAI_`:
- `SALES_REPORT` → becomes `ZAI_SALES_REPORT`
- `MY_CLASS` → becomes `ZAI_MY_CLASS`

### Length Limits
⚠️ **CRITICAL**: Total name max 16 characters INCLUDING prefix
- With ZAI_ prefix: max 12 characters for your part
- With custom prefix: count the total

## Source Code Formats

### Simple String (Most Objects)
```abap
"Program, Interface, Include, CDS View, etc.
source_code: "REPORT zmy_test. WRITE: 'Hello'."
```

### Multi-Section Object (Classes, Behavior Implementations)
```javascript
source_code: {
  main: "CLASS zcl_my_class DEFINITION PUBLIC...",
  definitions: "Type definitions and constants",
  implementations: "Local helper classes - LHC_*, LSC_*",
  testclasses: "Unit test classes",
  macros: "Macro definitions"
}
```

**Multi-section enables:**
- RAP behavior implementation classes with local handler classes (LHC_*)
- Separation of concerns in complex classes
- Test classes in separate section
- Reusable definitions and macros

## Additional Parameters by Type

### Function Modules
**Required:**
- `function_group`: Parent function group name

### Data Elements
**Optional:**
- `typeKind`: `predefinedAbapType` or `domain`
- `dataType`: CHAR, NUMC, INT4, etc.
- `dataTypeLength`: Default 50
- `dataTypeDecimals`: Default 0
- `shortLabel`: Short field label
- `mediumLabel`: Medium field label
- `longLabel`: Long field label
- `headingLabel`: Column heading

## Package and Development

**All objects created in `$TMP`:**
- Local development package
- No transport needed
- For prototyping and testing
- Easy to delete/recreate

**Why $TMP:**
- Fast iteration during development
- No transport dependencies
- Safe AI experimentation
- Move to package later if needed

## Workflow and Activation

The tool automatically:
1. ✅ Creates the object
2. ✅ Uploads source code
3. ✅ Unlocks the object
4. ✅ **Activates the object**
5. ✅ Returns activation results

**Activation results include:**
- Syntax errors with line numbers
- Warnings with line numbers
- Success/failure status
- Quickfix suggestions (if available)

## Output Format

Returns structured JSON:
```json
{
  "success": true,
  "object_name": "ZAI_MY_PROGRAM",
  "object_type": "PROG/P",
  "package": "$TMP",
  "activation": {
    "success": true,
    "errors": [],
    "warnings": [
      {
        "line": 5,
        "message": "Variable is not used",
        "severity": "warning"
      }
    ]
  }
}
```

## Usage Examples

**Create a simple program:**
```
Create an ABAP program called SALES_REPORT that displays sales data
```

**Create a class with custom prefix:**
```
Generate class ZP_CUSTOMER_MANAGER that handles customer data operations
```

**Create a CDS view:**
```
Build CDS view ZI_BOOKING for booking data with associations to customer and flight
```

**Create RAP behavior implementation:**
```
Create behavior implementation class for ZI_TRAVEL_BO with create, update, delete operations
```

**Create metadata extension:**
```
Generate metadata extension for ZC_BOOKING_PROC with Fiori UI annotations
```

## RAP Development Pattern

For RAP (RESTFUL ABAP Programming), create in sequence:

1. **CDS View** (Interface view - ZI_*)
   ```
   Create CDS view ZI_BOOKING with fields booking_id, customer_id, flight_id
   ```

2. **Behavior Definition** (BDEF)
   ```
   Create behavior definition for ZI_BOOKING with create, update, delete
   ```

3. **Behavior Implementation** (Class with local handlers)
   ```
   Create behavior implementation for ZI_BOOKING with validation and determination
   ```
   
4. **Projection View** (Consumption - ZC_*)
   ```
   Create projection view ZC_BOOKING based on ZI_BOOKING
   ```

5. **Metadata Extension** (UI annotations)
   ```
   Create metadata extension for ZC_BOOKING with list and object page layouts
   ```

6. **Service Definition**
   ```
   Create service definition ZUI_BOOKING exposing ZC_BOOKING
   ```

## Error Handling

**Common errors and fixes:**

| Error | Cause | Fix |
|-------|-------|-----|
| Name too long | > 16 characters | Shorten name |
| Syntax error line X | Code issue | Review source, fix syntax |
| Object already exists | Duplicate name | Use different name or delete existing |
| Missing function_group | Function creation without group | Provide function_group parameter |

## Tips for Effective Use

1. **Start simple**: Create basic structure first
2. **Describe requirements**: AI generates better code with clear description
3. **Use multi-section**: For complex classes with handlers
4. **Check activation**: Always review errors/warnings
5. **Iterate**: Easy to recreate in $TMP
6. **Custom prefixes**: Use meaningful Z-prefixes for organization

## Output Expectations

When Copilot uses this skill, expect:
- Object created successfully
- Activation status (errors/warnings)
- Line numbers for any issues
- Recommendations for fixes
- Next steps: "Object created, now test it" or "Fix syntax errors"

## Integration with Other Skills

**Typical workflow:**
1. Use `sap-help-search` for API research
2. Use `search-object` to find similar objects
3. Use `get-object-info` to study patterns
4. Use `create-ai-object` to build new object
5. Use `get-atc-results` to check quality
6. Use `activate-object` if changes needed

## Security and Safety

**Built-in safeguards:**
- ✅ Creates only in $TMP (no production impact)
- ✅ Z-prefix enforcement (no SAP standard modification)
- ✅ Automatic activation with syntax check
- ✅ No transport (local development only)

## When NOT to Use

❌ Don't use this skill when:
- Modifying existing objects (use `change-ai-object`)
- Just viewing code (use `get-object-info`)
- Searching for objects (use `search-object`)
- Creating in production packages (manual transport required)
