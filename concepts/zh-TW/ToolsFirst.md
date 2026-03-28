# 為什麼 Tools 排在最前面？

在 cc-viewer 的 Context 面板中，**Tools 顯示在 System Prompt 和 Messages 之前**。這個排列順序精確地反映了 **Anthropic API 的 KV-Cache 前綴序列**。

## KV-Cache 前綴序列

當 Anthropic 的 API 建構 KV-Cache 時，會以這個**固定順序**將上下文串接為前綴：

```
┌─────────────────────────────────────────────────┐
│ 1. Tools (JSON Schema definitions)               │  ← Start of cache prefix
│ 2. System Prompt                                 │
│ 3. Messages (conversation history + current turn)│  ← End of cache prefix
└─────────────────────────────────────────────────┘
```

這意味著 **Tools 位於 cache 前綴的最開頭，排在 System Prompt 之前**。

## 為什麼 Tools 的 Cache 權重高於 System？

在 KV-Cache 前綴比對中，**越靠前的內容越關鍵** — 任何變動都會使其後的所有內容失效：

1. **前綴比對從頭開始**：KV-Cache 從起始位置逐 token 將當前請求與快取前綴進行比對。一旦發現不匹配，後續所有內容都會立即失效。

2. **Tools 變動 = 整個 cache 失效**：由於 Tools 排在最前面，任何工具定義的變更（即使只是新增或移除一個 MCP tool）都會**從最開頭破壞前綴**，使所有已快取的 System Prompt 和 Messages 失效。

3. **System 變動 = Messages cache 失效**：System Prompt 位於中間，因此其變更只會使後續的 Messages 部分失效。

4. **Messages 變動 = 只影響尾部**：Messages 排在最後，因此新增訊息只會使末尾的一小段失效 — Tools 和 System 的 cache 仍保持完整。

## 實際影響

| 變動類型 | Cache 影響 | 典型情境 |
|----------|-----------|---------|
| Tool 新增/移除 | **完全失效** | MCP server 連線/斷線、IDE 插件切換 |
| System Prompt 變更 | Messages cache 遺失 | CLAUDE.md 編輯、system reminder 注入 |
| 新增訊息 | 僅尾部遞增 | 正常對話流程（最常見、成本最低） |

這就是為什麼 [CacheRebuild](CacheRebuild.md) 中的 `tools_change` 往往是成本最高的重建原因 — 它從最前端破壞了前綴鏈。

## cc-viewer 的版面設計

cc-viewer 將 Context 面板的排列方式與 KV-Cache 前綴序列相對應：

- **由上到下的順序 = cache 前綴串接順序**
- **越靠上的變動對 cache 命中率的影響越大**
- 搭配 [KV-Cache-Text](KVCacheContent.md) 面板，您可以直接查看完整的 cache 前綴文字
