# ABAP MCP Skills

This directory contains GitHub Copilot skills for effective use of the SAP ABAP ADT MCP server tools.

## 📚 Available Skills

### Object Retrieval & Search
- **[get-object-info](get-object-info/SKILL.md)** - Retrieve ABAP object information and source code
- **[search-object](search-object/SKILL.md)** - Search for ABAP objects by name or pattern
- **[where-used-search](where-used-search/SKILL.md)** - Find where ABAP objects are used (dependency analysis)

### Code Quality & Compliance
- **[get-atc-results](get-atc-results/SKILL.md)** - Check code quality and cloud readiness with ATC
- **[get-released-api](get-released-api/SKILL.md)** - Find cloud-ready API alternatives for legacy objects

### Object Creation & Modification
- **[create-ai-object](create-ai-object/SKILL.md)** - Create new ABAP objects with AI-generated code
- **[change-ai-object](change-ai-object/SKILL.md)** - Update existing ABAP objects (restricted to $TMP)
- **[activate-object](activate-object/SKILL.md)** - Activate objects and perform syntax checking

### Documentation & Learning
- **[sap-help-search](sap-help-search/SKILL.md)** - Search official SAP Help Portal documentation
- **[sap-community-search](sap-community-search/SKILL.md)** - Search SAP Community for tutorials and real-world examples

### Data Exploration
- **[data-preview](data-preview/SKILL.md)** - Execute SELECT-only queries against tables and CDS views

## 🚀 Quick Start

These skills are **automatically triggered** when you ask questions that match their descriptions. You don't need to manually activate them - just ask naturally!

### Example Usage

**Search for objects:**
```
Find all classes starting with ZCL_SALES
```
*Automatically triggers: search-object skill*

**View source code:**
```
Show me the code for class ZCL_CUSTOMER_MANAGER
```
*Automatically triggers: get-object-info skill*

**Check code quality:**
```
Run ATC checks on program ZMY_REPORT
```
*Automatically triggers: get-atc-results skill*

**Create new objects:**
```
Create an ABAP class ZP_ORDER_HANDLER that processes sales orders
```
*Automatically triggers: create-ai-object skill*

**Find documentation:**
```
Search SAP Help for RAP business object implementation
```
*Automatically triggers: sap-help-search skill*

## 📖 Skill Organization

Each skill follows this structure:

```
skill-name/
└── SKILL.md          # Skill definition with YAML frontmatter and markdown instructions
```

### SKILL.md Format

```markdown
---
name: skill-name
description: What the skill does and when to use it (triggers automatic loading)
license: MIT
---

# Skill Title

Detailed instructions, parameters, examples, and best practices...
```

## 🔄 Common Workflows

### Development Workflow
1. **Search** → Find relevant objects
2. **Get Info** → Study existing implementations
3. **Create** → Build new object
4. **Activate** → Check syntax
5. **ATC Check** → Validate quality

### Modernization Workflow
1. **ATC Check** → Find non-cloud-ready code
2. **Get Released API** → Find modern alternatives
3. **SAP Help Search** → Research new APIs
4. **Change Object** → Refactor code
5. **ATC Re-check** → Verify compliance

### Learning Workflow
1. **SAP Help Search** → Official documentation
2. **SAP Community Search** → Real-world tutorials
3. **Search Object** → Find system examples
4. **Get Object Info** → Study implementation
5. **Create Object** → Practice building

## 🎯 Skill Categories

### Read-Only Operations (Safe)
- get-object-info
- search-object
- where-used-search
- get-atc-results
- get-released-api
- sap-help-search
- sap-community-search
- data-preview

### Write Operations (Restricted to $TMP for safety)
- create-ai-object (creates in $TMP only)
- change-ai-object (modifies $TMP objects only)
- activate-object (Z* objects only)

## 🔐 Security Features

All skills include built-in safety measures:

- **create-ai-object**: Creates only in $TMP package
- **change-ai-object**: Modifies only $TMP objects
- **activate-object**: Works only with Z*/Y* objects
- **data-preview**: SELECT-only queries, blocks DML/DDL

## 📚 Related Documentation

- [SKILLS-README.md](../../SKILLS-README.md) - Complete guide to GitHub Copilot skills
- [README.md](../../README.md) - MCP server documentation
- [copilot-instructions.md](../copilot-instructions.md) - Repository-specific instructions

## 💡 Tips

1. **Be specific in your questions** - Skills trigger based on description matching
2. **Use natural language** - No need for exact command syntax
3. **Combine skills** - Many workflows use multiple skills in sequence
4. **Check the output** - Skills provide detailed feedback and next-step recommendations
5. **Iterate** - Use skills repeatedly to refine results

## 🤝 Contributing

When adding new MCP tools to the server:
1. Add tool definition in [src/index.ts](../../src/index.ts)
2. Create handler in [src/handlers/](../../src/handlers/)
3. Create corresponding skill in this directory
4. Update this README with the new skill
5. Test that Copilot triggers the skill appropriately

## 📝 Skill Template

Use this template when creating new skills:

```markdown
---
name: your-skill-name
description: Clear description with keywords that match how users will ask. Include use cases, actions, and terminology.
license: MIT
---

# Your Skill Title

Brief overview of what this skill does.

## When to Use This Skill

- Bullet points of specific use cases
- When to apply this skill
- What problems it solves

## Parameters

Document required and optional parameters...

## Usage Examples

Provide real-world example questions...

## Output Expectations

What users should expect...

## Integration with Other Skills

How this skill fits into larger workflows...

## Best Practices

Tips for effective use...
```

## 🌟 Skill Quality Standards

Good skills have:
- ✅ Clear, keyword-rich descriptions for auto-triggering
- ✅ Comprehensive usage examples
- ✅ Integration guidance with other skills
- ✅ Security and safety considerations
- ✅ Common error handling patterns
- ✅ Best practices and tips

---

**Ready to use these skills?** Just start asking questions in GitHub Copilot - the skills will automatically activate when relevant!
