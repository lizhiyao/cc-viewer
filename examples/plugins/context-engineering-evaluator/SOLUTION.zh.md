# AgentTeam + cc-viewer 版本对比实施方案

## 1. 目标

建立一套统一方法，对以下对象做可复现、可量化的版本对比：

- 单个 skill（优化前 vs 优化后）
- 多个 skill 版本（v1/v2/vn）
- 知识工程/上下文工程中的知识载体版本（如知识包、规则集、提示模板库）

## 2. 术语与标签

- `artifact_type`：被评测的“知识载体”类型（如 `skill`、`knowledge_pack`）
- `variant`：载体版本（如 `v1`、`v2`、`2026-03-21`）
- `sample_id`：样本唯一编号，用于配对比较

每条任务输入都应携带上述标签：

```text
[artifact_type:skill] [variant:v1] [sample_id:s001] ...
```

## 3. 执行流程

1. 固定实验条件：模型、工具权限、系统参数保持一致。
2. 准备样本集：建议每个 variant 至少 20 条样本。
3. 配对执行：同一 `sample_id` 必须在所有 variant 下都执行。
4. 交替调度：A1→B1→C1→A2→B2→C2，减少时间漂移影响。
5. 全程记录：通过 cc-viewer 采集请求日志，由本插件聚合指标。

## 4. 指标体系

### 4.1 成本

- `inputTokens`
- `outputTokens`
- `cacheReadTokens`
- `cacheCreationTokens`

### 4.2 行为

- `toolUseCount`
- `requestCount`
- `durationMsTotal`
- `errorCount`

### 4.3 质量判定

插件只负责基础观测数据，质量判定建议用以下方式之一补齐：

- 人工评分（达成/不达成）
- 规则评分（格式正确率、字段完整率）
- 自动评审器（固定 rubric）

## 5. 理论依据与行业共识

### 5.1 随机对照实验（A/B/n）

本方案的核心是受控实验设计：固定模型与工具条件，仅改变 `variant`。  
这对应业界广泛采用的 A/B/n 方法，用于隔离单一变量的真实影响。

### 5.2 配对样本设计（Matched Pairs）

同一 `sample_id` 在不同 `variant` 下配对执行，属于经典配对设计。  
该方法可显著降低样本间难度差异带来的方差，提高结论稳定性。

### 5.3 交替调度与时间偏差控制（Counterbalancing）

采用 A1→B1→C1 的交替执行，是实验设计中的平衡化思路，  
用于降低时段波动、网络抖动、服务端负载变化造成的系统性偏差。

### 5.4 多目标评估（质量-成本-稳定性）

LLM 评测行业共识不是只看准确率，而是联合评估：

- 质量（达成率/评分）
- 成本（token/cache）
- 稳定性（error/时延）

这与当前主流 Agent 评测实践中“多指标决策”的方法一致。

### 5.5 显著性与不确定性表达

对版本结论建议同时报告均值、中位数、P95，并补充置信区间或重采样统计。  
这是实验评估中对抗偶然波动的标准做法，避免“单次最优”误判。

### 5.6 评测框架实践对齐

在业内常见框架与实践中，普遍强调：

- 固定输入集与可复现流程
- 结构化打分 rubric
- 成本与质量联合优化

本方案的标签化采集（`artifact_type/variant/sample_id`）与上述实践是对齐的。

## 6. 报告解读方法

对于每个 `artifact_type`，在同一 `sample_id` 上比较不同 `variant`：

- 成本是否下降（token）
- 失败是否减少（errorCount）
- 路径是否更短（requestCount/toolUseCount）
- 时延是否更稳定（duration）

建议输出：

- 平均值（mean）
- 中位数（median）
- 长尾（p95）

## 7. 当前插件边界

当前版本已提供基础报告接口与页面：

- 插件自托管报告服务：默认 `http://127.0.0.1:7799/` 与 `/api/report`（端口冲突时自动回退随机端口）
- 首次采集到有效样本时，控制台输出 `report ready` 提示
- 服务发现文件：`tmp/context-engineering-evaluator-service.json`

当前仍属于轻量能力，边界包括：

- 页面为基础汇总视图，未提供完整交互分析能力。
- 未内置质量评分器与显著性统计。
- 复杂报告仍建议基于 `tmp/context-engineering-evaluator-report.json` 做离线分析或二次可视化。

## 8. 下一步产品化建议

1. 增加 `/api/experiments/report` 聚合接口。
2. 增加 TeamCompare 页面（按 `artifact_type`、`variant` 过滤）。
3. 增加样本配对完整性检查（缺样本自动告警）。
