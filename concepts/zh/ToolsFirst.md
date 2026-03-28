# 为什么工具排在第一位？

在 cc-viewer 的 Context 面板中，**工具（Tools）被放在 System Prompt 和 Messages 之前**。这不是随意排列，而是为了**精确反映 Anthropic API 的实际 KV-Cache 前缀顺序**。

## KV-Cache 前缀序列

Anthropic API 在构建 KV-Cache 时，按以下**固定顺序**将上下文拼接为前缀序列：

```
┌─────────────────────────────────────────────────┐
│ 1. Tools (JSON Schema 定义)                      │  ← 缓存前缀的最前端
│ 2. System Prompt                                 │
│ 3. Messages (历史对话 + 当前 turn)               │  ← 缓存前缀的最后端
└─────────────────────────────────────────────────┘
```

这意味着 **Tools 比 System Prompt 更靠近缓存前缀的起始位置**。

## 为什么 Tools 的缓存权重比 System 还高？

在 KV-Cache 的前缀匹配机制中，**越靠前的内容越稳定**，对缓存命中的影响越大：

1. **前缀匹配是从头开始的**：KV-Cache 通过比较当前请求与上一次缓存的前缀序列来决定能复用多少。从第一个 token 开始逐一比较，一旦遇到不匹配就中断，后续全部失效。

2. **Tools 变化 = 全部缓存失效**：因为 Tools 在最前面，如果工具定义发生任何变化（哪怕只是增减一个 MCP tool），**整个缓存前缀从头开始就不匹配**，所有后续的 System Prompt 和 Messages 缓存全部作废。

3. **System 变化 = Messages 缓存失效**：System Prompt 在中间，它的变化只会导致后面的 Messages 缓存失效，但 Tools 部分的缓存仍然有效。

4. **Messages 变化 = 只影响末尾**：Messages 在最后，新消息的追加只会让最后一小段缓存失效，前面的 Tools 和 System 缓存不受影响。

## 实际影响

| 变化类型 | 缓存影响 | 典型场景 |
|----------|---------|---------|
| 工具增减 | **全部失效** | MCP server 连接/断开、IDE 插件启停 |
| System Prompt 变化 | Messages 缓存失效 | CLAUDE.md 修改、system reminder 注入 |
| 新增消息 | 仅末尾增量 | 正常对话流（最常见，也最省钱） |

这也是为什么 [CacheRebuild](CacheRebuild.md) 中 `tools_change` 导致的缓存重建成本往往最高 —— 它从最前面就打断了缓存前缀链。

## cc-viewer 的排列设计

cc-viewer 将 Context 面板的排列顺序设计为与 KV-Cache 前缀序列一致：

- **从上到下的顺序 = 缓存前缀的拼接顺序**
- **越靠上的部分变化，对缓存命中率的打击越大**
- 配合 [KV-Cache-Text](KVCacheContent.md) 面板，可以直接看到缓存前缀的完整文本
