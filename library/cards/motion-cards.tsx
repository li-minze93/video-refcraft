import React from "react";
import {AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig} from "remotion";

export const meta = {width: 960, height: 540, fps: 30, durationInFrames: 480};

export type MotionVariant = "hero" | "steps" | "code" | "examples" | "stack" | "summary";
export type CardColor = "pink" | "blue" | "yellow" | "purple" | "lime" | "mint";

export type MotionPageProps = {
  variant?: MotionVariant;
  title?: string;
  subtitle?: string;
  accent?: CardColor;
  cards?: readonly string[];
  cardColors?: readonly CardColor[];
  cardBodies?: readonly string[];
  code?: string;
  heroSrc?: string;
  pageNo?: string;
};

export type CenterBrightConveyorProps = {
  title?: string;
  subtitle?: string;
  srcs?: string[];
  labels?: string[];
  speedPxPerSec?: number;
};

const COLORS: Record<CardColor, string> = {
  pink: "#FF8FB1",
  blue: "#59B8EA",
  yellow: "#FFD55A",
  purple: "#A995EF",
  lime: "#C7FF3E",
  mint: "#A8EBC7",
};

const DEFAULT_BODIES = [
  "提取镜头节拍，建立可复用的结构",
  "保留验证过的句子、节奏和视觉关系",
  "把人物、产品、语言与平台分层",
  "一套工作流可以持续生成多个版本",
  "内容换了，动效命门仍然成立",
];

const CSS = `
* { box-sizing: border-box; }
.motion-root { position: absolute; inset: 0; overflow: hidden; background: #f8f7f2; color: #151515; font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; }
.motion-kicker { position: absolute; left: 48px; top: 24px; color: #77736d; font-size: 10px; letter-spacing: 2px; }
.motion-page-no { position: absolute; right: 48px; top: 24px; color: #77736d; font-size: 10px; letter-spacing: 1px; }
.motion-title { position: absolute; left: 48px; right: 48px; top: 56px; font-size: 31px; line-height: 1.12; letter-spacing: 0; font-weight: 800; }
.motion-title-mark { display: inline; padding: 0 5px 2px; }
.motion-subtitle { position: absolute; left: 50px; top: 98px; color: #77736d; font-size: 11px; line-height: 1.4; }
.motion-footer { position: absolute; left: 50%; bottom: 24px; transform: translateX(-50%); border: 1px solid #151515; border-radius: 999px; background: #fff; padding: 6px 18px; font-size: 11px; white-space: nowrap; }
.motion-page-accent { position: absolute; right: -70px; bottom: -80px; width: 260px; height: 220px; border-radius: 50%; opacity: .72; }
.motion-content { position: absolute; left: 48px; right: 48px; top: 135px; bottom: 76px; }
.motion-hero-panel { position: absolute; left: 8%; right: 8%; top: 14px; bottom: 4px; border: 1.5px solid #151515; border-radius: 12px; background: #fff; box-shadow: 5px 5px 0 rgba(21,21,21,.13); padding: 28px 34px; }
.motion-hero-panel h2 { margin: 0 0 16px; font-size: 25px; line-height: 1.25; text-align: center; }
.motion-hero-row { display: flex; align-items: flex-end; justify-content: center; gap: 14px; height: 150px; }
.motion-hero-phone { width: 58px; height: 122px; border: 2px solid #151515; border-radius: 9px; background: linear-gradient(160deg,#e9e6dd,#b6b0a3); }
.motion-hero-phone:nth-child(2) { height: 150px; background: linear-gradient(160deg,#ff9cba,#d73f70); }
.motion-hero-phone:nth-child(3) { height: 132px; background: linear-gradient(160deg,#232323,#77736d); }
.motion-hero-phone:nth-child(4) { height: 142px; background: linear-gradient(160deg,#62c8ef,#2b759c); }
.motion-hero-blocks { display: flex; gap: 8px; align-items: flex-end; margin-left: 14px; }
.motion-hero-blocks i { display: block; width: 38px; height: 42px; border: 2px solid #d73f70; background: #fff; transform: skewY(-8deg); }
.motion-grid { display: grid; gap: 12px; align-items: stretch; height: 230px; }
.motion-grid.steps-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.motion-grid.steps-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
.motion-grid.steps-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.motion-card { position: relative; min-width: 0; border: 1.5px solid #151515; border-radius: 10px; padding: 16px 14px 13px; background: #fff; box-shadow: 4px 4px 0 rgba(21,21,21,.13); overflow: hidden; }
.motion-card::after { content: ""; position: absolute; left: 14px; right: 14px; bottom: 13px; height: 1px; background: rgba(21,21,21,.58); }
.motion-card-head { display: flex; align-items: baseline; gap: 7px; margin-bottom: 12px; }
.motion-card-no { font-size: 17px; font-weight: 800; font-style: italic; }
.motion-card-title { font-size: 17px; line-height: 1.15; font-weight: 800; }
.motion-card-body { font-size: 11px; line-height: 1.55; color: #252525; }
.motion-card-tag { position: absolute; left: 14px; bottom: 17px; font-size: 9px; color: #252525; }
.motion-code-layout { display: flex; flex-direction: column; gap: 16px; height: 250px; }
.motion-code-panel { flex: 1; border: 1.5px solid #151515; border-radius: 10px; background: #1d2228; color: #bdf2c6; padding: 22px 28px; font: 14px/1.65 Menlo, Monaco, monospace; box-shadow: 4px 4px 0 rgba(21,21,21,.13); }
.motion-code-panel small { display: block; color: #77736d; font: 10px/1.4 "PingFang SC", sans-serif; margin-bottom: 9px; }
.motion-stack-layout { display: grid; grid-template-columns: 1.7fr .9fr; gap: 14px; height: 250px; }
.motion-site-shot { border: 1.5px solid #151515; border-radius: 10px; background: #fff; box-shadow: 4px 4px 0 rgba(21,21,21,.13); padding: 24px; display: flex; align-items: center; justify-content: center; }
.motion-site-logo { font-size: 30px; font-weight: 800; letter-spacing: -1px; }
.motion-site-bars { display: flex; gap: 5px; margin-top: 15px; }
.motion-site-bars i { display: block; height: 7px; border-radius: 4px; }
.motion-site-bars i:nth-child(1) { width: 70px; background: #ff8fb1; }
.motion-site-bars i:nth-child(2) { width: 84px; background: #ffd55a; }
.motion-site-bars i:nth-child(3) { width: 52px; background: #59b8ea; }
.motion-stack { display: flex; flex-direction: column; gap: 8px; }
.motion-stack .motion-card { padding: 11px 12px; box-shadow: 3px 3px 0 rgba(21,21,21,.12); }
.motion-stack .motion-card-title { font-size: 13px; }
.motion-stack .motion-card-body { font-size: 9px; line-height: 1.3; }
.motion-sticker { position: absolute; right: 12%; bottom: 13%; width: 120px; height: 120px; border: 3px solid #151515; border-radius: 24px; background: #171717; color: #ffd55a; display: flex; align-items: center; justify-content: center; text-align: center; font-size: 18px; font-weight: 900; line-height: 1.05; transform: rotate(-7deg); box-shadow: 7px 7px 0 rgba(21,21,21,.18); }
.motion-conveyor-window { position: absolute; left: 0; right: 0; top: 12px; height: 250px; border: 1.5px solid #151515; border-radius: 12px; background: #fff; overflow: hidden; box-shadow: 5px 5px 0 rgba(21,21,21,.13); }
.motion-conveyor-strip { position: absolute; left: 24px; top: 40px; display: flex; gap: 16px; height: 172px; will-change: transform; }
.motion-conveyor-item { position: relative; flex: 0 0 150px; height: 172px; border: 1.5px solid #151515; border-radius: 10px; background: #fff; padding: 7px; overflow: hidden; transform-origin: 50% 70%; }
.motion-conveyor-item .thumb { position: absolute; inset: 7px; border-radius: 6px; overflow: hidden; }
.motion-conveyor-item .label { position: absolute; left: 13px; bottom: 13px; z-index: 2; padding: 3px 7px; border-radius: 5px; background: rgba(255,255,255,.9); font-size: 9px; font-weight: 700; }
.motion-conveyor-center { position: absolute; left: 50%; top: 25px; bottom: 25px; width: 1px; background: rgba(21,21,21,.18); }
.motion-conveyor-line { position: absolute; left: 28px; right: 28px; bottom: 20px; height: 2px; background: #151515; }
`;

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const power2Out = (p: number) => 1 - Math.pow(1 - p, 3);
const backOut = (p: number, overshoot = 1.7) => {
  const x = p - 1;
  return 1 + (overshoot + 1) * x * x * x + overshoot * x * x;
};
const progress = (frame: number, fps: number, at: number, duration: number, ease = power2Out) =>
  ease(clamp01((frame / fps - at) / duration));

const enterStyle = (frame: number, fps: number, at: number, duration: number, fromY = 18) => {
  const p = progress(frame, fps, at, duration);
  return {opacity: p, transform: `translateY(${lerp(fromY, 0, p)}px)`};
};

const scaleInStyle = (frame: number, fps: number, at: number, duration: number, fromScale = 0.96) => {
  const p = progress(frame, fps, at, duration);
  return {opacity: p, transform: `scale(${lerp(fromScale, 1, p)})`};
};

const popStyle = (frame: number, fps: number, at: number, duration: number, fromScale = 0.58) => {
  const opacity = progress(frame, fps, at, duration);
  const scale = backOut(clamp01((frame / fps - at) / duration), 1.7);
  return {opacity, transform: `scale(${lerp(fromScale, 1, scale)})`};
};

const colorOf = (color: CardColor | undefined, fallback: CardColor) => COLORS[color || fallback];

const PlaceholderImage: React.FC<{src?: string; index?: number}> = ({src, index = 0}) => {
  if (src) return <Img src={src} style={{position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover"}} />;
  const fills = ["linear-gradient(145deg,#1c1c1c,#77736d)", "linear-gradient(145deg,#ff8fb1,#d73f70)", "linear-gradient(145deg,#59b8ea,#2d708f)", "linear-gradient(145deg,#ffd55a,#d59f28)", "linear-gradient(145deg,#c7ff3e,#5c8d27)"];
  return <div style={{position: "absolute", inset: 0, background: fills[index % fills.length]}}><div style={{position: "absolute", left: "16%", right: "16%", top: "18%", height: "11%", borderRadius: 4, background: "rgba(255,255,255,.78)"}} /><div style={{position: "absolute", left: "16%", right: "28%", top: "39%", height: "8%", borderRadius: 4, background: "rgba(255,255,255,.44)"}} /><div style={{position: "absolute", left: "16%", width: "32%", bottom: "16%", height: "28%", borderRadius: 5, background: "rgba(255,255,255,.38)"}} /></div>;
};

const PageChrome: React.FC<{title: string; subtitle: string; accent: CardColor; pageNo?: string}> = ({title, subtitle, accent, pageNo = "01 / 08"}) => (
  <>
    <div className="motion-kicker">HYPIT · REFERENCE MOTION SYSTEM</div>
    <div className="motion-page-no">{pageNo}</div>
    <div className="motion-title">{title.split("，").map((part, index, all) => <React.Fragment key={`${part}-${index}`}><span className="motion-title-mark" style={{background: index === all.length - 1 ? `${COLORS[accent]}99` : "transparent"}}>{part}</span>{index < all.length - 1 ? "，" : null}</React.Fragment>)}</div>
    <div className="motion-subtitle">{subtitle}</div>
  </>
);

const PageCard: React.FC<{title: string; body: string; color: CardColor; index: number; style?: React.CSSProperties}> = ({title, body, color, index, style}) => (
  <div className="motion-card" style={{background: `${COLORS[color]}D9`, ...style}}>
    <div className="motion-card-head"><span className="motion-card-no">{index + 1}</span><span className="motion-card-title">{title}</span></div>
    <div className="motion-card-body">{body}</div>
    <div className="motion-card-tag">可复用 · 可编辑</div>
  </div>
);

const defaultCardsFor = (variant: MotionVariant) => {
  if (variant === "steps") return ["分析参考", "拆成组件", "按词对齐", "调用模型", "并行渲染"];
  if (variant === "code") return ["台词变化", "语音变化", "长度变化"];
  if (variant === "examples") return ["UGC 足球榜", "播客切片", "街头采访"];
  if (variant === "stack") return ["Node.js", "pnpm", "TypeScript", "Workflow"];
  if (variant === "summary") return ["可编程", "可复用", "可批量"];
  return [];
};

const defaultColorsFor = (count: number): CardColor[] => {
  const colors: CardColor[] = ["blue", "pink", "yellow", "purple", "lime"];
  return Array.from({length: count}, (_, i) => colors[i % colors.length]);
};

const MotionPage: React.FC<MotionPageProps> = ({
  variant = "steps",
  title = "一次性剪辑，变成五步流水线",
  subtitle = "从参考视频提炼结构，再把结构变成可以重复调用的动效",
  accent = "blue",
  cards,
  cardColors,
  cardBodies = DEFAULT_BODIES,
  code = '<visual word="asset:phone" effect="pop" />',
  heroSrc,
  pageNo = "01 / 08",
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const items = cards?.length ? cards : defaultCardsFor(variant);
  const colors = cardColors?.length ? cardColors : defaultColorsFor(items.length);
  const titleStyle = enterStyle(frame, fps, 0.08, 0.45, 12);
  const footerStyle = enterStyle(frame, fps, 0.9, 0.35, 8);
  const cameraP = progress(frame, fps, 0, 9, (p) => p);

  return (
    <AbsoluteFill>
      <style>{CSS}</style>
      <div className="motion-root">
        <div className="motion-page-accent" style={{background: COLORS[accent]}} />
        <div style={{opacity: titleStyle.opacity, transform: titleStyle.transform}}><PageChrome title={title} subtitle={subtitle} accent={accent} pageNo={pageNo} /></div>
        <div className="motion-content" style={{transform: `scale(${1 + 0.035 * cameraP})`, transformOrigin: "50% 50%"}}>
          {variant === "hero" ? (
            <div className="motion-hero-panel" style={scaleInStyle(frame, fps, 0.55, 0.65)}>
              <h2>利用人工智能代理克隆任何热门视频。</h2>
              <div className="motion-hero-row">
                <div className="motion-hero-phone"><PlaceholderImage src={heroSrc} index={0} /></div>
                <div className="motion-hero-phone"><PlaceholderImage src={heroSrc} index={1} /></div>
                <div className="motion-hero-phone"><PlaceholderImage src={heroSrc} index={2} /></div>
                <div className="motion-hero-phone"><PlaceholderImage src={heroSrc} index={3} /></div>
                <div className="motion-hero-blocks"><i /><i /><i /></div>
              </div>
            </div>
          ) : variant === "code" ? (
            <div className="motion-code-layout">
              <div className="motion-grid steps-3">
                {items.slice(0, 3).map((item, i) => <PageCard key={item} title={item} body={cardBodies[i] || DEFAULT_BODIES[i]} color={colors[i]} index={i} style={enterStyle(frame, fps, 0.55 + i * 0.45, 0.45)} />)}
              </div>
              <div className="motion-code-panel" style={enterStyle(frame, fps, 1.95, 0.6, 20)}><small>VISUAL WORD / REMOTION · EDITABLE MOTION RULE</small>{code}<br /><span style={{color: "#77736d"}}>时序由词语锚点驱动，内容可以替换。</span></div>
            </div>
          ) : variant === "stack" ? (
            <div className="motion-stack-layout">
              <div className="motion-site-shot" style={scaleInStyle(frame, fps, 0.55, 0.6)}>
                <div><div className="motion-site-logo">hypit</div><div style={{fontSize: 11, color: "#77736d", marginTop: 4}}>Clone any viral video with AI agents.</div><div className="motion-site-bars"><i /><i /><i /></div></div>
              </div>
              <div className="motion-stack">{items.slice(0, 4).map((item, i) => <PageCard key={item} title={item} body={cardBodies[i] || DEFAULT_BODIES[i]} color={colors[i]} index={i} style={enterStyle(frame, fps, 0.95 + i * 0.42, 0.4, 14)} />)}</div>
            </div>
          ) : (
            <div className={`motion-grid ${items.length === 4 ? "steps-4" : items.length === 5 ? "steps-5" : "steps-3"}`}>
              {items.map((item, i) => <PageCard key={item} title={item} body={cardBodies[i] || DEFAULT_BODIES[i]} color={colors[i]} index={i} style={enterStyle(frame, fps, 0.55 + i * (variant === "examples" ? 0.6 : variant === "summary" ? 0.58 : variant === "steps" ? 0.42 : 0.45), 0.45, 18)} />)}
            </div>
          )}
        </div>
        <div className="motion-footer" style={footerStyle}>{variant === "hero" ? "参考视频结构 → 可调用动效卡" : "结构化拆解，内容换了，动效命门仍然成立"}</div>
        {variant === "summary" ? <div className="motion-sticker" style={popStyle(frame, fps, 11.2, 0.48)}>快收藏<br />一下</div> : null}
      </div>
    </AbsoluteFill>
  );
};

const conveyorColors = ["#1c1c1c", "#ff8fb1", "#59b8ea", "#ffd55a", "#c7ff3e", "#a995ef"];

export const CenterBrightConveyor: React.FC<CenterBrightConveyorProps> = ({
  title = "官网这段动效，正好解释视频生产线",
  subtitle = "网页、素材和卡片沿同一条可视化流水线持续流动",
  srcs,
  labels = ["输入", "拆解", "素材", "字幕", "合成", "输出"],
  speedPxPerSec = 150,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const seconds = frame / fps;
  const itemWidth = 150;
  const gap = 16;
  const count = labels.length;
  const setWidth = count * (itemWidth + gap);
  const x = (seconds * speedPxPerSec) % setWidth;
  const titleStyle = enterStyle(frame, fps, 0.08, 0.45, 12);
  const windowStyle = scaleInStyle(frame, fps, 0.2, 0.55);

  return (
    <AbsoluteFill>
      <style>{CSS}</style>
      <div className="motion-root">
        <div className="motion-page-accent" style={{background: COLORS.pink}} />
        <div style={{opacity: titleStyle.opacity, transform: titleStyle.transform}}><PageChrome title={title} subtitle={subtitle} accent="pink" pageNo="05 / 08" /></div>
        <div className="motion-content">
          <div className="motion-conveyor-window" style={windowStyle}>
            <div className="motion-conveyor-center" />
            <div className="motion-conveyor-strip" style={{transform: `translateX(${-x}px)`}}>
              {Array.from({length: count * 2}, (_, i) => {
                const index = i % count;
                const center = 480;
                const itemCenter = 24 - x + i * (itemWidth + gap) + itemWidth / 2;
                const distance = Math.min(1, Math.abs(itemCenter - center) / 420);
                const weight = (1 - distance) * (1 - distance);
                return (
                  <div key={`${labels[index]}-${i}`} className="motion-conveyor-item" style={{transform: `scale(${1 + 0.08 * weight})`, filter: `brightness(${0.62 + 0.38 * weight})`, zIndex: Math.round(weight * 10)}}>
                    <div className="thumb"><PlaceholderImage src={srcs?.[index]} index={index} /></div>
                    <div className="label">{labels[index]}</div>
                  </div>
                );
              })}
            </div>
            <div className="motion-conveyor-line" />
          </div>
        </div>
        <div className="motion-footer" style={enterStyle(frame, fps, 1.2, 0.35, 8)}>一条流水线，把参考素材变成可运行的工程</div>
      </div>
    </AbsoluteFill>
  );
};

type NamedPageProps = Omit<MotionPageProps, "variant">;

export const MarkedTitleStage: React.FC<NamedPageProps> = (props) => <MotionPage variant="hero" {...props} />;
export const StaggerStepRow: React.FC<NamedPageProps> = (props) => <MotionPage variant="steps" {...props} />;
export const WordCodeAnchor: React.FC<NamedPageProps> = (props) => <MotionPage variant="code" {...props} />;
export const StaggerExampleRow: React.FC<NamedPageProps> = (props) => <MotionPage variant="examples" {...props} />;
export const FactStackRise: React.FC<NamedPageProps> = (props) => <MotionPage variant="stack" {...props} />;
export const SummaryStickerPop: React.FC<NamedPageProps> = (props) => <MotionPage variant="summary" {...props} />;

export default MarkedTitleStage;

