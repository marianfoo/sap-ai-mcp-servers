---
name: activate-object
description: Activate ABAP objects and perform syntax checking. Use when activating objects, checking syntax, validating code compilation, or before using modified objects. Restricted to Z* objects only. Keywords: activate, syntax check, compile, validation, activate program, check syntax, compilation errors
license: MIT
---

# Activate ABAP Objects

Activate ABAP objects and perform comprehensive syntax checking using the MCP `ActivateObject` tool.

## When to Use This Skill

Use this skill when you need to:
- Activate objects after manual editing
- Perform syntax validation without changing code
- Check compilation status
- Validate object before use
- Verify code correctness
- Pre-transport activation check

## ⚠️ SAFETY RESTRICTION

**This tool ONLY activates Z* objects (customer namespace).**

- ✅ Allowed: Z* and Y* objects (customer development)
- ❌ Blocked: SAP standard objects (prevents accidents)

**Why this restriction:**
- Prevents accidental activation of SAP standard code
- Protects system integrity
- Ensures safe AI operations
- Focuses on customer development

## Supported Object Types

Same as create/change operations:
- `program`, `class`, `interface`, `include`
- `function_group`, `function`, `function_group_include`
- `data_element`, `table`, `structure`
- `cds_view`, `dcl`, `behaviour_definition`
- `service_definition`, `metadata_extension`

## Required Parameters

- `object_name`: Name of object to activate (must start with Z or Y)

## Optional Parameters

- `object_type`: Type from enum (defaults to `program`)

## What Activation Does

Activation performs:
1. **Full syntax check**: Compilation validation
2. **Dependency resolution**: Checks references
3. **Type checking**: Validates data types
4. **Runtime generation**: Creates executable code
5. **Error reporting**: Detailed line-level diagnostics

## Activation vs Auto-Activation

**This skill vs automatic activation:**

| Scenario | Auto-Activation | This Skill |
|----------|----------------|------------|
| After create-ai-object | ✅ Automatic | Not needed |
| After change-ai-object | ✅ Automatic | Not needed |
| Manual editing in GUI | ❌ Manual | ✅ Use this |
| Syntax validation only | ❌ N/A | ✅ Use this |
| Pre-transport check | ❌ Manual | ✅ Use this |

**When to use this skill:**
- After manual edits outside MCP tools
- To validate without making changes
- Before transport to check activation status
- To get detailed syntax report

## Output Format

Returns structured JSON with detailed results:
```json
{
  "success": true,
  "object_name": "ZMY_PROGRAM",
  "object_type": "PROG/P",
  "activation": {
    "success": false,
    "errors": [
      {
        "line": 15,
        "column": 12,
        "message": "Unknown variable 'lv_customer'",
        "severity": "error",
        "quickfix_available": false
      }
    ],
    "warnings": [
      {
        "line": 23,
        "column": 5,
        "message": "Variable 'lv_temp' is never used",
        "severity": "warning",
        "quickfix_available": true
      }
    ],
    "info": [
      {
        "message": "Program activated successfully with warnings"
      }
    ]
  }
}
```

## Severity Levels

| Level | Meaning | Blocks Activation | Action |
|-------|---------|-------------------|--------|
| **Error** | Syntax/compilation error | ✅ Yes | Must fix |
| **Warning** | Best practice violation | ❌ No | Should fix |
| **Info** | Informational message | ❌ No | Optional |

## Common Syntax Errors

### Variable Errors
```
line 15: Unknown variable 'lv_customer'
Fix: Declare variable or fix typo
```

### Type Errors
```
line 23: Type mismatch in assignment
Fix: Use correct type or conversion
```

### Statement Errors
```
line 8: ENDLOOP without LOOP
Fix: Add matching LOOP or remove ENDLOOP
```

### Reference Errors
```
line 42: Class 'ZCL_HELPER' not found
Fix: Create class or fix name
```

## Usage Examples

**Activate a program:**
```
Activate program ZMY_SALES_REPORT
```

**Syntax check without change:**
```
Check syntax of class ZCL_CUSTOMER_MANAGER
```

**Pre-transport validation:**
```
Validate activation status of ZI_BOOKING before transport
```

**Verify manual edits:**
```
I manually edited ZMY_INCLUDE. Check if it activates correctly.
```

## Workflow Integration

### After Manual Edits
1. Edit object in SAP GUI or ADT
2. Use this skill to activate and check syntax
3. Review errors/warnings
4. Fix issues
5. Re-activate

### Pre-Transport Check
1. Use this skill on all objects in transport
2. Ensure all activate successfully
3. Review warnings
4. Transport only after clean activation

### Syntax Validation
1. Make experimental changes
2. Use this skill to validate
3. Review results
4. Decide whether to keep changes

## Error Interpretation Guide

**How to read activation errors:**

```
Line 15, Column 12: Unknown variable 'lv_customer'
│      │          └─ Issue description
│      └─ Character position
└─ Line number with error
```

**Common patterns:**
- `Unknown variable`: Not declared or typo
- `Type mismatch`: Incompatible types in assignment
- `Syntax error`: Invalid ABAP statement
- `Object not found`: Missing dependency
- `Statement not expected`: Context error (e.g., ENDLOOP without LOOP)

## Tips for Effective Use

1. **Fix errors first**: Start with line 1, work down
2. **One error may cause others**: Fix root cause first
3. **Check warnings too**: Improve code quality
4. **Use quickfixes**: When available, they're reliable
5. **Understand context**: Some errors are misleading

## Output Expectations

When Copilot uses this skill, expect:
- Activation success/failure status
- Complete error list with line numbers
- Warning list with severity
- Fix recommendations
- Next steps: "Fix errors and re-activate"

## Integration with Other Skills

**Typical workflow:**
1. Use `change-ai-object` (auto-activates)
2. If issues found, use `get-object-info` to review
3. Use `change-ai-object` again to fix
4. Optional: Use `activate-object` for final validation

**Manual edit workflow:**
1. Edit manually in GUI/ADT
2. Use `activate-object` to check
3. Use `get-object-info` to view current source
4. Use `change-ai-object` to fix if needed

**Quality workflow:**
1. Use `activate-object` to ensure clean compilation
2. Use `get-atc-results` for quality checks
3. Use `change-ai-object` to fix both syntax and quality
4. Re-run both checks

## Activation Strategies

### Incremental Activation
```
1. Activate foundation objects first (data elements, structures)
2. Then activate using objects (classes, programs)
3. Finally activate dependent objects (CDS views with associations)
```

### Bulk Activation
```
For multiple related objects:
1. List all objects to activate
2. Activate in dependency order
3. Collect all errors
4. Fix systematically
```

### Validation-Only Activation
```
Use when you want syntax check without committing changes:
1. Save as inactive
2. Use activate-object for validation
3. Review errors
4. Discard if results unsatisfactory
```

## Understanding Activation Context

**Active vs Inactive:**
- **Active**: Runtime-executable, visible to others
- **Inactive**: Saved but not usable, private

**Mass Activation:**
- Single object: This tool activates one at a time
- Multiple objects: GUI mass activation better for bulk

**Dependencies:**
- Activation may cascade to dependent objects
- Errors in dependencies appear in results
- Fix dependencies first

## When Activation Fails

**Troubleshooting steps:**

1. **Review error messages**: Read carefully, check line numbers
2. **Check dependencies**: Are referenced objects active?
3. **Verify syntax**: Use ABAP syntax guide
4. **Compare with working code**: Find similar patterns
5. **Incremental fixes**: Fix one error, re-activate, repeat

## Performance Considerations

Activation is fast for:
- Single programs
- Small classes
- Simple CDS views

Activation may be slower for:
- Large function groups (many functions)
- Complex class hierarchies
- CDS views with many associations

## Best Practices

1. **Activate frequently**: Don't accumulate inactive objects
2. **Fix on first error**: Don't skip errors
3. **Understand warnings**: May indicate future issues
4. **Document changes**: Update description if behavior changes
5. **Version control**: Keep backup before major changes
6. **Test after activation**: Activation ≠ correctness

## Safety Features

**Built-in safeguards:**
- ✅ Z*/Y* object restriction
- ✅ Prevents SAP standard modification
- ✅ Detailed error reporting
- ✅ No data changes (syntax only)
- ✅ Reversible (can de-activate)
