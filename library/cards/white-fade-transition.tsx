import React from "react";
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from "remotion";

export const meta = {width: 960, height: 540, fps: 30, durationInFrames: 15};

type Mode = "in" | "out" | "through";

type Props = {
  mode?: Mode;
  durationInFrames?: number;
  children?: React.ReactNode;
  color?: string;
};

/** A short white field between two pages. */
export const WhiteFadeTransition: React.FC<Props> = ({
  mode = "through",
  durationInFrames = 15,
  children,
  color = "#ffffff",
}) => {
  const frame = useCurrentFrame();
  const half = Math.max(1, Math.floor(durationInFrames / 2));
  const opacity = mode === "in"
    ? interpolate(frame, [0, durationInFrames], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad)})
    : mode === "out"
      ? interpolate(frame, [0, durationInFrames], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad)})
      : frame <= half
        ? interpolate(frame, [0, half], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad)})
        : interpolate(frame, [half, durationInFrames], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad)});

  return <AbsoluteFill>{children}<AbsoluteFill style={{background: color, opacity, pointerEvents: "none"}} /></AbsoluteFill>;
};

export default WhiteFadeTransition;
