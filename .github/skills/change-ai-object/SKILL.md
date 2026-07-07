---
name: change-ai-object
description: Update existing ABAP objects with new source code. Use when modifying, updating, fixing, or refactoring existing ABAP objects. SECURITY: Only modifies objects in $TMP package. Keywords: modify, update, change, fix, refactor, edit code, update program, change class, fix errors
license: MIT
---

# Change AI-Managed ABAP Objects

Update existing ABAP objects with new source code using the MCP `ChangeAIObject` tool.

## When to Use This Skill

Use this skill when you need to:
- Update existing ABAP programs/reports
- Modify class implementations
- Fix syntax errors or bugs
- Refactor code for quality/performance
- Update CDS views or behavior definitions
- Change function modules or includes
- Apply ATC recommendations

## ⚠️ SECURITY RESTRICTION

**This tool ONLY modifies objects in `$TMP` package.**

- ✅ Safe: Objects in $TMP (local development)
- ❌ Blocked: Objects in any other package

**Why this restriction:**
- Prevents accidental modification of transported code
- Ensures AI changes stay in development sandbox
- Protects production and team code
- Allows safe experimentation

## Supported Object Types

Same as `create-ai-object`:
- `program`, `class`, `interface`, `include`
- `function_group`, `function`, `function_group_include`
- `data_element`, `table`, `structure`
- `cds_view`, `dcl`, `behaviour_definition`
- `service_definition`, `metadata_extension`

## Required Parameters

- `object_name`: Name of existing object (must exist in $TMP)
- `source_code`: Updated ABAP source (string or multi-section object)

## Optional Parameters

- `description`: Updated description (max 30 characters)
- `object_type`: Type from enum (defaults to `program`)
- `additional_params`: Object-specific parameters

## Source Code Formats

### Simple String
```abap
source_code: "Updated program code..."
```

### Multi-Section (Classes, Behavior Implementations)
```javascript
source_code: {
  main: "Updated class definition...",
  definitions: "Updated type definitions...",
  implementations: "Updated local handler classes...",
  testclasses: "Updated test classes...",
  macros: "Updated macros..."
}
```

## Workflow and Safety

The tool automatically:
1. ✅ Validates object exists
2. ✅ Validates object is in $TMP
3. ✅ Locks the object (prevents concurrent changes)
4. ✅ Updates source code
5. ✅ Unlocks the object
6. ✅ **Activates the object**
7. ✅ Returns activation results with errors/warnings

## Validation Before Change

**Pre-change checks:**
- Object must exist
- Object must be in $TMP package
- Object must be unlocked or lockable
- User must have modification authority

**If validation fails:**
- Clear error message
- No changes made
- Suggestions for resolution

## Activation Results

Returns detailed activation status:
```json
{
  "success": true,
  "object_name": "ZAI_MY_PROGRAM",
  "changes_applied": true,
  "activation": {
    "success": false,
    "errors": [
      {
        "line": 12,
        "message": "Unknown variable 'lv_test'",
        "severity": "error"
      }
    ],
    "warnings": []
  }
}
```

## Usage Examples

**Fix syntax errors:**
```
Fix the syntax error on line 12 in program ZAI_SALES_REPORT
```

**Refactor code:**
```
Refactor class ZAI_CUSTOMER_HANDLER to use the builder pattern
```

**Add functionality:**
```
Add a new method 'validate_email' to class ZAI_VALIDATOR
```

**Update CDS view:**
```
Add association to I_Customer in CDS view ZAI_BOOKING
```

**Apply ATC fixes:**
```
Fix the performance warning in ZAI_DATA_PROCESSOR by removing SELECT in loop
```

## Iterative Development Pattern

Common workflow for fixing issues:

1. **Get current code:**
   ```
   Show me the code for ZAI_MY_PROGRAM
   ```

2. **Check quality:**
   ```
   Run ATC on ZAI_MY_PROGRAM
   ```

3. **Fix issues:**
   ```
   Fix the errors in ZAI_MY_PROGRAM [AI generates fix]
   ```

4. **Verify fix:**
   ```
   Run ATC again to verify fixes
   ```

## Error Handling

**Common errors and fixes:**

| Error | Cause | Fix |
|-------|-------|-----|
| Object not in $TMP | Wrong package | Can't modify - create new version in $TMP |
| Object locked | Another user editing | Wait or break lock (if permitted) |
| Syntax error after change | Bad code generation | Review error, regenerate fix |
| Object not found | Wrong name | Check name with search-object |
| Activation failed | Structural issues | Review activation log |

## Tips for Effective Use

1. **Always get current code first**: Use `get-object-info` before changing
2. **Check ATC first**: Know what to fix
3. **Make incremental changes**: Small changes are easier to debug
4. **Review activation results**: Don't ignore warnings
5. **Test after changes**: Verify functionality
6. **Use version comparison**: Compare before/after

## Output Expectations

When Copilot uses this skill, expect:
- Change confirmation
- Activation status
- Line numbers for errors/warnings
- Severity levels (error/warning/info)
- Fix recommendations if activation failed
- Next steps: "Test the changes" or "Fix remaining errors"

## Integration with Other Skills

**Typical workflow:**
1. Use `get-object-info` to view current code
2. Use `get-atc-results` to identify issues
3. Use `change-ai-object` to apply fixes
4. Review activation results
5. Use `get-atc-results` again to verify fixes

**Quality improvement workflow:**
1. `get-atc-results` → Find issues
2. `sap-help-search` → Research best practices
3. `change-ai-object` → Apply improvements
4. `get-atc-results` → Verify improvements

## Multi-Section Updates

**For classes with local handler classes:**
```javascript
{
  main: "CLASS zcl_travel_handler DEFINITION... ENDCLASS. CLASS zcl_travel_handler IMPLEMENTATION... ENDCLASS.",
  implementations: "CLASS lhc_travel DEFINITION... ENDCLASS. CLASS lhc_travel IMPLEMENTATION... ENDCLASS."
}
```

**Benefits:**
- RAP behavior implementations with LHC_* classes
- Separation of test classes
- Cleaner code organization
- Easier maintenance

## Refactoring Patterns

### Performance Refactoring
```
Before: SELECT in loop
Fix: Single SELECT with FOR ALL ENTRIES
Tool: change-ai-object applies optimization
```

### Security Refactoring
```
Before: Concatenated SQL
Fix: Parameters and escaping
Tool: change-ai-object applies security fix
```

### Cloud Readiness
```
Before: Non-released API
Fix: Released API alternative
Tool: change-ai-object migrates to new API
```

## Safety Features

**Built-in safeguards:**
- ✅ $TMP-only restriction (can't modify production)
- ✅ Automatic locking (prevents conflicts)
- ✅ Activation with syntax check
- ✅ Rollback on activation failure
- ✅ Detailed error reporting

## When NOT to Use

❌ Don't use this skill when:
- Object is not in $TMP (create new version instead)
- Only viewing code (use `get-object-info`)
- Creating new object (use `create-ai-object`)
- Just checking activation (use `activate-object`)

## Moving from $TMP to Package

After successful changes in $TMP:
1. Test thoroughly
2. Manually create object in target package
3. Copy source from $TMP version
4. Add to transport request
5. Delete $TMP version

**Note:** This step is manual - tool doesn't transport objects.

## Best Practices

1. **Version control mindset**: Treat each change as a commit
2. **Atomic changes**: One logical change at a time
3. **Test immediately**: Don't accumulate untested changes
4. **Document rationale**: Update description if behavior changes
5. **Review activation log**: Learn from errors
6. **Keep backups**: Copy code before major refactoring
