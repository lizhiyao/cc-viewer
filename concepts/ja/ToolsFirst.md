# なぜToolsが最初に表示されるのか？

cc-viewerのContextパネルでは、**ToolsはSystem PromptとMessagesより前に表示されます**。この順序は、**Anthropic APIのKV-Cacheプレフィックスシーケンス**を正確に反映しています。

## KV-Cacheプレフィックスシーケンス

Anthropic のAPIがKV-Cacheを構築する際、コンテキストを以下の**固定された順序**でプレフィックスとして連結します：

```
┌─────────────────────────────────────────────────┐
│ 1. Tools (JSON Schema definitions)               │  ← Start of cache prefix
│ 2. System Prompt                                 │
│ 3. Messages (conversation history + current turn)│  ← End of cache prefix
└─────────────────────────────────────────────────┘
```

つまり、**ToolsはSystem Promptより前、キャッシュプレフィックスの最先頭に位置します**。

## なぜToolsはSystemよりキャッシュの重みが大きいのか？

KV-Cacheのプレフィックスマッチングでは、**前方のコンテンツほど重要**です — 変更が発生すると、それ以降のすべてが無効化されます：

1. **プレフィックスマッチングは先頭から開始される**：KV-Cacheは現在のリクエストをキャッシュされたプレフィックスと先頭からtoken単位で比較します。不一致が見つかった瞬間、それ以降のコンテンツはすべて無効化されます。

2. **Toolsの変更 = キャッシュ全体が無効化**：Toolsは最前列にあるため、tool定義の変更（MCP toolの追加・削除1つでも）は**プレフィックスを最先頭から破壊し**、キャッシュされたSystem PromptとMessagesすべてを無効化します。

3. **Systemの変更 = Messagesキャッシュが無効化**：System Promptは中間に位置するため、その変更は後続のMessages部分のみを無効化します。

4. **Messagesの変更 = 末尾部分のみ影響**：Messagesは末尾にあるため、新しいmessageの追加は小さな末尾セグメントのみを無効化します — ToolsとSystemのキャッシュはそのまま保持されます。

## 実際の影響

| 変更の種類 | キャッシュへの影響 | 典型的なシナリオ |
|-------------|-------------|-----------------|
| Tool追加/削除 | **完全無効化** | MCPサーバーの接続/切断、IDEプラグインの切り替え |
| System Promptの変更 | Messagesキャッシュが失われる | CLAUDE.mdの編集、system reminderの挿入 |
| 新しいmessageの追加 | 末尾の増分のみ | 通常の会話フロー（最も一般的、最もコストが低い） |

これが、[CacheRebuild](CacheRebuild.md)における`tools_change`が最もコストの高いリビルド理由になりやすい理由です — プレフィックスチェーンを最前部から破壊するからです。

## cc-viewerのレイアウト設計

cc-viewerはContextパネルをKV-Cacheプレフィックスシーケンスと一致するように配置しています：

- **上から下の順序 = キャッシュプレフィックスの連結順序**
- **上位の変更ほどキャッシュヒット率への影響が大きい**
- [KV-Cache-Text](KVCacheContent.md)パネルと組み合わせることで、キャッシュプレフィックスの全テキストを直接確認できます
