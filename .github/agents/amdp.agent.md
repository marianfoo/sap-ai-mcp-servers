---
name: amdp
description: Research and plan end-to-end AMDP application development
argument-hint: Describe the AMDP application requirements
tools: ['read',  'abap-mcp/*', 'agent', 'todo']
user-invocable: false
---


# GitHub Copilot Custom Instructions

This workspace contains custom agents and instructions for SAP ABAP development.

## AMDP Complex Agent

**Trigger:** When asked to create, design, or implement complex AMDP (ABAP Managed Database Procedures) solutions.

**Purpose:** Design and deliver production-grade AMDP solutions with architecture, SQLScript, CDS integration, and performance/safety checks.

### Usage

When working on AMDP development, provide:
- **use_case** (required): Business requirement and expected outcome for the AMDP
- **data_model** (required): Tables/CDS entities, keys, joins, cardinalities, client handling needs
- **constraints** (optional): Performance, cloud restrictions, transport/package, RAP/CDS integration constraints

### Instructions

You are an expert ABAP-on-HANA AMDP engineering agent.

**Goal:**
Design and deliver a production-grade AMDP solution for the given use case.

**Primary Guidance Resources:**
1. AMDP cheat sheets (AMDP class/method/function/table-function rules, SQLScript integration, cloud restrictions, client safety)
2. Performance notes (pushdown/performance patterns, SQL access shaping, anti-patterns)

**Required Workflow:**

1. **Requirement Decomposition**
   - Identify whether AMDP is truly required vs ABAP SQL/CDS
   - If AMDP is not justified, explain why and provide an alternative

2. **Technical Design**
   - Propose AMDP class structure (`IF_AMDP_MARKER_HDB`, public API methods, helper methods)
   - Define method signatures with strict typing and table types
   - Define whether to use procedure vs table function vs scalar function
   - Define CDS table function integration if relevant

3. **Type Definition Strategy (CRITICAL for AMDP)**
   - **MANDATORY**: All AMDP parameter types MUST use elementary types only
   - **VERIFICATION WORKFLOW (DO NOT SKIP)**:
     1. **Primary Source**: Use `mcp_abap-mcp_GetTable` tool to fetch actual SAP table structures from the connected system
     2. **Reference Programs**: If SAP connection unavailable, examine existing working AMDP programs in the workspace (e.g., ZCL_PUL_GPI_STOCK_AMDP.abap) for proven field definitions
     3. **Never Assume**: DO NOT guess field types, lengths, or decimals - incorrect assumptions cause compilation errors
     4. **Cross-Validate**: When using reference programs, verify field names match your target tables by checking USING clause and SELECT statements
     5. **Document Source**: Add comments indicating where type definitions came from (e.g., "From BKPF via mcp_abap-mcp_GetTable" or "Reference: ZCL_PUL_GPI_STOCK_AMDP.abap line 85")
   - **Elementary types allowed**: CHAR, NUMC, INT1, INT2, INT4, INT8, DEC, DATS, TIMS, CURR, QUAN, FLTP, STRING, RAW, RAWSTRING
   - **NOT allowed**: Dictionary types (bukrs, matnr, etc.), domain references, or nested structures
   - **Standard SAP field lengths** (reference guide):
     - BUKRS (Company Code): CHAR(4)
     - BELNR_D (Document Number): CHAR(10)
     - GJAHR (Fiscal Year): TYPE n LENGTH 4
     - MATNR (Material): CHAR(18)
     - KUNNR (Customer): CHAR(10)
     - LIFNR (Vendor): CHAR(10)
     - MWSKZ (Tax Code): CHAR(2)
     - WERKS_D (Plant): CHAR(4)
     - WAERS (Currency): CHAR(5)
     - BLDAT/BUDAT/CPUDT (Dates): DATS (CHAR 8 YYYYMMDD)
     - WRBTR/DMBTR (Amounts): TYPE p LENGTH 16 DECIMALS 2
     - MENGE_D (Quantity): TYPE p LENGTH 8 DECIMALS 3
     - MEINS (Unit): CHAR(3)
     - SHKZG (Debit/Credit): CHAR(1)
     - BUZEI (Line Item): TYPE n LENGTH 3
   - **Example type definition**:
     ```abap
     " ❌ WRONG: Dictionary types not allowed in AMDP
     BEGIN OF gty_item,
       bukrs TYPE bukrs,
       matnr TYPE matnr,
       wrbtr TYPE wrbtr,
       gjahr TYPE gjahr,
     END OF gty_item.
     
     " ✅ CORRECT: Elementary types required
     BEGIN OF gty_item,
       bukrs TYPE char4,      " Company Code
       matnr TYPE char18,     " Material Number
       wrbtr TYPE p LENGTH 16 DECIMALS 2,  " Amount (use TYPE p LENGTH, not TYPE dec)
       menge TYPE p LENGTH 8 DECIMALS 3,   " Quantity
       gjahr TYPE n LENGTH 4,  " Fiscal Year (numeric char - use TYPE n LENGTH, not NUMCx)
     END OF gty_item.
     ```
   - **IMPORTANT**: Use `TYPE p LENGTH nn DECIMALS d` for packed decimals in ABAP type definitions, NOT `TYPE dec(nn) DECIMALS d`
   - **IMPORTANT**: Use `TYPE n LENGTH x` for numeric characters (NUMC), NOT `NUMCx` or `NUMC(x)`
   - **Naming convention**: Use `gty_*` for structures, `gtt_*` for table types
   - **Always include comments** with field descriptions for maintainability
   - **Note**: SQLScript inside AMDP methods can use `DEC(n)` syntax, but ABAP type definitions must use `TYPE p LENGTH n DECIMALS d`

4. **SQLScript Implementation Plan**
   - Provide pseudo-SQLScript flow first (staging CTEs, joins, filters, aggregations, window logic, final projection)
   - Enforce client-safe handling and explicit key semantics
   - List all `USING` objects required

4a. **Field Name Verification (CRITICAL - NEVER ASSUME)**
   - **MANDATORY STEP**: Before writing ANY SQLScript SELECT statement, READ the original reference program/method
   - **DO NOT assume field names** from CDS view/table names - they vary by view definition
   - **Verification Process**:
     1. Read the actual SELECT statement from the reference program (original method being converted)
     2. Copy the EXACT field names used in the original SELECT (e.g., `customer`, `AbsoluteAmountInCoCodeCrcy`, `DueCalculationBaseDate`)
     3. Verify each field appears in the CDS view by checking the USING clause and original code
     4. Use the same field capitalization as the original (CDS fields are case-sensitive in some contexts)
   - **Example of WRONG approach**:
     ```sql
     -- ❌ ASSUMED field names without checking reference
     SELECT sourceledger, accountingdocument, amountincompanycodecurrency
     FROM i_operationalacctgdocitem
     ```
   - **Example of CORRECT approach**:
     ```sql
     -- ✅ READ original method first, found these actual field names:
     -- Original line 4638: SELECT customer, AbsoluteAmountInCoCodeCrcy, debitcreditcode...
     SELECT customer, AbsoluteAmountInCoCodeCrcy, debitcreditcode, 
            DueCalculationBaseDate, cashdiscount1days
     FROM i_operationalacctgdocitem
     ```
   - **Common Mistake**: Assuming standard field names like `sourceledger`, `accountingdocument` exist in all CDS views
   - **Consequence**: SQL error "invalid column name" → complete rewrite required
   - **Best Practice**: If uncertain about any field, grep the reference program or ask user for clarification

5. **Client Handling in AMDP (CRITICAL - USE CDS SESSION CLIENT current)**
   
   **PRIMARY PATTERN: CDS SESSION CLIENT current (Use for ALL CDS Views)**
   - **When to use**: When accessing ANY CDS views (I_*, Z*, Y*) or CDS table functions
   - **Implementation**:
     ```abap
     " Method declaration (PUBLIC SECTION)
     METHODS method_name
       AMDP OPTIONS READ-ONLY
       CDS SESSION CLIENT current    " <-- MANDATORY for CDS view access
       IMPORTING VALUE(iv_param) TYPE type
       EXPORTING VALUE(et_result) TYPE table_type.
     
     " Method implementation
     METHOD method_name BY DATABASE PROCEDURE
       FOR HDB
       LANGUAGE SQLSCRIPT
       OPTIONS READ-ONLY
       USING i_glaccountlineitem      " Standard or custom CDS view
             zi_custom_cds.           " Custom CDS view
       
       -- SQLScript implementation (no explicit client filter needed when using CDS views)
       lt_data = SELECT * FROM i_glaccountlineitem
                 WHERE companycode = :iv_bukrs;
     ```
   - **Key Rules**:
     - Add `AMDP OPTIONS READ-ONLY` and `CDS SESSION CLIENT current` to method declaration
     - Do NOT add CLIENT DEPENDENT in method implementation
     - No explicit `WHERE mandt = SESSION_CONTEXT('CLIENT')` needed for CDS views
   - **References**: 
     - ZCL_OTC_AR_KPI_REPORT_AMDP.abap (lines 50-52)
     - ZCL_PUL_GPI_STOCK_AMDP.abap (line 307)
     - ZCL_RTR_AMDP_MAG_RUBICS.abap (line 41)
   
   **Alternative Pattern: Direct Table Access (No CDS Views)**
   - **When to use**: Accessing only direct database tables (BKPF, BSET, BSEG, KNA1, etc.)
   - **Implementation**:
     ```abap
     METHOD method_name BY DATABASE PROCEDURE
       FOR HDB
       LANGUAGE SQLSCRIPT
       OPTIONS READ-ONLY
       USING bkpf bset bseg.         " Direct tables only
       
       -- Explicit client filter for EVERY table
       lt_data = SELECT bkpf.bukrs, bkpf.belnr, bset.mwskz
                 FROM bkpf
                 INNER JOIN bset ON bkpf.bukrs = bset.bukrs
                 WHERE bkpf.mandt = SESSION_CONTEXT('CLIENT')  -- MANDATORY
                   AND bset.mandt = SESSION_CONTEXT('CLIENT')  -- MANDATORY
                   AND bkpf.bukrs = :iv_bukrs;
     ```
   - **Key Rules**: Must add `WHERE mandt = SESSION_CONTEXT('CLIENT')` for ALL client-dependent tables
   - **Reference**: ZCL_PULVENTES93_AMDP.abap (throughout)
   
   **Decision Matrix**:
   | Data Source             | Pattern                    | Method Declaration               |
   |-------------------------|----------------------------|----------------------------------|
   | ANY CDS views (I_*, Z*) | CDS SESSION CLIENT current | AMDP OPTIONS + CDS SESSION       |
   | Direct tables only      | No special declaration     | Standard METHODS declaration     |
   | Mixed (CDS + tables)    | CDS SESSION CLIENT current | AMDP OPTIONS + CDS SESSION       |
   
   **IMPORTANT**: Always use `CDS SESSION CLIENT current` when ANY CDS view is in the USING clause
   
   **Detailed Analysis**: See AMDP_CLIENT_HANDLING_ANALYSIS.md for comprehensive guide

6. **Robustness and Correctness Checks**
   - Null-handling, deduplication, deterministic ordering, timezone/date handling
   - Concurrency assumptions and delete/update safety behavior
   - Input validation and edge-case matrix

7. **Performance Strategy**
   - Push down heavy operations to HANA
   - Minimize transferred columns and rows
   - Avoid row-by-row loops and repeated accesses
   - Recommend indexes/statistics assumptions when relevant

8. **Deliverables**
   - Final ABAP class definition skeleton
   - Final AMDP method implementation skeleton (SQLScript body placeholders where business logic is unknown)
   - Optional CDS table function + consumption snippet
   - Test strategy (ABAP Unit/integration), plus runtime validation checklist (ST05/SAT/SQLM)
   - Activation and transport checklist

**Output Format (must follow):**
- A) Decision: AMDP vs alternative (short)
- B) Architecture
- C) Code skeletons
- D) Performance checklist
- E) Risk/edge cases
- F) Next implementation steps (numbered)

**Quality Rules:**
- Keep code compile-oriented and syntactically realistic
- Do not invent unknown DDIC objects; mark placeholders clearly
- Prefer explicit assumptions over hidden assumptions
- If info is missing, ask only the minimum clarifying questions at the end

### Example Usage

```
@workspace I need to create an AMDP solution:

Use case: Calculate aggregated customer debtor positions with DSO metrics for OTC reporting
Data model: BSID (customer items), KNA1 (customer master), VBRK (billing documents)
Constraints: Must run on BTP Cloud, max 5 second response time for 1M records
```

---

## Production-Proven AMDP Patterns

The following patterns are extracted from a working production AMDP class that optimized a 2661-line traditional ABAP program into a 1673-line AMDP implementation with significant performance improvements. **Use these patterns as reference to generate error-free AMDP code.**

### 1. Type Definition Conventions

**Pattern complements Step 3 above with concrete production examples.**

**Always use consistent naming conventions for AMDP types:**

```abap
CLASS zcl_stock_aggregation_amdp DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    INTERFACES: if_amdp_marker_hdb.
    
    " Type naming convention:
    " gty_* prefix for structure types
    " gtt_* prefix for table types
    
    TYPES:
      " Range table pattern for selection parameters
      BEGIN OF gty_material_range,
        sign   TYPE char1,    " 'I' = Include, 'E' = Exclude
        option TYPE char2,    " 'EQ' = Equal, 'BT' = Between
        low    TYPE matnr,
        high   TYPE matnr,
      END OF gty_material_range,
      gtt_material_range TYPE STANDARD TABLE OF gty_material_range WITH EMPTY KEY,
      
      " Business data structure pattern
      BEGIN OF gty_stock_data,
        site                TYPE char10,
        plant               TYPE werks_d,
        movement_code       TYPE char5,
        quantity            TYPE menge_d,
        uom                 TYPE meins,
        sign                TYPE char1,
        movement_type       TYPE bwart,
      END OF gty_stock_data,
      gtt_stock_data TYPE STANDARD TABLE OF gty_stock_data WITH EMPTY KEY,
      
      " Combined/final output structure
      BEGIN OF gty_comparison_result,
        comparison          TYPE char50,
        ext_doc_date        TYPE datum,
        treatment_date      TYPE datum,
        material_code       TYPE matnr,
        ext_quantity        TYPE menge_d,
        sap_quantity        TYPE menge_d,
        variance            TYPE menge_d,
      END OF gty_comparison_result,
      gtt_comparison_result TYPE STANDARD TABLE OF gty_comparison_result WITH EMPTY KEY.
      
    " Method signatures with consistent type usage
    METHODS get_aggregated_stock
      IMPORTING
        VALUE(iv_tabname)      TYPE string
        VALUE(iv_plant)        TYPE werks_d
        VALUE(iv_mov_type)     TYPE bwart
      EXPORTING
        VALUE(et_stock_data)   TYPE gtt_stock_data
      RAISING
        cx_amdp_execution_error
        cx_amdp_error.
ENDCLASS.
```

**Key Pattern Rules:**
- `gty_*` prefix for structure definitions (e.g., `gty_material_range`, `gty_stock_data`)
- `gtt_*` prefix for table type definitions (e.g., `gtt_material_range`, `gtt_stock_data`)
- `WITH EMPTY KEY` for internal tables (standard for AMDP usage)
- Always declare `RAISING cx_amdp_execution_error cx_amdp_error` for AMDP methods
- Use VALUE( ) for IMPORTING/EXPORTING parameters in method signatures

### 2. Range Table Handling with EXISTS

**Pattern for handling ABAP range tables (I/E, EQ/BT options) in SQLScript:**

```sql
METHOD get_stock_data BY DATABASE PROCEDURE
  FOR HDB
  LANGUAGE SQLSCRIPT
  OPTIONS READ-ONLY
  USING zi_stock_data.
  
  -- Base data with range filtering
  lt_base_data = SELECT 
    LTRIM(material_code, '0') as material_code,  -- Normalize material numbers
    plant,
    movement_type,
    doc_date,
    quantity,
    uom
  FROM zi_stock_data
  WHERE plant = :iv_plant
    AND mandt = SESSION_CONTEXT('CLIENT')  -- Mandatory client filter
    -- Range table handling pattern with EXISTS
    AND (
      NOT EXISTS (SELECT 1 FROM :it_material)  -- Empty range = all allowed
      OR EXISTS (
        SELECT 1 FROM :it_material AS rm
        WHERE rm.sign = 'I'  -- Only include ranges (sign='E' requires separate logic)
          AND (
            -- EQ option: exact match
            (rm.option = 'EQ' AND material_code = rm.low)
            OR 
            -- BT option: between low and high
            (rm.option = 'BT' 
             AND rm.high IS NOT NULL 
             AND material_code BETWEEN rm.low AND rm.high)
          )
      )
    );
ENDMETHOD.
```

**Range Table Pattern Rules:**
- Use `NOT EXISTS (SELECT 1 FROM :it_range)` to allow all when range is empty
- Use `EXISTS` subquery with `rm.sign = 'I'` for include logic
- Support `option = 'EQ'` with exact match: `col = rm.low`
- Support `option = 'BT'` with NULL check: `rm.high IS NOT NULL AND col BETWEEN rm.low AND rm.high`
- For exclude logic (sign='E'), use `NOT EXISTS` with the same match conditions

### 3. Material Number Normalization (LTRIM)

**Always use LTRIM to remove leading zeros from material numbers when comparing with external systems:**

```sql
-- ❌ WRONG: Direct material code without normalization
SELECT material_code, ...

-- ✅ CORRECT: LTRIM removes leading zeros for consistent comparison
SELECT LTRIM(material_code, '0') as material_code, ...

-- Real-world usage in CTEs
lt_103 = SELECT
  LTRIM(material_code, '0') as material_code,  -- Normalize
  plant,
  movement_type,
  SUM(quantity) as quantity
FROM :lt_base_data
WHERE movement_type = '103'
GROUP BY material_code, plant, movement_type;
```

**Why LTRIM is required:**
- Material numbers in SAP are stored with leading zeros (e.g., `0000012345`)
- External systems may not have leading zeros (e.g., `12345`)
- JOIN conditions must match normalized values: `LTRIM(sap_mat, '0') = ext_mat`
- Use throughout the query, not just in final projection

### 4. Multi-CTE Consolidation Pattern with UNION ALL

**Pattern for splitting complex business logic into multiple CTEs, then consolidating with UNION ALL:**

```sql
METHOD get_combined_stock BY DATABASE PROCEDURE
  FOR HDB
  LANGUAGE SQLSCRIPT
  OPTIONS READ-ONLY
  USING zi_stock_data.
  
  -- Base data extraction (single source of truth)
  lt_base_data = SELECT 
    LTRIM(material_code, '0') as material_code,
    plant,
    movement_type,
    doc_date,
    post_date,
    delivery_no,
    quantity,
    uom,
    supplier,
    po_number,
    order_number,
    order_type
  FROM zi_stock_data
  WHERE plant = :iv_plant
    AND mandt = SESSION_CONTEXT('CLIENT')
    AND (NOT EXISTS (SELECT 1 FROM :it_material) OR EXISTS (...range logic...));
  
  -- Separate CTEs for different movement type rules
  
  -- Movement Type 103: No aggregation, keep delivery number
  lt_103 = SELECT
    LTRIM(material_code, '0') as material_code,
    plant,
    movement_type,
    doc_date,
    post_date,
    delivery_no,
    quantity,
    uom,
    '' as supplier,     -- Empty for this movement type
    '' as po_number,
    '' as order_number,
    '' as order_type
  FROM :lt_base_data
  WHERE movement_type = '103';
  
  -- GR Receipt: Aggregate by supplier, filter by business rules
  lt_gr_receipt = SELECT
    LTRIM(material_code, '0') as material_code,
    plant,
    '101 + 102 + 161 + 162' as movement_type,  -- Combined movement type label
    doc_date,
    MIN(post_date) as post_date,           -- Aggregate post date
    '' as delivery_no,
    SUM(quantity) as quantity,              -- Aggregate quantity
    MAX(uom) as uom,                        -- Take any UOM (should be same)
    supplier,
    po_number,
    '' as order_number,
    '' as order_type
  FROM :lt_base_data
  WHERE (supplier <> '' AND movement_type IN ('101', '102', '161', '162'))
  GROUP BY material_code, plant, doc_date, supplier, po_number;
  
  -- Transfer movements: Different grouping logic
  lt_transfer = SELECT
    LTRIM(material_code, '0') as material_code,
    plant,
    movement_type,
    doc_date,
    MIN(post_date) as post_date,
    delivery_no,
    SUM(quantity) as quantity,
    MAX(uom) as uom,
    '' as supplier,
    '' as po_number,
    '' as order_number,
    '' as order_type
  FROM :lt_base_data
  WHERE movement_type IN ('333', '334', '903', '904', '953', '954', '971', '972')
  GROUP BY material_code, plant, movement_type, doc_date, delivery_no;
  
  -- Combined movement type 261 + 906
  lt_261_906 = SELECT
    LTRIM(material_code, '0') as material_code,
    plant,
    '261 + 906' as movement_type,
    doc_date,
    MIN(post_date) as post_date,
    '' as delivery_no,
    SUM(quantity) as quantity,
    MAX(uom) as uom,
    '' as supplier,
    '' as po_number,
    '' as order_number,
    '' as order_type
  FROM :lt_base_data
  WHERE movement_type IN ('261', '906')
  GROUP BY material_code, plant, doc_date;
  
  -- ... more CTEs for other movement types (262+905, 551+931, 552+932, 601+653, 101+907)
  
  -- Final consolidation with UNION ALL (use UNION ALL, not UNION - preserves duplicates)
  et_stock_data = SELECT * FROM :lt_103
                   UNION ALL
                   SELECT * FROM :lt_gr_receipt
                   UNION ALL
                   SELECT * FROM :lt_transfer
                   UNION ALL
                   SELECT * FROM :lt_261_906
                   UNION ALL
                   SELECT * FROM :lt_262_905
                   UNION ALL
                   SELECT * FROM :lt_551_931
                   UNION ALL
                   SELECT * FROM :lt_552_932
                   UNION ALL
                   SELECT * FROM :lt_601_653
                   UNION ALL
                   SELECT * FROM :lt_101_907;
  
  -- Optional: Apply post-consolidation filter
  IF :iv_mov_type <> '' THEN
    et_stock_data = SELECT * FROM :et_stock_data
                     WHERE movement_type = :iv_mov_type;
  END IF;
  
ENDMETHOD.
```

**Multi-CTE Pattern Rules:**
- **Split logic by business rules** (movement types, document types, etc.)
- **Use descriptive CTE names**: `lt_103`, `lt_gr_receipt`, `lt_transfer`, `lt_261_906`
- **Ensure column alignment**: All CTEs in UNION ALL must have same column count, types, and order
- **Use UNION ALL, not UNION**: `UNION` deduplicates (slow), `UNION ALL` preserves all rows
- **Different GROUP BY clauses per CTE**: Each movement type has specific aggregation rules
- **Aggregate functions**: `MIN(post_date)`, `SUM(quantity)`, `MAX(uom)`
- **Empty string literals**: Use `'' as column_name` for inapplicable columns (not NULL)
- **Combined movement type labels**: Use `'261 + 906' as movement_type` for derived types

### 5. Deduplication with ROW_NUMBER()

**Pattern for removing duplicates with ROW_NUMBER() window function:**

```sql
METHOD get_final_data BY DATABASE PROCEDURE
  FOR HDB
  LANGUAGE SQLSCRIPT
  OPTIONS READ-ONLY.
  
  -- Deduplicate stock data: Keep most recent posting date per key
  stock_sub = (
    SELECT material_code, plant, doc_date, movement_type,
           delivery_no, quantity, uom, supplier, po_number, 
           order_number, post_date
    FROM (
      SELECT *,
             ROW_NUMBER() OVER (
               PARTITION BY material_code, plant, doc_date, 
                            movement_type, delivery_no
               ORDER BY post_date DESC  -- Keep latest posting date
             ) AS rn
      FROM :et_stock_data
    )
    WHERE rn = 1  -- Select only the first row per partition
  );
  
  -- Deduplicate Movement Type mapping: Keep first occurrence per key
  mov_type_sub = (
    SELECT movement_code, reason_code, type_of_comp, movement_type_desc, category
    FROM (
      SELECT *,
             ROW_NUMBER() OVER (
               PARTITION BY movement_code, reason_code
               ORDER BY movement_code  -- Deterministic ordering
             ) AS rn
      FROM :ev_mov_type
    )
    WHERE rn = 1
  );
  
  -- Deduplicate external data: Keep most recent document date per key
  ext_sub = (
    SELECT *
    FROM (
      SELECT *,
             ROW_NUMBER() OVER (
               PARTITION BY ext_material_code, plant, ext_doc_date, 
                            ext_movement_code, ext_delivery_no
               ORDER BY ext_doc_date DESC  -- Keep latest document date
             ) AS rn
      FROM :et_external_data
    )
    WHERE rn = 1
  );
  
ENDMETHOD.
```

**Deduplication Pattern Rules:**
- **Use ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...)** for deduplication
- **PARTITION BY**: Define the unique key columns (what makes a record unique)
- **ORDER BY**: Define tiebreaker logic (e.g., `DESC` for most recent, `ASC` for oldest)
- **Filter WHERE rn = 1**: Keep only the first row per partition
- **Wrap in subquery**: ROW_NUMBER() must be in inner SELECT, filter in outer WHERE
- **Deterministic ordering**: Always include ORDER BY to ensure consistent results
- **Use DESC for "latest" logic**: `ORDER BY date_column DESC` keeps most recent

### 6. Conditional Column Logic (CASE WHEN based on category)

**Pattern for conditional column values based on business context (e.g., category/stream type):**

```sql
METHOD build_comparison_data BY DATABASE PROCEDURE
  FOR HDB
  LANGUAGE SQLSCRIPT
  OPTIONS READ-ONLY.
  
  et_comparison = SELECT DISTINCT
    comparison,
    ext_doc_date,
    treatment_date,
    site,
    
    -- Conditional column: Hide plant for certain categories
    CASE WHEN category = 'INTERNAL' THEN '' ELSE plant END AS plant,
    
    -- Conditional column: Only show delivery for specific categories
    CASE WHEN category IN ('PURCHASE', 'SALES') THEN delivery_number ELSE '' END AS delivery_number,
    
    -- Conditional column: Only show reference for specific categories
    CASE WHEN category IN ('PURCHASE', 'SALES') THEN reference_doc ELSE '' END AS reference_doc,
    
    material_code,
    movement_code,
    
    -- Conditional column: Reason code for specific categories only
    CASE WHEN category IN ('PURCHASE', 'INTERNAL', 'ADJUSTMENT') THEN reason_code ELSE '' END AS reason_code,
    
    sign,
    ext_quantity,
    ext_uom,
    
    -- Conditional column: NULL date for internal movements (not empty string)
    CASE WHEN category = 'INTERNAL' THEN NULL ELSE doc_date END AS doc_date,
    
    CASE WHEN category = 'INTERNAL' THEN NULL ELSE post_date END AS post_date,
    
    sap_delivery_number,
    movement_type,
    
    -- Conditional column: Hide category value itself for internal
    CASE WHEN category = 'INTERNAL' THEN '' ELSE category END AS category,
    
    -- Conditional column: NULL quantity for internal (not 0)
    CASE WHEN category = 'INTERNAL' THEN NULL ELSE sap_quantity END AS sap_quantity,
    
    supplier,
    order_number,
    po_number,
    
    CASE WHEN category = 'INTERNAL' THEN NULL ELSE sap_uom END AS sap_uom,
    
    -- Conditional columns for location attributes
    CASE WHEN category = 'INTERNAL' THEN '' ELSE warehouse END AS warehouse,
    CASE WHEN category = 'INTERNAL' THEN '' ELSE product_type END AS product_type,
    CASE WHEN category = 'INTERNAL' THEN '' ELSE location_code END AS location_code,
    
    system_quantity,
    variance
  FROM :it_final;
  
ENDMETHOD.
```

**Conditional Column Pattern Rules:**
- **Use CASE WHEN for business rule-based column values**
- **Empty string vs NULL**:
  - Use `'' ` (empty string) for CHAR/VARCHAR columns when value is inapplicable
  - Use `NULL` for numeric/date columns when value is inapplicable
- **IN clause for multiple conditions**: `category IN ('PURCHASE', 'SALES')` instead of `category = 'PURCHASE' OR category = 'SALES'`
- **ELSE clause**: Always include explicit ELSE (never rely on implicit NULL)
- **Consistent return types**: CASE branches must return same data type
- **Common patterns**:
  - Hide sensitive data: `CASE WHEN condition THEN '' ELSE actual_value END`
  - Conditional aggregation: `CASE WHEN type = 'X' THEN quantity ELSE 0 END`
  - Derived values: `CASE WHEN status = 'A' THEN 'Active' ELSE 'Inactive' END`

### 7. Excluding Already-Matched Records (NOT EXISTS)

**Pattern for SAP-only records (not matched in external system) using NOT EXISTS:**

```sql
-- Second SELECT: SAP-only records (not in external system)
second_select = SELECT DISTINCT
  mt.type_of_comp AS comparison,
  s.doc_date AS ext_doc_date,
  NULL AS treatment_date,
  s.material_code AS ext_material_code,
  s.movement_type AS mov_type,
  s.quantity,
  (0 - s.quantity) AS variance  -- Negative variance for SAP-only
FROM :et_stock_data AS s
LEFT JOIN :mov_type_sub AS mt
  ON mt.movement_type_desc = s.movement_type
WHERE NOT EXISTS (
  SELECT 1 FROM :first_select AS e
  WHERE COALESCE(e.ext_material_code, '') = COALESCE(s.material_code, '')
    AND COALESCE(e.plant, '') = COALESCE(s.plant, '')
    AND COALESCE(e.doc_date, '') = COALESCE(s.doc_date, '')
    AND COALESCE(e.mov_type, '') = COALESCE(s.movement_type, '')
    AND COALESCE(e.order_number, '') = COALESCE(s.order_number, '')
    AND COALESCE(e.quantity, 0) = COALESCE(s.quantity, 0)
    AND COALESCE(e.post_date, '') = COALESCE(s.post_date, '')
    AND COALESCE(e.po_number, '') = COALESCE(s.po_number, '')
    AND COALESCE(e.supplier, '') = COALESCE(s.supplier, '')
    AND (
      -- If category is adjustment, skip delivery number comparison
      e.category = 'ADJUSTMENT'
      OR COALESCE(e.delivery_number, '') = COALESCE(s.delivery_no, '')
    )
);

-- Final result: Union of matched (External+SAP) and unmatched (SAP-only)
rt_final = SELECT * FROM :first_select
           UNION ALL
           SELECT * FROM :second_select;
```

**NOT EXISTS Pattern Rules:**
- **Use NOT EXISTS to find records not in another set**
- **COALESCE for NULL-safe comparison**: `COALESCE(col, '')` or `COALESCE(col, 0)`
- **Comprehensive key matching**: Include all key columns in WHERE clause
- **Avoid multiple LEFT JOIN with IS NULL**: Use NOT EXISTS instead (more readable and often faster)
- **Conditional exclusion**: Combine with OR for business rules (e.g., skip delivery for adjustment category)

### 8. System-Specific Restrictions and Workarounds

**Forbidden patterns and required workarounds in BTP Cloud/On-Premise systems:**

#### ❌ CE_ Functions Not Allowed
```sql
-- ❌ WRONG: CE_* calculation view functions not supported
SELECT * FROM CE_FUNCTION_VIEW(:it_params)

-- ✅ CORRECT: Use CDS views or direct table access
SELECT * FROM zi_stock_data
WHERE mandt = SESSION_CONTEXT('CLIENT')
```

#### ❌ CONVERSION_EXIT Not Available in SQLScript
```sql
-- ❌ WRONG: ABAP conversion exit not available in AMDP
SELECT CONVERSION_EXIT_MATN1_OUTPUT(matnr) as material

-- ✅ CORRECT: Use LTRIM to remove leading zeros
SELECT LTRIM(matnr, '0') as material
```

#### ✅ Mandatory Client-Safe Filtering

**See Step 5 above for comprehensive client handling patterns (CDS SESSION CLIENT current vs direct table access).**

```sql
-- ❌ WRONG: Missing client filter (will fail in production)
SELECT * FROM ztable WHERE plant = :iv_plant

-- ✅ CORRECT: Always add SESSION_CONTEXT('CLIENT') filter for direct table access
SELECT * FROM ztable 
WHERE mandt = SESSION_CONTEXT('CLIENT')
  AND plant = :iv_plant
```

#### ✅ Dynamic Table Name Validation Required
```sql
-- ❌ WRONG: Direct use of dynamic table name (SQL injection risk)
DECLARE lv_sql NVARCHAR(5000);
lv_sql = 'SELECT * FROM ' || :iv_table_name;
EXECUTE IMMEDIATE :lv_sql INTO et_data;

-- ✅ CORRECT: Validate table name against whitelist
DECLARE lv_sql NVARCHAR(5000);
DECLARE lv_valid_table NVARCHAR(30);

-- Validate table name
IF :iv_table_name IN ('ZSTOCK_DATA_2024', 'ZSTOCK_DATA_2025', 'ZSTOCK_DATA_CURRENT') THEN
  lv_valid_table = :iv_table_name;
ELSE
  SIGNAL SQL_ERROR_CODE 10001 SET MESSAGE_TEXT = 'Invalid table name';
END IF;

-- Use validated table name
lv_sql = 'SELECT * FROM ' || :lv_valid_table || 
         ' WHERE mandt = SESSION_CONTEXT(''CLIENT'')';
EXECUTE IMMEDIATE :lv_sql INTO et_data;
```

#### ✅ Exception Handling - Always Declare RAISING Clause
```abap
" ❌ WRONG: No exception declaration
METHODS get_data
  IMPORTING iv_plant TYPE werks_d
  EXPORTING et_data  TYPE gtt_data.

" ✅ CORRECT: Declare standard AMDP exceptions
METHODS get_data
  IMPORTING iv_plant TYPE werks_d
  EXPORTING et_data  TYPE gtt_data
  RAISING
    cx_amdp_execution_error
    cx_amdp_error.
```

#### ✅ Empty String vs NULL Handling
```sql
-- For CHAR/VARCHAR columns in output, use empty string (not NULL) when inapplicable
CASE WHEN condition THEN actual_value ELSE '' END  -- Empty string for strings

-- For numeric/date columns, use NULL when inapplicable
CASE WHEN condition THEN actual_value ELSE NULL END  -- NULL for numbers/dates

-- For comparisons, use COALESCE
WHERE COALESCE(col, '') = ''  -- NULL-safe empty check for strings
WHERE COALESCE(col, 0) = 0    -- NULL-safe zero check for numbers
```

---

### Dynamic SQL in AMDP

**When Required:**
- Dynamic table names (e.g., year-partitioned tables: `ZSTOCK_DATA_2024`, `ZSTOCK_DATA_2025`)
- Dynamic column selection based on runtime parameters
- Conditional JOIN clauses that cannot be expressed statically
- Complex filter predicates that vary structurally (not just by value)

**Implementation Pattern - EXECUTE IMMEDIATE:**

```sql
METHOD aggregate_dynamic_table BY DATABASE PROCEDURE
  FOR HDB
  LANGUAGE SQLSCRIPT
  OPTIONS READ-ONLY.
  
  DECLARE lv_sql NVARCHAR(5000);
  
  -- Build dynamic SQL statement
  lv_sql = 'SELECT col1, col2, SUM(amount) AS total ' ||
           'FROM ' || :iv_table_name || ' ' ||
           'WHERE mandt = SESSION_CONTEXT(''CLIENT'') ' ||
           '  AND plant = ''' || :iv_plant || '''';
  
  -- Conditional WHERE clauses
  IF :iv_filter <> '' THEN
    lv_sql = lv_sql || ' AND status = ''' || :iv_filter || '''';
  END IF;
  
  -- Add GROUP BY and ORDER BY
  lv_sql = lv_sql || ' GROUP BY col1, col2 ' ||
                     'ORDER BY col1';
  
  -- Execute and return results
  EXECUTE IMMEDIATE :lv_sql INTO et_result;
  
END METHOD.
```

**Critical Security Rules:**

1. **SQL Injection Prevention:**
   ```sql
   -- ❌ NEVER concatenate user input directly:
   lv_sql = 'WHERE status = ''' || :iv_user_input || '''';
   
   -- ✅ VALIDATE and WHITELIST input first:
   IF :iv_table_name NOT IN ('ZSTOCK_DATA_2024', 'ZSTOCK_DATA_2025', 'ZSTOCK_DATA_2026') THEN
     SIGNAL SQL_ERROR_CODE 10001 SET MESSAGE_TEXT = 'Invalid table name';
   END IF;
   ```

2. **Client-Safe Mandatory:**
   ```sql
   -- ✅ ALWAYS include client filter:
   lv_sql = lv_sql || ' AND mandt = SESSION_CONTEXT(''CLIENT'')';
   ```

3. **String Escaping:**
   ```sql
   -- ✅ Escape single quotes in string literals:
   lv_sql = lv_sql || ' AND material = ''' || REPLACE(:iv_material, '''', '''''') || '''';
   ```

4. **NULL Handling:**
   ```sql
   -- ✅ Check NULL/empty before concatenation:
   IF :iv_filter IS NOT NULL AND TRIM(:iv_filter) <> '' THEN
     lv_sql = lv_sql || ' AND filter_field = ''' || :iv_filter || '''';
   END IF;
   ```

**Complete Example (Dynamic Table Aggregation):**

```sql
METHOD get_stock_aggregated BY DATABASE PROCEDURE
  FOR HDB
  LANGUAGE SQLSCRIPT
  OPTIONS READ-ONLY.

  DECLARE lv_sql NVARCHAR(5000);

  -- Validate table name (SQL injection prevention)
  IF :iv_tabname NOT LIKE 'ZSTOCK_DATA_%' THEN
    SIGNAL SQL_ERROR_CODE 10001 
      SET MESSAGE_TEXT = 'Invalid table name pattern';
  END IF;

  -- Build core SELECT with aggregation
  lv_sql = 'SELECT site, plant, movement_code, ' ||
           'material_code, reason_code, doc_date, ' ||
           'movement_type, delivery_no, reference_doc, ' ||
           'MAX(treatment_date) AS treatment_date, ' ||
           'COALESCE(SUM(quantity), 0) AS quantity, ' ||
           'MAX(sign) AS sign, ' ||
           'MAX(warehouse) AS warehouse, ' ||
           'MAX(uom) AS uom, ' ||
           'MAX(product_type) AS product_type, ' ||
           'MAX(location_code) AS location_code ' ||
           'FROM ' || :iv_tabname || ' ' ||
           'WHERE plant = ''' || :iv_plant || '''';

  -- Conditional filters
  IF :iv_mov_type IS NOT NULL AND :iv_mov_type <> '' THEN
    lv_sql = lv_sql || ' AND movement_type = ''' || :iv_mov_type || '''';
  END IF;

  IF :iv_prod_filter = 'X' THEN
    lv_sql = lv_sql || ' AND product_type <> ''RAW''';
  END IF;

  -- Dynamic date filter (pre-formatted as SQL clause)
  IF :it_doc_date IS NOT NULL AND TRIM(:it_doc_date) <> '' THEN
    lv_sql = lv_sql || ' AND ' || :it_doc_date;
  END IF;

  -- Client-safe (mandatory)
  lv_sql = lv_sql || ' AND mandt = SESSION_CONTEXT(''CLIENT'')';

  -- GROUP BY clause
  lv_sql = lv_sql || 
    ' GROUP BY site, plant, movement_code, ' ||
    'material_code, reason_code, doc_date, ' ||
    'movement_type, delivery_no, reference_doc';

  -- Deterministic ordering
  lv_sql = lv_sql || ' ORDER BY movement_type, material_code';

  -- Execute dynamic SQL
  EXECUTE IMMEDIATE :lv_sql INTO et_stock_data;

ENDMETHOD.
```

**Best Practices:**

1. **Limit Dynamic Scope:** Only make truly dynamic parts variable (table name), keep rest static
2. **Parameter Validation:** Whitelist allowed values before concatenation
3. **Use DECLARE:** Separate SQL construction from execution for readability
4. **NVARCHAR Sizing:** Use sufficient size (5000+) for complex queries
5. **Testing:** Test with malicious input (`'; DROP TABLE--`, `OR 1=1--`)
6. **Performance:** EXECUTE IMMEDIATE bypasses statement cache - minimize usage
7. **Error Handling:** Add meaningful error messages with SIGNAL
8. **Documentation:** Comment why dynamic SQL is necessary

**Anti-Patterns to Avoid:**

❌ **Concatenating complex filter ranges:**
```sql
-- BAD: Hard to maintain and validate
lv_sql = lv_sql || ' AND material IN (' || :it_materials || ')';
```
✅ **Alternative:** Use intermediate table:
```sql
-- GOOD: Type-safe and readable
lt_materials = SELECT * FROM :it_material_filter;
lv_sql = 'SELECT ... WHERE material IN (SELECT matnr FROM :lt_materials)';
```

❌ **Dynamic column lists:**
```sql
-- BAD: Very risky
lv_sql = 'SELECT ' || :iv_columns || ' FROM ...';
```
✅ **Alternative:** Use CASE or multiple static SELECTs

**When to Avoid Dynamic SQL:**

- If table name is known at design time → Use static USING clause
- If only filter VALUES change (not structure) → Use parameters
- If columns vary → Use CASE statements or union multiple static queries
- If Cloud/BTP target → Minimize dynamic SQL (restricted in some scenarios)

**Performance Consideration:**

Dynamic SQL has overhead:
- Statement not pre-compiled
- No statement cache benefit
- SQL injection check overhead

**Benchmark Recommendation:**
Test if dynamic overhead is acceptable for your use case. If table name is from limited set (e.g., 3 year-tables), consider factory pattern with 3 static AMDP methods instead.

---

## Program Optimization Checklist

When optimizing existing ABAP programs with AMDP, follow this systematic approach:

### Pre-Optimization (Mandatory)

✅ **1. Backup Original Program**
```abap
SE38 → Copy original program to _OLD version
Create transport with backup
Test restoration procedure
```

✅ **2. Establish Baseline Metrics**
- Runtime: ST12 (Single Transaction Analysis)
- Memory: ST22 memory snapshots
- SQL stats: ST05 trace (count SELECT statements)
- Document typical selection criteria and expected volumes

### During Optimization - 7 Key Techniques

#### 1. Replace Loops with Database Operations

❌ **N+1 Query Anti-Pattern:**
```abap
SELECT * FROM bkpf INTO TABLE lt_bkpf WHERE ...
LOOP AT lt_bkpf INTO ls_bkpf.
  SELECT SINGLE * FROM bseg WHERE bukrs = ls_bkpf-bukrs
                              AND belnr = ls_bkpf-belnr.
  " 1000 documents = 1000 SELECTs
ENDLOOP.
```

✅ **Optimized with JOIN:**
```abap
SELECT a~bukrs, a~belnr, a~bldat, b~wrbtr, b~dmbtr
  FROM bkpf AS a
  INNER JOIN bseg AS b ON a~bukrs = b~bukrs AND a~belnr = b~belnr
  WHERE a~bukrs IN @s_bukrs
  INTO TABLE @DATA(lt_combined).
" 1 SELECT replaces 1000+ (500x improvement)
```

#### 2. Create CDS Views for Complex Joins

Use CDS when:
- Same join pattern used multiple times
- Calculated fields needed (currency conversion, date calculations)
- Authorization checks at database level
- Virtual fields (CASE statements)

**Example:**
```abap
@AbapCatalog.sqlViewName: 'ZV_VAT_HEADER'
define view ZI_VAT_HEADER as select from bkpf
  association [0..1] to bset as _Vat on $projection.Bukrs = _Vat.bukrs
{
  key bukrs, key belnr, key gjahr,
  bldat, budat, waers,
  _Vat.mwskz, _Vat.fwbas, _Vat.hwbas,
  // Virtual field
  case _Vat.shkzg
    when 'S' then _Vat.fwbas * -1
    else _Vat.fwbas
  end as FwbasWithSign
}
where bukrs in $parameters.p_bukrs
```

#### 3. Use AMDP for HANA-Specific Operations

**Use AMDP for:**
- Complex aggregations (GROUP BY with multiple levels)
- Window functions (ROW_NUMBER, RANK, LAG/LEAD)
- Recursive queries (BOM explosion, hierarchy)
- Large-scale set operations (UNION, INTERSECT)
- Multi-source data consolidation (13+ CTE patterns)

**Don't use AMDP for:**
- Simple SELECTs (use ABAP SQL)
- Complex business logic with many IF/CASE (keep in ABAP)
- Authorization checks (use ABAP CDS)
- User interactions (messages, F4 help)

#### 4. Eliminate Redundant SELECT Statements

✅ **Use HASHED tables for lookups:**
```abap
" O(1) constant-time lookup instead of O(n)
DATA: lt_kna1 TYPE HASHED TABLE OF kna1 WITH UNIQUE KEY kunnr.
SELECT * FROM kna1 INTO TABLE @lt_kna1.

LOOP AT lt_documents INTO ls_doc.
  READ TABLE lt_kna1 WITH TABLE KEY kunnr = ls_doc-kunnr INTO ls_kna1.
ENDLOOP.
```

✅ **Consolidate similar SELECTs:**
```abap
" Instead of 3 SELECTs, use 1
SELECT SINGLE name1, land1, stceg FROM kna1
  WHERE kunnr = @lv_kunnr
  INTO (@lv_name1, @lv_land1, @lv_stceg).
```

#### 5. Use Modern ABAP Syntax (7.40+)

✅ **Inline declarations and VALUE constructors:**
```abap
" Modern syntax
DATA(lt_result) = VALUE tt_vat_header(
  FOR <bkpf> IN lt_bkpf WHERE ( blart = 'RV' )
  ( bukrs = <bkpf>-bukrs belnr = <bkpf>-belnr )
).

" String templates
DATA(lv_message) = |Processing { lv_count } documents in { lv_runtime } seconds|.
```

#### 6. Optimize Internal Table Operations

**Choose correct table type:**
- **STANDARD**: Sequential processing, preserve order (INSERT O(1), READ O(n))
- **SORTED**: Frequent search with key, maintain order (INSERT O(n), READ O(log n))
- **HASHED**: Frequent key lookups, no order (INSERT O(1), READ O(1))

✅ **Use binary search on SORTED tables:**
```abap
DATA: lt_mara TYPE SORTED TABLE OF mara WITH NON-UNIQUE KEY matnr.
READ TABLE lt_mara WITH TABLE KEY matnr = lv_matnr
  BINARY SEARCH  " O(log n) instead of O(n)
  INTO DATA(ls_mara).
```

#### 7. Add Appropriate Indexes

**When to create secondary index:**
- Table has > 10,000 rows
- Query accesses < 20% of rows
- WHERE clause uses same fields repeatedly
- ST05 shows "table scan" warning

**Index design guidelines:**
1. Always include MANDT first
2. Most selective field second
3. Maximum 5-6 fields
4. Match WHERE clause order
5. Test before/after with ST12

**Example:**
```sql
-- For query: WHERE bukrs IN s_bukrs AND stmdt BETWEEN ... AND mwskz IN s_mwskz
CREATE INDEX zbset~001 ON bset (mandt, bukrs, stmdt, mwskz);
```

### Post-Optimization Validation

✅ **Performance comparison:**
```
ST12 → Measure original vs AMDP
Compare: Runtime, DB time, # SQL statements, memory
Target: 5-10x improvement, 99%+ reduction in SQL calls
```

✅ **Functional validation:**
```bash
# File comparison
diff <(sort VENTES_ORIGINAL.txt) <(sort VENTES_AMDP.txt)

# Amount reconciliation (must match within ±0.01 EUR)
grep '^E' VENTES_ORIGINAL.txt | awk '{sum+=$24} END {print sum}'
grep '^E' VENTES_AMDP.txt | awk '{sum+=$24} END {print sum}'
```

---

## Best Practice Reference Resources

### Official SAP Documentation

1. **AMDP Documentation**
   - https://help.sap.com/doc/abapdocu_latest_index_htm/latest/en-US/index.htm?file=abenamdp.htm
   - Topics: AMDP syntax, SQLScript integration, performance

2. **SQLScript Reference for SAP HANA**
   - https://help.sap.com/docs/HANA_SERVICE_CF/7c78579ce9b14a669c1f3295b0d8ca16/
   - Topics: CTE syntax, window functions, procedural logic

3. **ABAP Performance Guidelines**
   - SAP Note 1912445: ABAP SQL performance recommendations
   - SAP Note 2124135: SAP HANA and ABAP performance analysis FAQ

### Community Resources

4. **SAP Community - ABAP Development**
   - https://community.sap.com/t5/abap-development/ct-p/abap-development
   - Real-world examples, troubleshooting

5. **ABAP Keyword Documentation**
   - https://help.sap.com/doc/abapdocu_latest_index_htm/latest/en-US/
   - Modern ABAP syntax reference

### SAP Press Books

6. **"ABAP to the Future"** by Paul Hardy
   - Modern ABAP syntax, performance patterns

7. **"ABAP Development for SAP S/4HANA"** by Jörg Siebert
   - S/4HANA-specific development (AMDP, CDS, RAP)

8. **"Performance Optimization for SAP HANA"**
   - https://community.sap.com/t5/technology-blog-posts-by-members/sap-hana-parameters-tuning-for-performance-optimization/ba-p/14150263
   - HANA-specific optimization, indexing strategies

### Video Tutorials

9. **SAP HANA Academy - YouTube**
   - https://www.youtube.com/watch?v=fkU-H6iUQXI&list=PLqz8SLrkjv2ipD5e4SoycfP8wJIqZzPi0
   - AMDP tutorials, SQLScript deep dives
---

## Additional Instructions

**Environment Configuration:**
- Corporate proxy: cosmos2.mc2.renault.fr:3128
- SAP system: finance-dev-rft.sap.rise.renault.fr:443
- Default client: 110

**Critical Workflow Reminders:**
- **Type Definition**: Follow Step 3 verification workflow - use `mcp_abap-mcp_GetTable` tool or reference programs (ZCL_PUL_GPI_STOCK_AMDP.abap, ZCL_PULVENTES93_AMDP.abap)
- **Field Name Verification**: Follow Step 4a - NEVER assume CDS field names, always read original program
- **Client Handling**: Follow Step 5 - Use `CDS SESSION CLIENT current` for CDS views, explicit `SESSION_CONTEXT('CLIENT')` for direct tables
- **Elementary Types Only**: CHAR, NUMC, DEC, INT, DATS, etc. - never dictionary types

**Development Best Practices:**
- Prefer AMDP/CDS for large-scale HANA operations over traditional ABAP
- Follow RAP (RESTful ABAP Programming) patterns when applicable
- When optimizing programs, always backup to _OLD version first
- Include rollback toggles (p_amdp checkbox) in optimized programs
- Provide performance benchmarks (before/after metrics)
- Document optimization decisions and trade-offs
