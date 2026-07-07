---
name: sap-community-search
description: Search SAP Community (community.sap.com) for blog posts, discussions, tutorials, and practical solutions. Use when looking for real-world examples, tutorials, tips, workarounds, or community insights. Automatically retrieves full content of top posts. Keywords: SAP blogs, community, tutorials, tips, real-world examples, how-to, SAP community search
license: MIT
---

# SAP Community Search

Search SAP Community (community.sap.com) for blog posts, discussions, and practical solutions using the MCP `sap_community_search` tool.

## When to Use This Skill

Use this skill when you need to:
- Find practical tutorials and how-tos
- Learn from real-world examples
- Discover tips and tricks
- Find workarounds for common problems
- Read community insights and experiences
- Understand practical implementation patterns
- Get step-by-step guides from practitioners

## What is SAP Community?

SAP Community (community.sap.com) is the user-driven knowledge platform featuring:
- **Blog posts**: Detailed tutorials and experiences
- **Q&A**: Questions and expert answers
- **Code samples**: Real-world implementations
- **Tips & tricks**: Practical insights
- **Case studies**: Implementation stories
- **Workarounds**: Solutions for edge cases

## Required Parameters

- `query`: Search query string (topic, technology, problem)

## Optional Parameters

- `limit`: Max search results to return (1-50, default: 20)
- `top_posts`: Number of top posts to retrieve full content (1-10, default: 3)

## Output Format

Returns search results WITH full content of top posts:
```json
{
  "results": [
    {
      "title": "Step-by-Step: Creating RAP Business Objects",
      "url": "https://community.sap.com/...",
      "author": "John Developer",
      "published": "2024-01-15",
      "kudos": 42,
      "tags": ["RAP", "CDS", "ABAP"],
      "snippet": "In this tutorial, I'll show you...",
      "full_content": "Complete blog post content..." // For top N posts
    }
  ],
  "total": 18,
  "top_posts_with_content": 3
}
```

## Automatic Content Retrieval

**Key feature:** This tool automatically retrieves full content of the top N posts (default: 3)

**Benefits:**
- Immediate access to complete tutorials
- No need for follow-up requests
- Full code examples included
- Step-by-step instructions ready

**Customization:**
```
Search SAP Community for "RAP validation" 
  limit: 10 (search results)
  top_posts: 5 (full content for top 5)
```

## Usage Examples

**Find tutorial:**
```
Search SAP Community for "CDS view with parameters tutorial"
```

**Get practical tips:**
```
Find SAP Community blogs about ABAP performance optimization
```

**Learn from examples:**
```
Search for RAP managed scenario implementation examples in SAP Community
```

**Find workarounds:**
```
Look for SAP Community posts about handling currency conversion in CDS
```

**Discover patterns:**
```
Find blogs about implementing validations in RAP behavior definitions
```

## Content Metadata

Each result includes:

| Field | Description | Use |
|-------|-------------|-----|
| **Title** | Post title | Quick relevance check |
| **Author** | Community member | Credibility indicator |
| **Published** | Date posted | Freshness of content |
| **Kudos** | Community likes | Quality signal |
| **Tags** | Topic tags | Content categorization |
| **Snippet** | Preview text | Quick overview |
| **Full content** | Complete post | Detailed learning (top N only) |

## Result Interpretation

### High-Value Posts
**Indicators:**
- High kudos count (20+)
- Recent publication (last 6 months)
- Detailed tutorial format
- Code examples included
- Step-by-step instructions

**Action:** Read full content immediately

### Multiple Relevant Results
**When you see:**
- Several posts on same topic
- Different approaches
- Various skill levels

**Action:**
- Compare approaches in top posts
- Choose based on your scenario
- Combine insights from multiple sources

### Dated Content
**When publication is old:**
- Check if still relevant for current version
- Look for newer alternatives
- Verify approach is still recommended
- Consider modern replacements

## Search Query Tips

### Effective Query Patterns

| Query Type | Example | Results |
|------------|---------|---------|
| Tutorial | "RAP implementation step by step" | How-to guides |
| Problem/Solution | "CDS view performance slow" | Troubleshooting |
| Comparison | "RAP vs BOPF differences" | Analysis posts |
| Feature | "RAP draft handling" | Feature guides |
| Pattern | "singleton pattern ABAP" | Implementation patterns |

### Query Refinement

**Be specific:**
- ✅ "RAP early numbering implementation"
- ❌ "RAP"

**Include context:**
- "CDS view associations S/4HANA"
- "ABAP Unit testing RAP"

**Use action words:**
- "How to implement RAP validation"
- "Steps to create CDS view"

## Common Search Scenarios

### 1. Learning New Feature
```
Query: "RAP action implementation example"
Limit: 20
Top posts: 5
Use: Get comprehensive tutorial coverage
```

### 2. Troubleshooting
```
Query: "RAP validation error handling"
Limit: 15
Top posts: 3
Use: Find solutions to specific problems
```

### 3. Best Practices
```
Query: "ABAP CDS naming conventions"
Limit: 10
Top posts: 2
Use: Learn recommended approaches
```

### 4. Code Examples
```
Query: "EML MODIFY example RAP"
Limit: 20
Top posts: 5
Use: Study real implementation code
```

### 5. Comparison Research
```
Query: "Choose between managed and unmanaged RAP"
Limit: 10
Top posts: 3
Use: Understand trade-offs
```

## Workflow Integration

### Learning Workflow
1. `sap_help_search` → Official documentation
2. `sap_community_search` → Practical tutorials (auto-loads top posts)
3. Study full content of top posts
4. `search_object` → Find system examples
5. `create_ai_object` → Implement learning

### Problem-Solving Workflow
1. Encounter error/challenge
2. `sap_community_search` → Find solutions (top posts loaded)
3. Read through solutions in full content
4. `get_object_info` → View current code
5. `change_ai_object` → Apply solution

### Research Workflow
1. `sap_community_search` → Community insights (top posts)
2. `sap_help_search` → Official specs
3. Compare community practice vs official docs
4. Choose appropriate approach
5. Implement with confidence

## Output Expectations

When Copilot uses this skill, expect:
- List of relevant blog posts and discussions
- Full content of top 3 posts (or custom number)
- Author and publication metadata
- Kudos count (popularity indicator)
- Code examples extracted from posts
- Summary of key insights
- Recommendations: "Post #1 provides complete tutorial"

## Tips for Effective Searching

1. **Specific queries work best**: Include technology names and specific features
2. **Increase top_posts for learning**: Get 5-10 full tutorials on new topics
3. **Check publication dates**: Prefer recent posts for current versions
4. **Trust kudos count**: High kudos usually means quality content
5. **Look for code examples**: Posts with code are most practical
6. **Combine results**: Cross-reference multiple approaches

## Integration with Other Skills

**Complete learning path:**
1. `sap_help_search` → Theory and official API
2. `sap_community_search` → Practice and real examples (full content auto-loaded)
3. `search_object` → Find in your system
4. `get_object_info` → Study existing implementation
5. `create_ai_object` → Build your version

**Development workflow:**
1. `sap_community_search` → Find implementation pattern (get full tutorial)
2. Study code examples in full content
3. `get_released_api` → Verify APIs are cloud-ready
4. `create_ai_object` → Implement with pattern
5. `get_atc_results` → Validate quality

**Troubleshooting workflow:**
1. Encounter issue
2. `sap_community_search` → Find similar issues (full solutions loaded)
3. Review solutions in full content
4. `change_ai_object` → Apply fix
5. `get_atc_results` → Verify fix

## SAP Community vs SAP Help

| Aspect | SAP Community | SAP Help |
|--------|---------------|----------|
| **Source** | User-contributed | Official SAP |
| **Style** | Tutorial, conversational | Reference, formal |
| **Content** | Real-world examples | Feature specifications |
| **Depth** | Practical how-to | Comprehensive API |
| **Code** | Full examples | Syntax reference |
| **Best for** | Learning by doing | Official documentation |

**When to use SAP Community:**
- ✅ Need practical tutorial
- ✅ Want real-world examples
- ✅ Looking for tips & tricks
- ✅ Comparing approaches
- ✅ Finding workarounds

**When to use SAP Help:**
- ✅ Need official API reference
- ✅ Want complete feature specs
- ✅ Checking supported approaches
- ✅ Need authoritative answer

## Content Quality Indicators

### High-Quality Post
- **Kudos**: 20+
- **Length**: Detailed, comprehensive
- **Code**: Multiple examples
- **Structure**: Clear steps
- **Recent**: Published within last year
- **Tags**: Well-categorized

### Medium-Quality Post
- **Kudos**: 5-20
- **Length**: Moderate detail
- **Code**: Some examples
- **Recent**: 1-2 years old

### Lower-Quality Post
- **Kudos**: 0-5
- **Length**: Brief
- **Code**: No examples
- **Old**: 3+ years

**Strategy:** Focus on high-quality posts, especially when auto-loading full content

## Advanced Usage Patterns

### Deep Dive Learning
```
Query: "RAP managed scenario complete tutorial"
Limit: 30
Top posts: 10
Result: Comprehensive learning material with full content
```

### Quick Reference
```
Query: "RAP action implementation"
Limit: 5
Top posts: 2
Result: Quick examples for immediate use
```

### Comparative Analysis
```
Query: "RAP managed vs unmanaged comparison"
Limit: 15
Top posts: 5
Result: Multiple perspectives for informed decision
```

### Troubleshooting Focus
```
Query: "RAP validation fails with draft"
Limit: 10
Top posts: 3
Result: Targeted solutions for specific problem
```

## Best Practices

1. **Start with community for learning**: Tutorials are more approachable than specs
2. **Verify with official docs**: Cross-check community solutions
3. **Check dates**: Ensure content matches your SAP version
4. **Read multiple posts**: Compare approaches before implementing
5. **Note the author**: Some community members are recognized experts
6. **Adjust top_posts parameter**: More full content for complex topics
7. **Watch for code examples**: Most valuable for implementation
8. **Follow up with system search**: Find similar in your system

## Automatic Content Loading

**Default behavior:**
- Searches and returns up to 20 results
- Automatically retrieves full content of top 3 posts
- Full content includes complete blog text and code examples

**Customization:**
```
For quick lookup:
  limit: 5, top_posts: 1
For deep research:
  limit: 50, top_posts: 10
For balanced search:
  limit: 20, top_posts: 3 (default)
```

**Benefits of auto-loading:**
- No follow-up request needed
- Immediate access to tutorials
- Code examples ready to study
- Complete step-by-step guides available
- Faster learning workflow
