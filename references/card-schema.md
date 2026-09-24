# 卡片记录

每条参考视频一份 `reference.cards.json`。`cards` 是可复用动效，`shots` 是这条视频的使用记录。

```json
{
  "schemaVersion": "1.1.0",
  "id": "reference-motion-cards",
  "title": "参考拆卡",
  "skill": "video-refcraft",
  "source": { "file": "参考视频/原文件名.mp4", "durationSec": 0, "fps": 30 },
  "cards": [
    { "id": "stagger-step-row", "name": "错峰步骤排", "component": "StaggerStepRow", "kind": "page" }
  ],
  "shots": [
    {
      "order": 2,
      "cardId": "stagger-step-row",
      "previewId": "stagger-step-row",
      "time": { "startSec": 10, "endSec": 17, "startFrame": 300, "endFrame": 510 },
      "title": "这一镜的原文字",
      "cards": ["拆镜头", "抄字幕"],
      "events": [{ "id": "step-cards", "atSec": 0.55, "staggerSec": 0.5, "enter": "fade-rise" }],
      "audio": { "status": "unverified-mixed-track", "cue": null }
    }
  ],
  "transitions": [
    { "id": "white-fade-transition", "name": "白场转场", "component": "WhiteFadeTransition", "durationSec": 0.5 }
  ]
}
```

`events` 记录进入方式、错峰和时长。看不清的时间标低置信度，不要填成精确事实。

音效只在听辨或分离成功后写 `audio.cue`。混合口播保持 `cue: null`。
