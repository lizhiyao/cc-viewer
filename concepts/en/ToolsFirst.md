# Why Are Tools Listed First?

In cc-viewer's Context panel, **Tools appear before System Prompt and Messages**. This ordering precisely mirrors the **Anthropic API's KV-Cache prefix sequence**.

## KV-Cache Prefix Sequence

When Anthropic's API constructs the KV-Cache, it concatenates context into a prefix in this **fixed order**:

```
┌─────────────────────────────────────────────────┐
│ 1. Tools (JSON Schema definitions)               │  ← Start of cache prefix
│ 2. System Prompt                                 │
│ 3. Messages (conversation history + current turn)│  ← End of cache prefix
└─────────────────────────────────────────────────┘
```

This means **Tools sit before System Prompt at the very beginning of the cache prefix**.

## Why Do Tools Have Higher Cache Weight Than System?

In KV-Cache prefix matching, **earlier content is more critical** — any change invalidates everything after it:

1. **Prefix matching starts from the beginning**: The KV-Cache compares the current request against the cached prefix token-by-token from the start. The moment a mismatch is found, all subsequent content is invalidated.

2. **Tools change = entire cache invalidated**: Since Tools come first, any change to tool definitions (even adding or removing a single MCP tool) **breaks the prefix from the very start**, invalidating all cached System Prompt and Messages.

3. **System change = Messages cache invalidated**: System Prompt sits in the middle, so its changes only invalidate the Messages portion that follows.

4. **Messages change = only the tail affected**: Messages are at the end, so appending new messages only invalidates a small trailing segment — Tools and System cache remain intact.

## Practical Impact

| Change Type | Cache Impact | Typical Scenario |
|-------------|-------------|-----------------|
| Tool added/removed | **Full invalidation** | MCP server connect/disconnect, IDE plugin toggle |
| System Prompt change | Messages cache lost | CLAUDE.md edit, system reminder injection |
| New message appended | Tail increment only | Normal conversation flow (most common, cheapest) |

This is why `tools_change` in [CacheRebuild](CacheRebuild.md) tends to be the most expensive rebuild reason — it breaks the prefix chain at the very front.

## cc-viewer's Layout Design

cc-viewer arranges the Context panel to match the KV-Cache prefix sequence:

- **Top-to-bottom order = cache prefix concatenation order**
- **Changes higher up have greater impact on cache hit rate**
- Paired with the [KV-Cache-Text](KVCacheContent.md) panel, you can see the full cache prefix text directly
