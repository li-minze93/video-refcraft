---
name: video-refcraft
description: 从一条参考视频提炼可复用的动效卡、转场卡和声音卡，存进本地库，供 video-talkcraft 调用。用户丢来参考视频、要模仿或复制画面动效、转场、字幕卡或音效时使用。不要用于从零制作口播成片，那是 video-talkcraft；也不要用于没有参考视频的产品宣传片。
---

# video-refcraft

用户通常只会看，不会描述动效。这个 skill 把一条参考视频变成可调用的卡，并沉淀在本机。口播成片仍由 `video-talkcraft` 主控。

## 产出放哪

所有可调用结果只写在 `~/.codex/skills/video-refcraft/library/`。

- `library/index.json`：总目录。Talkcraft 按这里的 `id` 找卡。
- `library/cards/`：Remotion 实现。
- `library/sources/<来源目录>/reference.cards.json`：这条视频的镜头如何使用这些卡。

来源目录可以用视频或项目名。卡的 ID 不能用来源品牌命名。

## 怎么做

1. 先把视频保存到本地。用户给的是链接时，下载整条视频再分析，不要只靠浏览器逐帧看。
2. 先分镜头，再判断哪些镜头是同一套动效。同一套动效只建一张卡；一条视频里用了几次，写进 `shots`，不要为此复制新卡。
3. 命名先读 [references/naming.md](references/naming.md)。ID 用英文短横线，中文名给人看。
4. 按 [references/card-schema.md](references/card-schema.md) 写 `reference.cards.json`，并给每张卡一个能在 Remotion Studio 里播放的组件。
5. 先听完整条声音。只有能分开的点击、弹出或 whoosh 才建音效卡。整段口播只按镜头切开，`audio.cue` 保持 `null`，`status` 用 `unverified-mixed-track`。听不清就不要编。
6. 转场单独成卡，不写进页面卡里。
7. 打开 Remotion Studio 给用户看。默认一张卡一个画面，不要擅自渲染成一条成片。
8. 把新卡登记进 `library/index.json`。已有同 ID 且动效相同，只追加来源；动效不同就换 ID，不要覆盖旧卡。

## 交给 Talkcraft

Talkcraft 需要这些卡时，按 `library/index.json` 的 `id` 复制 `library/cards/` 里的组件进工程，只改标题、条目、颜色和素材。不改时序、缓动、几何比例和层级。

这些卡不在 Talkcraft 的 122 张模板里。不要为了通过 `card_lint.py` 把它们改写成另一张模板卡，也不要对它们做 template 相似度检查。

画面上的标题和标志可以保留参考视频的原文。那是镜头内容，不是卡的名字。
