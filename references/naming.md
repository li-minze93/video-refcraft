# 命名

卡的名字描述画面怎么动，不描述它从哪条视频来。

- 英文 ID：两到四个词，短横线，`对象-动作`。例如 `stagger-step-row`、`white-fade-transition`。
- 中文名：给人看，例如「错峰步骤排」。
- 来源产品名、视频标题、`page-01` 这类序号，只能出现在 `source` 或 `shots`，不能当卡 ID。
- 同一套动效只用一个 ID。卡片数量不同不是新卡，把数量放进参数。
- 一条视频里的第几镜写在 `shots[].order`。Remotion 不能注册两个同名画面时，预览 ID 可以加 `shot-03`，卡片 ID 不变。
- 转场 ID 以 `-transition` 结尾。
