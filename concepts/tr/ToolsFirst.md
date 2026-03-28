# Tools Neden İlk Sırada Gösterilir?

cc-viewer'ın Bağlam panelinde **Tools, System Prompt ve Messages'tan önce görünür**. Bu sıralama, **Anthropic API'nin KV-Cache önek sırasını** tam olarak yansıtır.

## KV-Cache Önek Sırası

Anthropic'in API'si KV-Cache'i oluştururken, bağlamı bu **sabit sırayla** bir önek olarak birleştirir:

```
┌─────────────────────────────────────────────────┐
│ 1. Tools (JSON Schema definitions)               │  ← Start of cache prefix
│ 2. System Prompt                                 │
│ 3. Messages (conversation history + current turn)│  ← End of cache prefix
└─────────────────────────────────────────────────┘
```

Bu, **Tools'un cache önekinin en başında System Prompt'tan önce yer aldığı** anlamına gelir.

## Tools Neden System'dan Daha Fazla Cache Ağırlığına Sahip?

KV-Cache önek eşleştirmesinde **önceki içerik daha kritiktir** — herhangi bir değişiklik, sonrasındaki her şeyi geçersiz kılar:

1. **Önek eşleştirmesi baştan başlar**: KV-Cache, mevcut isteği önbellekteki önekle baştan token token karşılaştırır. Bir uyuşmazlık bulunduğu anda, sonraki tüm içerik geçersiz kılınır.

2. **Tools değişirse = tüm cache geçersiz**: Tools ilk sırada olduğundan, araç tanımlarındaki herhangi bir değişiklik (tek bir MCP tool eklenmesi veya kaldırılması bile) **öneki en başından bozar** ve önbelleğe alınan tüm System Prompt ile Messages'ı geçersiz kılar.

3. **System değişirse = Messages cache geçersiz**: System Prompt ortada yer aldığından, değişiklikler yalnızca sonrasındaki Messages bölümünü geçersiz kılar.

4. **Messages değişirse = yalnızca kuyruk etkilenir**: Messages en sonda yer aldığından, yeni mesajlar eklemek yalnızca küçük bir son segmenti geçersiz kılar — Tools ve System cache'i bütün kalır.

## Pratik Etki

| Değişiklik Türü | Cache Etkisi | Tipik Senaryo |
|-----------------|-------------|---------------|
| Tool eklendi/kaldırıldı | **Tam geçersizleştirme** | MCP sunucu bağlan/kes, IDE eklentisi aç/kapat |
| System Prompt değişikliği | Messages cache kaybı | CLAUDE.md düzenleme, system reminder enjeksiyonu |
| Yeni mesaj eklendi | Yalnızca kuyruk artışı | Normal konuşma akışı (en yaygın, en ucuz) |

Bu nedenle [CacheRebuild](CacheRebuild.md)'deki `tools_change`, genellikle en pahalı yeniden oluşturma nedenidir — önek zincirini en baştan kırar.

## cc-viewer'ın Düzen Tasarımı

cc-viewer, Bağlam panelini KV-Cache önek sırasına uyacak şekilde düzenler:

- **Yukarıdan aşağıya sıra = cache önek birleştirme sırası**
- **Daha yukarıdaki değişikliklerin cache isabet oranına etkisi daha büyüktür**
- [KV-Cache-Text](KVCacheContent.md) paneliyle birlikte, tam cache önek metnini doğrudan görebilirsiniz
