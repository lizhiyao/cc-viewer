# ¿Por qué se listan primero los Tools?

En el panel Context de cc-viewer, **los Tools aparecen antes que el System Prompt y los Messages**. Este orden refleja con precisión la **secuencia de prefijo KV-Cache de la API de Anthropic**.

## Secuencia de prefijo KV-Cache

Cuando la API de Anthropic construye el KV-Cache, concatena el contexto en un prefijo en este **orden fijo**:

```
┌─────────────────────────────────────────────────┐
│ 1. Tools (JSON Schema definitions)               │  ← Start of cache prefix
│ 2. System Prompt                                 │
│ 3. Messages (conversation history + current turn)│  ← End of cache prefix
└─────────────────────────────────────────────────┘
```

Esto significa que **los Tools se encuentran antes del System Prompt, al comienzo del prefijo de caché**.

## ¿Por qué los Tools tienen mayor peso en caché que System?

En la coincidencia de prefijo KV-Cache, **el contenido más temprano es más crítico** — cualquier cambio invalida todo lo que viene después:

1. **La coincidencia de prefijo comienza desde el principio**: El KV-Cache compara la solicitud actual con el prefijo almacenado en caché token por token desde el inicio. En el momento en que se detecta una discrepancia, todo el contenido posterior queda invalidado.

2. **Cambio en Tools = todo el caché invalidado**: Como los Tools están primero, cualquier cambio en las definiciones de tool (incluso agregar o eliminar un solo MCP tool) **rompe el prefijo desde el mismísimo inicio**, invalidando todo el System Prompt y los Messages almacenados en caché.

3. **Cambio en System = caché de Messages invalidado**: El System Prompt está en el medio, por lo que sus cambios solo invalidan la porción de Messages que le sigue.

4. **Cambio en Messages = solo el final se ve afectado**: Los Messages están al final, por lo que agregar nuevos messages solo invalida un pequeño segmento final — los cachés de Tools y System permanecen intactos.

## Impacto práctico

| Tipo de cambio | Impacto en caché | Escenario típico |
|-------------|-------------|-----------------|
| Tool agregado/eliminado | **Invalidación completa** | Conexión/desconexión de servidor MCP, activación/desactivación de plugin IDE |
| Cambio en System Prompt | Caché de Messages perdido | Edición de CLAUDE.md, inyección de system reminder |
| Nuevo message agregado | Solo incremento de cola | Flujo de conversación normal (el más común, el más económico) |

Por eso `tools_change` en [CacheRebuild](CacheRebuild.md) tiende a ser la razón de reconstrucción más costosa — rompe la cadena de prefijo desde el principio.

## Diseño del panel de cc-viewer

cc-viewer organiza el panel Context para que coincida con la secuencia de prefijo KV-Cache:

- **Orden de arriba a abajo = orden de concatenación del prefijo de caché**
- **Los cambios más arriba tienen mayor impacto en la tasa de aciertos del caché**
- Junto con el panel [KV-Cache-Text](KVCacheContent.md), puedes ver el texto completo del prefijo de caché directamente
