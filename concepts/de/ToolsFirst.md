# Warum werden Tools zuerst aufgelistet?

Im Context-Panel von cc-viewer **erscheinen Tools vor System Prompt und Messages**. Diese Reihenfolge spiegelt exakt die **KV-Cache-Präfix-Sequenz der Anthropic API** wider.

## KV-Cache-Präfix-Sequenz

Wenn die Anthropic API den KV-Cache aufbaut, verkettet sie den Kontext in dieser **festen Reihenfolge** zu einem Präfix:

```
┌─────────────────────────────────────────────────┐
│ 1. Tools (JSON Schema definitions)               │  ← Start of cache prefix
│ 2. System Prompt                                 │
│ 3. Messages (conversation history + current turn)│  ← End of cache prefix
└─────────────────────────────────────────────────┘
```

Das bedeutet: **Tools befinden sich vor dem System Prompt, ganz am Anfang des Cache-Präfixes**.

## Warum haben Tools ein höheres Cache-Gewicht als System?

Beim KV-Cache-Präfix-Matching ist **früher Inhalt entscheidender** — jede Änderung macht alles Folgende ungültig:

1. **Präfix-Matching beginnt am Anfang**: Der KV-Cache vergleicht die aktuelle Anfrage token-für-token vom Anfang mit dem gecachten Präfix. Sobald eine Abweichung gefunden wird, wird der gesamte nachfolgende Inhalt invalidiert.

2. **Änderung der Tools = gesamter Cache invalidiert**: Da Tools an erster Stelle stehen, **bricht jede Änderung an Tool-Definitionen (auch das Hinzufügen oder Entfernen eines einzelnen MCP-Tools) das Präfix vom ersten Moment an**, wodurch alle gecachten System Prompt- und Messages-Inhalte invalidiert werden.

3. **Änderung von System = Messages-Cache invalidiert**: Der System Prompt befindet sich in der Mitte, sodass seine Änderungen nur den nachfolgenden Messages-Teil invalidieren.

4. **Änderung von Messages = nur das Ende betroffen**: Messages stehen am Ende, sodass das Anhängen neuer Messages nur ein kleines abschließendes Segment invalidiert — Tools- und System-Cache bleiben intakt.

## Praktische Auswirkungen

| Änderungstyp | Cache-Auswirkung | Typisches Szenario |
|-------------|-------------|-----------------|
| Tool hinzugefügt/entfernt | **Vollständige Invalidierung** | MCP-Server verbinden/trennen, IDE-Plugin ein-/ausschalten |
| System Prompt-Änderung | Messages-Cache verloren | CLAUDE.md bearbeiten, system reminder einfügen |
| Neue Message angehängt | Nur Tail-Inkrement | Normaler Gesprächsfluss (am häufigsten, am günstigsten) |

Deshalb ist `tools_change` in [CacheRebuild](CacheRebuild.md) oft der teuerste Rebuild-Grund — es bricht die Präfix-Kette ganz am Anfang.

## Layout-Design von cc-viewer

cc-viewer ordnet das Context-Panel so an, dass es der KV-Cache-Präfix-Sequenz entspricht:

- **Reihenfolge von oben nach unten = Reihenfolge der Cache-Präfix-Verkettung**
- **Änderungen weiter oben haben größeren Einfluss auf die Cache-Trefferquote**
- In Kombination mit dem [KV-Cache-Text](KVCacheContent.md)-Panel können Sie den vollständigen Cache-Präfix-Text direkt einsehen
