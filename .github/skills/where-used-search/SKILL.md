---
name: where-used-search
description: Find where ABAP objects are used across the system. Use when analyzing dependencies, finding usages, checking impact, or before deletion/modification. Shows which programs, classes, or objects reference the target object. Keywords: where used, dependencies, usages, references, impact analysis, who uses, used by
license: MIT
---

# Where-Used Search for ABAP Objects

Find where ABAP objects are used across the system using the MCP `WhereUsedSearch` tool.

## When to Use This Skill

Use this skill when you need to:
- Find dependencies before modifying an object
- Identify impact of proposed changes
- Check if an object is safe to delete
- Understand object usage patterns
- Locate all programs/classes using a specific API
- Analyze call hierarchies
- Plan refactoring scope

## What is Where-Used Search?

Where-used search finds all places where an object is referenced:
- **Classes**: Which programs/classes instantiate or call it?
- **Function modules**: Where are they called?
- **Tables**: Which programs read/write them?
- **CDS views**: What consumes them?
- **Interfaces**: What implements them?
- **Data elements**: Which structures/tables use them?

## Supported Object Types

| Type | Description | Example |
|------|-------------|---------|
| `CLAS` | Classes | ZCL_MY_HANDLER |
| `FUGR` | Function Groups | ZMY_FG |
| `TABL` | Tables | ZMY_CUSTOMER |
| `DTEL` | Data Elements | ZMY_CUSTOMER_ID |
| `DOMA` | Domains | ZMY_DOMAIN |
| `STRU` | Structures | ZMY_STRUCTURE |
| `PROG` | Programs | ZMY_REPORT |
| `INTF` | Interfaces | ZIF_MY_INTERFACE |
| `DDLS` | CDS Views | ZI_BOOKING |
| `BDEF` | Behavior Definitions | ZI_TRAVEL_BO |
| `SRVD` | Service Definitions | ZUI_BOOKING |
| `DDLX` | Metadata Extensions | ZC_BOOKING_MDEX |
| `DCLS` | DCL (Access Control) | ZI_BOOKING_DCL |

## Required Parameters

**Option 1: Object Type + Name**
- `object_type`: Type from enum above
- `object_name`: Name of the object

**Option 2: Object URI**
- `object_uri`: Full ADT URI (e.g., `/sap/bc/adt/oo/classes/zcl_my_class`)

## Output Format

Returns list of usages with:
- **Using object name**: What references it
- **Using object type**: Type of referencing object
- **Package**: Where the using object lives
- **URI**: Link to the using object
- **Usage count**: Total number of references

Example:
```json
{
  "usages": [
    {
      "name": "ZMY_SALES_REPORT",
      "type": "PROG",
      "package": "ZSALES",
      "uri": "/sap/bc/adt/programs/programs/zmy_sales_report"
    },
    {
      "name": "ZCL_ORDER_PROCESSOR",
      "type": "CLAS/OC",
      "package": "ZSALES",
      "uri": "/sap/bc/adt/oo/classes/zcl_order_processor"
    }
  ],
  "total_usages": 2
}
```

## Usage Examples

**Find class usages:**
```
Where is class ZCL_CUSTOMER_VALIDATOR used?
```

**Check function module dependencies:**
```
Show me all programs that call function Z_GET_CUSTOMER_DATA
```

**Table usage analysis:**
```
Which objects read from table ZCUSTOMER_EXT?
```

**CDS view consumers:**
```
What uses CDS view ZI_SALESORDER?
```

**Impact analysis before change:**
```
I want to change interface ZIF_BOOKING_API. What implements it?
```

**Safe deletion check:**
```
Can I safely delete class ZCL_OLD_HELPER? Check where it's used.
```

## Common Use Cases

### 1. Pre-Modification Impact Analysis
```
Before: Change class signature
Step: Where-used search
Result: List of all calling code
Action: Update all callers
```

### 2. Refactoring Planning
```
Before: Deprecate old API
Step: Where-used search
Result: Find all usages
Action: Plan migration
```

### 3. Safe Deletion
```
Before: Delete unused object
Step: Where-used search
Result: 0 usages found
Action: Safe to delete
```

### 4. API Adoption Analysis
```
Before: Check if new API is used
Step: Where-used search
Result: List of consumers
Action: Monitor adoption
```

## Interpreting Results

### Zero Usages
**Possible meanings:**
- Object is truly unused (safe to delete)
- Object is only used in inactive code
- External usage (RFC, web service)
- Dynamic usage (CALL METHOD var->method)

**Verification steps:**
- Check transport history
- Review documentation
- Look for dynamic calls
- Confirm with team

### High Usage Count
**Implications:**
- High impact if changed
- Risk of breaking changes
- Need comprehensive testing
- Consider deprecation strategy

**Next steps:**
- Group usages by project/package
- Prioritize critical callers
- Plan phased migration
- Create compatibility layer

### Unexpected Usages
**When you find:**
- Test programs using production objects
- Old code using deprecated APIs
- Cross-module dependencies
- Circular references

**Actions:**
- Review architectural implications
- Consider refactoring
- Update documentation
- Plan cleanup

## Workflow Integration

### Pre-Change Workflow
1. `get-object-info` → View current implementation
2. `where-used-search` → Find dependencies
3. Plan changes considering impact
4. `change-ai-object` → Apply changes
5. Test all identified usages

### Refactoring Workflow
1. `where-used-search` → Find current usages
2. `create-ai-object` → Create new implementation
3. Update each usage incrementally
4. Re-run `where-used-search` on old object
5. Delete old object when 0 usages

### Cleanup Workflow
1. `search-object` → Find cleanup candidates
2. `where-used-search` → Check each candidate
3. Delete if 0 usages
4. Refactor if few usages
5. Document if many usages (plan for later)

## Tips for Effective Use

1. **Check before modify**: Always run where-used before changes
2. **Understand usage patterns**: Group by package/project
3. **Consider dynamic calls**: Where-used may miss runtime calls
4. **Review external interfaces**: RFC, OData may not appear
5. **Document findings**: Keep record for change planning

## Output Expectations

When Copilot uses this skill, expect:
- Total usage count
- List of using objects with types
- Package organization
- Impact assessment
- Recommendations: "High usage - plan carefully"
- Next steps: "Review each caller before proceeding"

## Integration with Other Skills

**Typical workflow:**
1. Use `search-object` to find targets
2. Use `where-used-search` to check dependencies
3. Use `get-object-info` to review each dependent
4. Use `change-ai-object` to update if needed
5. Use `get-atc-results` to verify changes

**Cleanup workflow:**
1. `where-used-search` → Check usage
2. If 0 usages: Safe to delete
3. If 1-5 usages: Consider refactoring
4. If 5+ usages: Document, plan migration

## Advanced Patterns

### Dependency Graph Analysis
```
For complex object:
1. Where-used on main object
2. Where-used on each dependent
3. Build dependency tree
4. Plan bottom-up refactoring
```

### API Migration Support
```
For deprecated API:
1. Where-used on old API
2. Create mapping to new API
3. Update each usage with tool
4. Verify with where-used (should be 0)
```

### Impact Scoring
```
Usage count → Impact level:
0 usages: No impact (safe)
1-5 usages: Low impact (manageable)
6-20 usages: Medium impact (plan carefully)
20+ usages: High impact (major change)
```

## Limitations

**Where-used may NOT find:**
- Dynamic method calls (`CALL METHOD (lv_method)`)
- RFC calls from external systems
- OData consumption from web apps
- Runtime-generated code
- Usage in inactive objects (sometimes)

**Always supplement with:**
- Manual code search
- Team consultation
- Documentation review
- Transport history analysis

## Best Practices

1. **Run early**: Check dependencies before starting changes
2. **Document results**: Keep usage list for reference
3. **Group by priority**: Critical usages first
4. **Test all callers**: Don't assume compatibility
5. **Communicate changes**: Inform teams of dependent objects
6. **Version control**: Track what was updated
7. **Rollback plan**: Know how to revert if issues arise

## Safety Considerations

**Before deleting objects:**
- ✅ Zero usages confirmed
- ✅ Checked in all systems (DEV, QA, PROD)
- ✅ Reviewed transport history
- ✅ Consulted team
- ✅ Documented decision

**Before major changes:**
- ✅ All usages identified
- ✅ Impact assessed
- ✅ Test plan created
- ✅ Rollback plan ready
- ✅ Dependent teams notified
