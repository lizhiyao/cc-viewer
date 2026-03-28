# Perché i Tools sono elencati per primi?

Nel pannello Context di cc-viewer, **i Tools appaiono prima di System Prompt e Messages**. Questo ordine riflette con precisione la **sequenza del prefisso KV-Cache dell'API di Anthropic**.

## Sequenza del prefisso KV-Cache

Quando l'API di Anthropic costruisce il KV-Cache, concatena il contesto in un prefisso in questo **ordine fisso**:

```
┌─────────────────────────────────────────────────┐
│ 1. Tools (JSON Schema definitions)               │  ← Start of cache prefix
│ 2. System Prompt                                 │
│ 3. Messages (conversation history + current turn)│  ← End of cache prefix
└─────────────────────────────────────────────────┘
```

Ciò significa che **i Tools si trovano prima del System Prompt, all'inizio del prefisso di cache**.

## Perché i Tools hanno un peso di cache maggiore di System?

Nella corrispondenza del prefisso KV-Cache, **il contenuto precedente è più critico** — qualsiasi modifica invalida tutto ciò che segue:

1. **La corrispondenza del prefisso inizia dall'inizio**: Il KV-Cache confronta la richiesta corrente con il prefisso memorizzato nella cache token per token dall'inizio. Nel momento in cui viene rilevata una discrepanza, tutto il contenuto successivo viene invalidato.

2. **Modifica dei Tools = intera cache invalidata**: Poiché i Tools sono in prima posizione, qualsiasi modifica alle definizioni dei tool (anche aggiungere o rimuovere un singolo MCP tool) **rompe il prefisso dal primissimo inizio**, invalidando tutti i System Prompt e i Messages memorizzati nella cache.

3. **Modifica di System = cache dei Messages invalidata**: Il System Prompt si trova nel mezzo, quindi le sue modifiche invalidano solo la porzione dei Messages che segue.

4. **Modifica dei Messages = solo la coda è interessata**: I Messages sono alla fine, quindi aggiungere nuovi messages invalida solo un piccolo segmento finale — le cache di Tools e System rimangono intatte.

## Impatto pratico

| Tipo di modifica | Impatto sulla cache | Scenario tipico |
|-------------|-------------|-----------------|
| Tool aggiunto/rimosso | **Invalidazione completa** | Connessione/disconnessione server MCP, attivazione/disattivazione plugin IDE |
| Modifica del System Prompt | Cache dei Messages persa | Modifica di CLAUDE.md, iniezione di system reminder |
| Nuovo message aggiunto | Solo incremento della coda | Flusso di conversazione normale (il più comune, il meno costoso) |

Ecco perché `tools_change` in [CacheRebuild](CacheRebuild.md) tende ad essere il motivo di ricostruzione più costoso — rompe la catena del prefisso fin dall'inizio.

## Design del layout di cc-viewer

cc-viewer organizza il pannello Context in modo da corrispondere alla sequenza del prefisso KV-Cache:

- **Ordine dall'alto verso il basso = ordine di concatenazione del prefisso di cache**
- **Le modifiche più in alto hanno un impatto maggiore sul tasso di successo della cache**
- Abbinato al pannello [KV-Cache-Text](KVCacheContent.md), è possibile vedere direttamente il testo completo del prefisso di cache
