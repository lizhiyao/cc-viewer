# Por que os Tools são listados primeiro?

No painel Context do cc-viewer, **os Tools aparecem antes do System Prompt e dos Messages**. Essa ordenação reflete precisamente a **sequência de prefixo KV-Cache da API da Anthropic**.

## Sequência de prefixo KV-Cache

Quando a API da Anthropic constrói o KV-Cache, ela concatena o contexto em um prefixo nesta **ordem fixa**:

```
┌─────────────────────────────────────────────────┐
│ 1. Tools (JSON Schema definitions)               │  ← Start of cache prefix
│ 2. System Prompt                                 │
│ 3. Messages (conversation history + current turn)│  ← End of cache prefix
└─────────────────────────────────────────────────┘
```

Isso significa que **os Tools ficam antes do System Prompt, bem no início do prefixo de cache**.

## Por que os Tools têm maior peso de cache do que System?

Na correspondência de prefixo KV-Cache, **o conteúdo anterior é mais crítico** — qualquer alteração invalida tudo o que vem depois:

1. **A correspondência de prefixo começa pelo início**: O KV-Cache compara a requisição atual com o prefixo em cache token por token desde o início. No momento em que uma divergência é encontrada, todo o conteúdo subsequente é invalidado.

2. **Alteração nos Tools = cache inteiro invalidado**: Como os Tools vêm primeiro, qualquer alteração nas definições de tool (mesmo adicionar ou remover um único MCP tool) **quebra o prefixo desde o início absoluto**, invalidando todos os System Prompt e Messages em cache.

3. **Alteração no System = cache de Messages invalidado**: O System Prompt fica no meio, então suas alterações invalidam apenas a porção de Messages que o segue.

4. **Alteração nos Messages = apenas o final é afetado**: Os Messages ficam no final, então adicionar novos messages invalida apenas um pequeno segmento final — os caches de Tools e System permanecem intactos.

## Impacto prático

| Tipo de alteração | Impacto no cache | Cenário típico |
|-------------|-------------|-----------------|
| Tool adicionado/removido | **Invalidação completa** | Conexão/desconexão de servidor MCP, ativação/desativação de plugin de IDE |
| Alteração no System Prompt | Cache de Messages perdido | Edição de CLAUDE.md, injeção de system reminder |
| Novo message adicionado | Apenas incremento de cauda | Fluxo de conversa normal (o mais comum, o mais barato) |

É por isso que `tools_change` no [CacheRebuild](CacheRebuild.md) tende a ser o motivo de reconstrução mais custoso — ele quebra a cadeia de prefixo bem na frente.

## Design de layout do cc-viewer

O cc-viewer organiza o painel Context para corresponder à sequência de prefixo KV-Cache:

- **Ordem de cima para baixo = ordem de concatenação do prefixo de cache**
- **Alterações mais acima têm maior impacto na taxa de acerto do cache**
- Combinado com o painel [KV-Cache-Text](KVCacheContent.md), você pode ver diretamente o texto completo do prefixo de cache
