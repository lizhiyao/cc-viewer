# 上下文工程测评行业调查报告（2026-03）

## 1. 报告目的

本报告用于回答三个问题：

1. 当前 GitHub 上是否已有“上下文工程测评”同类方案。
2. 主流方案在方法论和产品形态上的共性是什么。
3. `context-engineering-evaluator` 插件应如何定位，避免重复造轮子。

## 2. 结论摘要

- 市场上已有大量“LLM/Agent/RAG 评测”方案，但大多是通用评测框架或观测平台，不是专门为 `AgentTeam + cc-viewer` 打造。
- 行业共识是“评测 = 实验设计 + 多指标评分 + 可回溯轨迹”，而不是单一准确率。
- 对于当前插件，最有差异化的方向是：
  - 贴合 AgentTeam 的多代理执行轨迹；
  - 贴合 cc-viewer 的低侵入日志能力；
  - 聚焦“上下文载体版本对比”（`artifact_type + variant + sample_id`）。

## 3. 样本范围与代表项目（GitHub）

### 3.1 通用评测框架

- OpenAI Evals  
  <https://github.com/openai/evals>
- promptfoo  
  <https://github.com/promptfoo/promptfoo>
- DeepEval  
  <https://github.com/confident-ai/deepeval>
- OpenEvals  
  <https://github.com/langchain-ai/openevals>

### 3.2 观测 + 评测平台

- Langfuse  
  <https://github.com/langfuse/langfuse>
- Arize Phoenix  
  <https://github.com/Arize-ai/phoenix>
- Braintrust AutoEvals（评分类库）  
  <https://github.com/braintrustdata/autoevals>

### 3.3 RAG/知识相关评测

- Ragas  
  <https://github.com/explodinggradients/ragas>

## 4. 行业方案的共性方法

### 4.1 实验设计共性

- 固定模型与工具条件，只改变对比变量（例如 prompt/version/artifact）。
- 使用固定样本集并可重复运行。
- 强调 A/B/n 对比、回归检测和版本基线管理。

### 4.2 指标体系共性

- 质量：任务完成率、judge 分、事实性/相关性等。
- 成本：token、缓存、调用成本。
- 稳定性：错误率、时延分布（P50/P95）。
- 行为：工具调用路径、回合数、步骤效率。

### 4.3 工程化共性

- 将评测纳入 CI/CD 或至少支持自动回归。
- 保存 trace/trajectory 用于问题复盘。
- 数据集版本化与实验结果可追溯。

## 5. 与本插件的能力映射

### 5.1 已覆盖

- 版本标识与分组：`artifact_type + variant + sample_id + teammate`。
- 成本/行为/稳定性基础指标聚合：
  - tokens、cache、toolUse、duration、error。
- 面向多代理流量（teammate）分组。

### 5.2 未覆盖

- 质量评分器（LLM-as-judge / 人工标注 /规则评分）尚未内置。
- 显著性检验与统计置信区间尚未内置。
- 可视化对比面板尚未内置（当前为 JSON 报表输出）。

## 6. 差异化定位建议

### 6.1 定位一句话

`context-engineering-evaluator` 是面向 AgentTeam + cc-viewer 的轻量实验观测插件，专注“上下文载体版本对比”的可复现数据采集。

### 6.2 与主流框架的分工

- 与 promptfoo / deepeval 的关系：它们适合做通用评测编排与打分；本插件适合无侵入接入 cc-viewer 实际运行流量。
- 与 Langfuse / Phoenix 的关系：它们是完整平台；本插件是当前仓库内可快速落地的“最小评测数据层”。
- 与 Ragas 的关系：Ragas 适合 RAG 指标；本插件可作为上游轨迹与样本分组输入层。

## 7. 术语建议（首版收敛）

建议首版保持统一术语，不做别名扩展：

- `artifact_type`：上下文载体类型（skill / knowledge_pack / policy_set）
- `variant`：版本标识（v1 / v2 / date-tag）
- `sample_id`：配对样本编号

## 8. 路线图建议

### Phase 1：观测层（已完成）

- 标签化采集与分组聚合
- JSON 报告落盘

### Phase 2：评估层

- 增加评分输入接口（人工/规则/judge）
- 增加配对完整性检查与缺失告警

### Phase 3：决策层

- 增加统计显著性与置信区间
- 增加“上线建议”自动摘要

## 9. 对当前项目的直接建议

1. 先用当前插件完成 1~2 轮真实 A/B/n 对比，沉淀样本与标签规范。
2. 选一个质量评分通道先接入（建议先规则评分，再引入 LLM judge）。
3. 在 cc-viewer UI 中增加最小 TeamCompare 报告入口，完成从“数据”到“决策”的闭环。
