---
name: data-preview
description: Execute SELECT-only SQL queries against SAP tables and CDS views with comprehensive security validation. Use for querying data, previewing table contents, testing CDS views, or exploring SAP data. Blocks DML/DDL operations for safety. Keywords: query data, SELECT, preview table, CDS query, data exploration, SQL query, table data, view data
license: MIT
---

# Data Preview - SAP Table and CDS Query

Execute SELECT-only SQL queries against SAP tables and CDS views using the MCP `data_preview` tool.

## When to Use This Skill

Use this skill when you need to:
- Preview table contents
- Query CDS view data
- Test CDS view results
- Explore SAP data structures
- Validate data after object creation
- Check filter conditions
- Verify associations and joins
- Analyze data patterns

## ⚠️ SECURITY & SAFETY

**This tool enforces strict security:**
- ✅ **SELECT queries ONLY**: Read operations permitted
- ❌ **DML blocked**: INSERT, UPDATE, DELETE, MERGE not allowed
- ❌ **DDL blocked**: CREATE, DROP, ALTER, TRUNCATE not allowed
- ❌ **Comments blocked**: SQL comments not permitted
- ❌ **Multiple statements blocked**: Single SELECT only
- ✅ **SAP authorization enforced**: User's existing authorities apply

**Why these restrictions:**
- Prevents data modification
- Protects system integrity
- Enforces SAP security model
- Safe for AI-generated queries
- Read-only exploration

## Supported Object Types

| Type | Description | Example |
|------|-------------|---------|
| `ddic` | Database tables, transparent tables | MARA, VBAK, ZCUSTOMER |
| `cds` | CDS views and CDS view entities | I_SalesOrder, ZI_Booking |

## Required Parameters

- `object_name`: Name of table or CDS view to query
- `sql_query`: SELECT statement (validated for safety)

## Optional Parameters

- `object_type`: `ddic` (default) or `cds`
- `max_rows`: Maximum rows to return (1-1000, default: 100)

## SQL Query Validation

**Automatic validation checks:**
1. ✅ Query starts with SELECT
2. ✅ No DML keywords (INSERT, UPDATE, DELETE)
3. ✅ No DDL keywords (CREATE, DROP, ALTER)
4. ✅ No SQL comments (--,  /*, */)
5. ✅ Single statement only (no semicolons except at end)
6. ✅ Query references the specified object

**Rejected query examples:**
```sql
❌ "SELECT * FROM mara; DELETE FROM mara"
❌ "INSERT INTO table VALUES (...)"
❌ "UPDATE table SET field = value"
❌ "DROP TABLE ztable"
❌ "SELECT * FROM mara -- comment"
```

**Accepted query examples:**
```sql
✅ "SELECT * FROM mara"
✅ "SELECT matnr, mtart FROM mara WHERE mtart = 'FERT'"
✅ "SELECT TOP 10 * FROM vbak"
✅ "SELECT * FROM I_SalesOrder WHERE SalesOrderType = 'OR'"
```

## Output Format

Returns structured JSON:
```json
{
  "success": true,
  "object_name": "MARA",
  "object_type": "ddic",
  "row_count": 15,
  "max_rows": 100,
  "columns": [
    {
      "name": "MATNR",
      "type": "CHAR",
      "length": 40,
      "description": "Material Number"
    }
  ],
  "rows": [
    {
      "MATNR": "000000000000000001",
      "MTART": "FERT",
      "MATKL": "001"
    }
  ]
}
```

## Usage Examples

**Preview table contents:**
```
Show me the first 10 rows from table MARA
```

**Query with filter:**
```
Get all sales orders from table VBAK where order type is 'OR'
```

**CDS view query:**
```
Query CDS view I_SalesOrder for orders created in 2024
```

**Specific fields:**
```
Show material number and description from MARA for finished goods
```

**Join exploration:**
```
Query ZI_BOOKING to see customer and flight associations
```

**Data validation:**
```
After creating ZI_CUSTOMER, preview the data to verify associations work
```

## Common Query Patterns

### Basic Preview
```sql
SELECT * FROM table_name
Purpose: Quick overview of table structure and data
```

### Limited Rows
```sql
SELECT TOP 10 * FROM table_name
Purpose: Sample data without overwhelming output
```

### Specific Fields
```sql
SELECT field1, field2, field3 FROM table_name
Purpose: Focus on relevant columns
```

### Filtered Data
```sql
SELECT * FROM table_name WHERE field = 'value'
Purpose: Narrow down to relevant records
```

### Ordered Results
```sql
SELECT * FROM table_name ORDER BY field DESC
Purpose: See newest/highest/sorted data first
```

### CDS View with Parameters
```sql
SELECT * FROM cds_view( parameter = 'value' )
Purpose: Test CDS view parameters
```

## Workflow Integration

### Recommended Workflow
**This is step 4 in the research-query workflow:**

1. **Use SAP documentation tools** → Identify relevant table/CDS name
   ```
   Search SAP Help for "sales order data model"
   Result: VBAK, VBAP tables or I_SalesOrder CDS
   ```

2. **Use GetObjectInfo** → Retrieve metadata/structure
   ```
   Get object info for I_SalesOrder
   Result: Field definitions, associations, annotations
   ```

3. **AI formulates SQL query** → Based on structure and requirement
   ```
   AI: "Based on fields, query should be:
        SELECT SalesOrder, Customer, CreationDate 
        FROM I_SalesOrder 
        WHERE CreationDate >= '2024-01-01'"
   ```

4. **Execute with data_preview** → Run the query
   ```
   Execute query on I_SalesOrder
   Result: Actual data matching criteria
   ```

### Development Workflow
1. `create_ai_object` → Create CDS view
2. `activate_object` → Activate and check syntax
3. `data_preview` → Test CDS view returns expected data
4. Iterate if needed

### Exploration Workflow
1. `search_object` → Find relevant tables/views
2. `get_object_info` → Understand structure
3. `data_preview` → Explore actual data
4. Use insights for development

## Tips for Effective Queries

1. **Start with LIMIT**: Use TOP 10 for initial exploration
2. **Specific fields**: Don't always SELECT * - choose relevant fields
3. **Add filters**: WHERE clauses reduce result size
4. **Test incrementally**: Start simple, add complexity
5. **Mind max_rows**: Default 100, increase if needed
6. **Use field names carefully**: SAP field names are case-sensitive in some contexts
7. **Test CDS parameters**: Verify parameter handling works
8. **Check associations**: Query associated data to test joins

## Output Expectations

When Copilot uses this skill, expect:
- Row count and data sample
- Column definitions with types
- Formatted data table
- Indication if results truncated (due to max_rows)
- Data interpretation if relevant
- Next steps: "Modify query to filter further" or "Data looks correct"

## Integration with Other Skills

**Data exploration workflow:**
1. `search_object` → Find tables/views
2. `get_object_info` → Understand structure
3. `data_preview` → See actual data
4. Use findings in development

**CDS development workflow:**
1. `sap_help_search` → Research CDS patterns
2. `create_ai_object` → Create CDS view
3. `data_preview` → Test CDS view
4. `change_ai_object` → Fix issues if found
5. Re-run `data_preview` to verify

**Validation workflow:**
1. `create_ai_object` → Create object
2. `get_atc_results` → Check code quality
3. `data_preview` → Validate data correctness
4. `change_ai_object` if issues found

## Common Use Cases

### 1. Table Content Preview
```
Query: "SELECT TOP 100 * FROM mara"
Use: See what material master data looks like
```

### 2. CDS View Testing
```
Query: "SELECT * FROM ZI_BOOKING"
Use: Verify newly created CDS view returns data
```

### 3. Filter Validation
```
Query: "SELECT * FROM vbak WHERE erdat >= '20240101'"
Use: Test date filter works correctly
```

### 4. Association Check
```
Query: "SELECT booking_id, customer_id, customer._name FROM ZI_BOOKING"
Use: Verify CDS association to customer works
```

### 5. Data Pattern Analysis
```
Query: "SELECT DISTINCT mtart FROM mara"
Use: Find all material types in system
```

### 6. Record Count
```
Query: "SELECT COUNT(*) as record_count FROM table"
Use: Check table size
```

## Error Handling

**Common errors and fixes:**

| Error | Cause | Fix |
|-------|-------|-----|
| SQL validation failed | DML/DDL in query | Use SELECT only |
| Object not found | Wrong table name | Check name with search_object |
| Authorization error | No read access | Request authorization or use different table |
| SQL syntax error | Invalid SQL | Check SAP SQL syntax |
| Field not found | Wrong field name | Use get_object_info to check fields |

## Security & Authorization

**SAP authorization applies:**
- You can only query tables/views you have authority for
- Authorization object S_TABU_DIS controls table access
- CDS view access controls (DCL) are enforced
- User's existing authorities determine what data is visible

**Authorization errors:**
```
Error: No authorization for table MARA
Solution: Request authorization from SAP Basis team
Workaround: Use CDS views with appropriate DCL
```

## SAP SQL Dialect

**SAP HANA SQL features (S/4HANA):**
- TOP clause for limiting rows
- Advanced functions (STRING_AGG, etc.)
- CDS view parameters
- Associations in SELECT

**Traditional SQL features (ECC):**
- Standard WHERE, ORDER BY
- Aggregate functions (COUNT, SUM, AVG)
- JOIN operations
- DISTINCT

**Consult SAP documentation for specific SQL capabilities of your system.**

## Best Practices

1. **Preview before building**: Check data before creating CDS views
2. **Use TOP/LIMIT**: Don't query millions of rows
3. **Specific fields**: SELECT specific fields, not always *
4. **Test associations**: When creating CDS, test associations with data_preview
5. **Iterate queries**: Start simple, refine based on results
6. **Check field names**: Use get_object_info to verify correct field names
7. **Mind performance**: Even SELECT can impact system if not careful
8. **Respect authorizations**: Don't try to bypass SAP security

## Limitations

**What this tool CANNOT do:**
- ❌ Modify data (by design - security feature)
- ❌ Create/drop objects (use create_ai_object instead)
- ❌ Execute stored procedures (SELECT only)
- ❌ Access tables user has no authority for
- ❌ Bypass SAP security model

**When you need data modification:**
- Use SAP GUI transactions
- Create ABAP programs with proper authority
- Use SAP standard BAPIs/APIs
- This tool is intentionally read-only for safety

## Data Privacy

**Important reminders:**
- Respect data privacy laws (GDPR, etc.)
- Don't query sensitive personal data unnecessarily
- Be aware of what data you're viewing
- Follow your organization's data policies
- Use WHERE clauses to limit personal data exposure
- Consider masking/anonymization requirements
