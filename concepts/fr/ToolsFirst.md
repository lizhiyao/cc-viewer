# Pourquoi les Tools sont-ils listés en premier ?

Dans le panneau Context de cc-viewer, **les Tools apparaissent avant le System Prompt et les Messages**. Cet ordre reflète précisément la **séquence de préfixe KV-Cache de l'API Anthropic**.

## Séquence de préfixe KV-Cache

Lorsque l'API Anthropic construit le KV-Cache, elle concatène le contexte en un préfixe dans cet **ordre fixe** :

```
┌─────────────────────────────────────────────────┐
│ 1. Tools (JSON Schema definitions)               │  ← Start of cache prefix
│ 2. System Prompt                                 │
│ 3. Messages (conversation history + current turn)│  ← End of cache prefix
└─────────────────────────────────────────────────┘
```

Cela signifie que **les Tools se trouvent avant le System Prompt, tout au début du préfixe de cache**.

## Pourquoi les Tools ont-ils un poids de cache supérieur à System ?

Dans la correspondance de préfixe KV-Cache, **le contenu en début de séquence est plus critique** — toute modification invalide tout ce qui suit :

1. **La correspondance de préfixe commence par le début** : Le KV-Cache compare la requête actuelle au préfixe mis en cache token par token depuis le début. Dès qu'une divergence est détectée, tout le contenu suivant est invalidé.

2. **Modification des Tools = tout le cache invalidé** : Les Tools étant en première position, toute modification des définitions de tool (même l'ajout ou la suppression d'un seul MCP tool) **brise le préfixe dès le tout début**, invalidant tous les System Prompt et Messages mis en cache.

3. **Modification de System = cache des Messages invalidé** : Le System Prompt se trouve au milieu, donc ses modifications n'invalident que la portion Messages qui suit.

4. **Modification des Messages = seule la fin est affectée** : Les Messages sont à la fin, donc l'ajout de nouveaux messages n'invalide qu'un petit segment final — les caches Tools et System restent intacts.

## Impact pratique

| Type de modification | Impact sur le cache | Scénario typique |
|-------------|-------------|-----------------|
| Tool ajouté/supprimé | **Invalidation complète** | Connexion/déconnexion d'un serveur MCP, activation/désactivation d'un plugin IDE |
| Modification du System Prompt | Cache des Messages perdu | Édition de CLAUDE.md, injection de system reminder |
| Nouveau message ajouté | Incrément de queue uniquement | Flux de conversation normal (le plus fréquent, le moins coûteux) |

C'est pourquoi `tools_change` dans [CacheRebuild](CacheRebuild.md) tend à être la raison de reconstruction la plus coûteuse — elle brise la chaîne de préfixe dès le tout début.

## Conception de la mise en page de cc-viewer

cc-viewer organise le panneau Context pour correspondre à la séquence de préfixe KV-Cache :

- **Ordre de haut en bas = ordre de concaténation du préfixe de cache**
- **Les modifications plus haut ont un impact plus grand sur le taux de succès du cache**
- Associé au panneau [KV-Cache-Text](KVCacheContent.md), vous pouvez voir directement le texte complet du préfixe de cache
