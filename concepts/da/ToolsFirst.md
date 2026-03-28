# Hvorfor vises Tools først?

I cc-viewers kontekstpanel vises **Tools før System Prompt og Messages**. Denne rækkefølge afspejler præcist **Anthropic API's KV-Cache-præfikssekvens**.

## KV-Cache-præfikssekvens

Når Anthropic's API opbygger KV-Cache, sammensætter den konteksten til et præfiks i denne **faste rækkefølge**:

```
┌─────────────────────────────────────────────────┐
│ 1. Tools (JSON Schema definitions)               │  ← Start of cache prefix
│ 2. System Prompt                                 │
│ 3. Messages (conversation history + current turn)│  ← End of cache prefix
└─────────────────────────────────────────────────┘
```

Det betyder, at **Tools befinder sig før System Prompt helt i begyndelsen af cache-præfikset**.

## Hvorfor har Tools større cache-vægt end System?

Ved KV-Cache-præfiksmatchning er **tidligt indhold mere kritisk** — enhver ændring ugyldiggør alt efterfølgende indhold:

1. **Præfiksmatchning starter fra begyndelsen**: KV-Cache sammenligner den aktuelle anmodning med det cachede præfiks token for token fra starten. I det øjeblik en uoverensstemmelse opdages, ugyldiggøres alt efterfølgende indhold.

2. **Tools ændres = hele cache ugyldiggøres**: Da Tools kommer først, vil enhver ændring i værktøjsdefinitioner (selv tilføjelse eller fjernelse af et enkelt MCP-tool) **bryde præfikset helt fra starten** og ugyldiggøre al cachet System Prompt og Messages.

3. **System ændres = Messages-cache ugyldiggøres**: System Prompt befinder sig i midten, så dens ændringer ugyldiggør kun den efterfølgende Messages-del.

4. **Messages ændres = kun halen påvirkes**: Messages er i slutningen, så tilføjelse af nye beskeder ugyldiggør kun et lille afsluttende segment — Tools- og System-cache forbliver intakt.

## Praktisk betydning

| Ændringstype | Cache-påvirkning | Typisk scenarie |
|--------------|-----------------|-----------------|
| Tool tilføjet/fjernet | **Fuld ugyldiggørelse** | MCP server tilslut/frakobl, IDE-plugin til/fra |
| System Prompt ændring | Messages-cache tabt | CLAUDE.md redigering, system reminder-injektion |
| Ny besked tilføjet | Kun hale-tilvækst | Normal samtalegång (mest almindelig, billigst) |

Det er derfor `tools_change` i [CacheRebuild](CacheRebuild.md) typisk er den dyreste genopbygningsårsag — det bryder præfikskæden helt forrest.

## cc-viewers layoutdesign

cc-viewer arrangerer kontekstpanelet så det matcher KV-Cache-præfikssekvensen:

- **Rækkefølge fra top til bund = cache-præfiksets sammensætningsrækkefølge**
- **Ændringer højere oppe har større indflydelse på cache-hitrate**
- Kombineret med panelet [KV-Cache-Text](KVCacheContent.md) kan du se den fulde cache-præfikstekst direkte
