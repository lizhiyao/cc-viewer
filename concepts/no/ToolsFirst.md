# Hvorfor vises Tools først?

I cc-viewers kontekstpanel vises **Tools før System Prompt og Messages**. Denne rekkefølgen gjenspeiler nøyaktig **Anthropic API-ens KV-Cache-prefiks-sekvens**.

## KV-Cache-prefiks-sekvens

Når Anthropic's API bygger opp KV-Cache, setter den sammen konteksten til et prefiks i denne **faste rekkefølgen**:

```
┌─────────────────────────────────────────────────┐
│ 1. Tools (JSON Schema definitions)               │  ← Start of cache prefix
│ 2. System Prompt                                 │
│ 3. Messages (conversation history + current turn)│  ← End of cache prefix
└─────────────────────────────────────────────────┘
```

Dette betyr at **Tools befinner seg før System Prompt helt i begynnelsen av cache-prefikset**.

## Hvorfor har Tools høyere cache-vekt enn System?

Ved KV-Cache-prefiksmatchning er **tidlig innhold mer kritisk** — enhver endring ugyldiggjør alt som kommer etter:

1. **Prefiksmatchning starter fra begynnelsen**: KV-Cache sammenligner den gjeldende forespørselen med det bufrede prefikset token for token fra starten. I det øyeblikket et avvik oppdages, ugyldiggjøres alt etterfølgende innhold.

2. **Tools endres = hele cachen ugyldiggjøres**: Siden Tools kommer først, vil enhver endring i verktøydefinisjoner (selv å legge til eller fjerne ett enkelt MCP-tool) **bryte prefikset helt fra starten**, og ugyldiggjøre all bufret System Prompt og Messages.

3. **System endres = Messages-cache ugyldiggjøres**: System Prompt befinner seg i midten, så dens endringer ugyldiggjør bare den etterfølgende Messages-delen.

4. **Messages endres = bare halen påvirkes**: Messages er på slutten, så å legge til nye meldinger ugyldiggjør bare et lite avsluttende segment — cache for Tools og System forblir intakt.

## Praktisk betydning

| Endringstype | Cache-påvirkning | Typisk scenario |
|--------------|-----------------|-----------------|
| Tool lagt til/fjernet | **Full ugyldiggjøring** | MCP server tilkobling/frakobling, IDE-plugin av/på |
| System Prompt-endring | Messages-cache tapt | CLAUDE.md-redigering, system reminder-injeksjon |
| Ny melding lagt til | Bare hale-inkrement | Normal samtaleflyt (vanligst, billigst) |

Dette er grunnen til at `tools_change` i [CacheRebuild](CacheRebuild.md) typisk er den dyreste gjenoppbyggingsårsaken — den bryter prefikskjeden helt fremst.

## cc-viewers layoutdesign

cc-viewer arrangerer kontekstpanelet slik at det matcher KV-Cache-prefiks-sekvensen:

- **Rekkefølge fra topp til bunn = cache-prefiks-sammensettingsrekkefølge**
- **Endringer høyere opp har større innvirkning på cache-hitrate**
- Kombinert med [KV-Cache-Text](KVCacheContent.md)-panelet kan du se den fullstendige cache-prefiks-teksten direkte
