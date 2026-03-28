# Tools가 왜 먼저 나열되는가?

cc-viewer의 Context 패널에서 **Tools는 System Prompt와 Messages보다 앞에 표시됩니다**. 이 순서는 **Anthropic API의 KV-Cache 프리픽스 시퀀스**를 정확히 반영한 것입니다.

## KV-Cache 프리픽스 시퀀스

Anthropic의 API가 KV-Cache를 구성할 때, 컨텍스트를 다음 **고정된 순서**로 프리픽스에 연결합니다:

```
┌─────────────────────────────────────────────────┐
│ 1. Tools (JSON Schema definitions)               │  ← Start of cache prefix
│ 2. System Prompt                                 │
│ 3. Messages (conversation history + current turn)│  ← End of cache prefix
└─────────────────────────────────────────────────┘
```

즉, **Tools는 System Prompt보다 앞에, 캐시 프리픽스의 맨 처음에 위치합니다**.

## Tools가 System보다 캐시 가중치가 높은 이유는?

KV-Cache 프리픽스 매칭에서는 **앞쪽의 콘텐츠일수록 더 중요**합니다 — 변경이 발생하면 그 이후의 모든 내용이 무효화됩니다:

1. **프리픽스 매칭은 처음부터 시작됩니다**: KV-Cache는 현재 요청을 캐시된 프리픽스와 처음부터 token 단위로 비교합니다. 불일치가 발견되는 순간, 이후의 모든 콘텐츠가 무효화됩니다.

2. **Tools 변경 = 전체 캐시 무효화**: Tools가 맨 앞에 있기 때문에, tool 정의의 변경(MCP tool 하나를 추가하거나 제거하는 것만으로도)은 **프리픽스를 맨 처음부터 깨뜨려**, 캐시된 System Prompt와 Messages 전체를 무효화합니다.

3. **System 변경 = Messages 캐시 무효화**: System Prompt는 중간에 위치하므로, 변경 시 그 뒤에 오는 Messages 부분만 무효화됩니다.

4. **Messages 변경 = 끝부분만 영향받음**: Messages는 마지막에 있으므로, 새로운 message 추가는 작은 끝부분 세그먼트만 무효화합니다 — Tools와 System 캐시는 그대로 유지됩니다.

## 실제 영향

| 변경 유형 | 캐시 영향 | 일반적인 시나리오 |
|-------------|-------------|-----------------|
| Tool 추가/제거 | **전체 무효화** | MCP 서버 연결/연결 해제, IDE 플러그인 전환 |
| System Prompt 변경 | Messages 캐시 손실 | CLAUDE.md 편집, system reminder 삽입 |
| 새 message 추가 | 끝부분 증분만 | 일반적인 대화 흐름 (가장 일반적, 가장 저렴) |

이것이 [CacheRebuild](CacheRebuild.md)에서 `tools_change`가 가장 비용이 많이 드는 리빌드 이유가 되기 쉬운 이유입니다 — 프리픽스 체인을 맨 앞에서부터 깨뜨리기 때문입니다.

## cc-viewer의 레이아웃 설계

cc-viewer는 Context 패널을 KV-Cache 프리픽스 시퀀스와 일치하도록 배치합니다:

- **위에서 아래로의 순서 = 캐시 프리픽스 연결 순서**
- **위쪽의 변경일수록 캐시 히트율에 더 큰 영향을 미침**
- [KV-Cache-Text](KVCacheContent.md) 패널과 함께 사용하면, 캐시 프리픽스의 전체 텍스트를 직접 확인할 수 있습니다
