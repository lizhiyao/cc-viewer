# Dlaczego Tools są wyświetlane jako pierwsze?

W panelu kontekstu cc-viewer **Tools pojawiają się przed System Prompt i Messages**. Ta kolejność dokładnie odzwierciedla **sekwencję prefiksu KV-Cache w Anthropic API**.

## Sekwencja prefiksu KV-Cache

Gdy Anthropic API buduje KV-Cache, łączy kontekst w prefiks w tej **stałej kolejności**:

```
┌─────────────────────────────────────────────────┐
│ 1. Tools (JSON Schema definitions)               │  ← Start of cache prefix
│ 2. System Prompt                                 │
│ 3. Messages (conversation history + current turn)│  ← End of cache prefix
└─────────────────────────────────────────────────┘
```

Oznacza to, że **Tools znajdują się przed System Prompt na samym początku prefiksu cache**.

## Dlaczego Tools mają większy wpływ na cache niż System?

W dopasowywaniu prefiksu KV-Cache **wcześniejsza treść jest bardziej krytyczna** — każda zmiana unieważnia wszystko, co po niej następuje:

1. **Dopasowywanie prefiksu zaczyna się od początku**: KV-Cache porównuje bieżące żądanie z zbuforowanym prefiksem token po tokenie od początku. W momencie znalezienia niezgodności cała późniejsza treść zostaje unieważniona.

2. **Zmiana Tools = cały cache unieważniony**: Ponieważ Tools są na pierwszym miejscu, każda zmiana w definicjach narzędzi (nawet dodanie lub usunięcie jednego MCP tool) **przerywa prefiks od samego początku**, unieważniając cały zbuforowany System Prompt i Messages.

3. **Zmiana System = cache Messages unieważniony**: System Prompt znajduje się w środku, więc jego zmiany unieważniają tylko następującą po nim część Messages.

4. **Zmiana Messages = dotyczy tylko końca**: Messages są na końcu, więc dołączanie nowych wiadomości unieważnia jedynie niewielki końcowy segment — cache Tools i System pozostaje nienaruszony.

## Praktyczny wpływ

| Typ zmiany | Wpływ na cache | Typowy scenariusz |
|------------|---------------|-------------------|
| Tool dodane/usunięte | **Pełne unieważnienie** | Połączenie/rozłączenie serwera MCP, włączenie/wyłączenie wtyczki IDE |
| Zmiana System Prompt | Utrata cache Messages | Edycja CLAUDE.md, wstrzyknięcie system reminder |
| Nowa wiadomość dodana | Tylko przyrost końcowy | Normalny przepływ rozmowy (najczęstszy, najtańszy) |

Dlatego `tools_change` w [CacheRebuild](CacheRebuild.md) jest zazwyczaj najdroższym powodem przebudowy — przerywa łańcuch prefiksu na samym początku.

## Projekt układu cc-viewer

cc-viewer rozmieszcza panel kontekstu tak, aby odpowiadał sekwencji prefiksu KV-Cache:

- **Kolejność od góry do dołu = kolejność łączenia prefiksu cache**
- **Zmiany wyżej mają większy wpływ na współczynnik trafień cache**
- W połączeniu z panelem [KV-Cache-Text](KVCacheContent.md) możesz bezpośrednio zobaczyć pełny tekst prefiksu cache
