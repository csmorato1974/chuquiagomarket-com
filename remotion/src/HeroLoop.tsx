import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

// La Paz market drift — 10s seamless loop, no text.
// Palette
const SKY_TOP = "#F8D6A3";
const SKY_MID = "#F0B27A";
const SKY_LOW = "#D97757";
const MOUNTAIN_FAR = "#3B4E7A";
const MOUNTAIN_NEAR = "#1E2A47";
const BUILDINGS = "#0F172A";
const ACCENT_WARM = "#F59E0B";

const UMBRELLA_COLORS = [
  "#1D4ED8", "#F59E0B", "#EF4444", "#10B981", "#8B5CF6",
  "#EC4899", "#F97316", "#06B6D4", "#FACC15", "#22C55E",
];

// Loop helpers — every function has period = durationInFrames
const tau = Math.PI * 2;

type Umbrella = {
  x: number;      // 0..1 horizontal
  y: number;      // 0..1 vertical (top area)
  size: number;   // px
  color: string;
  phase: number;  // 0..1
  speed: number;  // integer cycles per loop
  amp: number;    // sway amplitude px
};

const UMBRELLAS: Umbrella[] = Array.from({ length: 22 }, (_, i) => {
  const rnd = (n: number) => {
    const x = Math.sin(i * 9973.13 + n * 131.7) * 43758.5453;
    return x - Math.floor(x);
  };
  return {
    x: rnd(1),
    y: 0.05 + rnd(2) * 0.35,
    size: 90 + rnd(3) * 140,
    color: UMBRELLA_COLORS[Math.floor(rnd(4) * UMBRELLA_COLORS.length)],
    phase: rnd(5),
    speed: 1 + Math.floor(rnd(6) * 2), // 1 or 2 cycles per loop → seamless
    amp: 8 + rnd(7) * 22,
  };
});

type Bokeh = {
  x0: number;
  y0: number;
  r: number;
  color: string;
  phase: number;
  speed: number;
  driftX: number;
  driftY: number;
  alpha: number;
};

const BOKEH: Bokeh[] = Array.from({ length: 34 }, (_, i) => {
  const rnd = (n: number) => {
    const x = Math.sin(i * 1234.5 + n * 77.3) * 43758.5453;
    return x - Math.floor(x);
  };
  return {
    x0: rnd(1),
    y0: rnd(2),
    r: 4 + rnd(3) * 18,
    color: rnd(4) > 0.5 ? "#FFFFFF" : ACCENT_WARM,
    phase: rnd(5),
    speed: 1 + Math.floor(rnd(6) * 2),
    driftX: (rnd(7) - 0.5) * 120,
    driftY: (rnd(8) - 0.5) * 80,
    alpha: 0.15 + rnd(9) * 0.45,
  };
});

const Umbrella: React.FC<{ u: Umbrella; frame: number; total: number; parallax: number }> = ({
  u,
  frame,
  total,
  parallax,
}) => {
  const t = frame / total;
  const sway = Math.sin(tau * (t * u.speed + u.phase)) * u.amp;
  const bob = Math.cos(tau * (t * u.speed + u.phase)) * (u.amp * 0.5);
  const rot = Math.sin(tau * (t * u.speed + u.phase + 0.25)) * 6;
  const cx = u.x * 1920 + sway + parallax;
  const cy = u.y * 1080 + bob;
  const w = u.size;
  const h = u.size * 0.55;

  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rot})`}>
      {/* string */}
      <line x1={0} y1={0} x2={0} y2={-260} stroke="#111827" strokeWidth={1.2} opacity={0.35} />
      {/* canopy */}
      <ellipse cx={0} cy={0} rx={w / 2} ry={h} fill={u.color} />
      <ellipse cx={0} cy={-h * 0.15} rx={w / 2} ry={h} fill="#000" opacity={0.08} />
      {/* ribs */}
      {[-0.66, -0.33, 0, 0.33, 0.66].map((f, i) => (
        <line
          key={i}
          x1={(w / 2) * f}
          y1={-Math.sqrt(Math.max(0, 1 - f * f)) * h}
          x2={0}
          y2={h * 0.15}
          stroke="#000"
          strokeOpacity={0.18}
          strokeWidth={1}
        />
      ))}
      {/* tip */}
      <circle cx={0} cy={h * 0.15} r={3} fill="#111827" opacity={0.6} />
    </g>
  );
};

export const HeroLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / durationInFrames;

  // Slow drifting sky
  const skyShift = Math.sin(tau * t) * 40;

  // Mountain parallax (very slow)
  const mtnParallax1 = Math.sin(tau * t) * 20;
  const mtnParallax2 = Math.sin(tau * t + 0.5) * 32;

  // Umbrella parallax band drifts as camera "pans"
  const camPan = Math.sin(tau * t) * 60;

  return (
    <AbsoluteFill>
      {/* SKY */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${SKY_TOP} 0%, ${SKY_MID} 45%, ${SKY_LOW} 100%)`,
        }}
      />

      {/* Soft sun glow, right side */}
      <AbsoluteFill>
        <div
          style={{
            position: "absolute",
            right: `${18 + Math.sin(tau * t) * 2}%`,
            top: `${22 + Math.cos(tau * t) * 1.5}%`,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,236,180,0.85) 0%, rgba(255,180,120,0.35) 40%, rgba(255,150,90,0) 70%)",
            filter: "blur(4px)",
          }}
        />
      </AbsoluteFill>

      {/* Distant mountain silhouettes */}
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0 }}
      >
        <g transform={`translate(${mtnParallax1} ${skyShift * 0.1})`}>
          <path
            d="M0,720 L180,560 L340,640 L520,500 L700,600 L900,470 L1080,590 L1260,510 L1460,610 L1660,530 L1920,620 L1920,1080 L0,1080 Z"
            fill={MOUNTAIN_FAR}
            opacity={0.85}
          />
        </g>
        <g transform={`translate(${mtnParallax2} 0)`}>
          <path
            d="M0,820 L160,720 L300,780 L460,660 L640,760 L820,700 L1000,780 L1200,680 L1400,770 L1620,700 L1920,780 L1920,1080 L0,1080 Z"
            fill={MOUNTAIN_NEAR}
            opacity={0.95}
          />
        </g>
      </svg>

      {/* Umbrella canopy — hanging from top */}
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0 }}
      >
        {UMBRELLAS.map((u, i) => (
          <Umbrella key={i} u={u} frame={frame} total={durationInFrames} parallax={camPan * (0.4 + (i % 3) * 0.2)} />
        ))}
      </svg>

      {/* Building silhouettes foreground */}
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0 }}
      >
        <g transform={`translate(${-camPan * 0.5} 0)`}>
          <path
            d="M-40,900 L40,880 L60,820 L120,820 L140,860 L200,840 L220,780 L300,790 L320,850 L400,830 L420,770 L500,780 L520,840 L620,820 L640,760 L740,770 L760,830 L880,820 L900,760 L1000,770 L1020,830 L1140,820 L1160,760 L1280,770 L1300,830 L1440,820 L1460,760 L1600,770 L1620,830 L1780,820 L1800,780 L1960,790 L1960,1080 L-40,1080 Z"
            fill={BUILDINGS}
          />
          {/* window glows */}
          {Array.from({ length: 40 }).map((_, i) => {
            const r = (n: number) => {
              const x = Math.sin(i * 512.31 + n * 91.7) * 43758.5453;
              return x - Math.floor(x);
            };
            const cx = r(1) * 2000 - 20;
            const cy = 830 + r(2) * 120;
            const flick =
              0.35 + 0.35 * Math.sin(tau * (t * (1 + Math.floor(r(3) * 2)) + r(4)));
            return (
              <rect
                key={i}
                x={cx}
                y={cy}
                width={3 + r(5) * 3}
                height={4 + r(6) * 5}
                fill={ACCENT_WARM}
                opacity={flick * 0.9}
              />
            );
          })}
        </g>
      </svg>

      {/* Bokeh particles */}
      <AbsoluteFill>
        {BOKEH.map((b, i) => {
          const x =
            b.x0 * 1920 +
            Math.sin(tau * (t * b.speed + b.phase)) * b.driftX +
            camPan * 0.3;
          const y =
            b.y0 * 1080 +
            Math.cos(tau * (t * b.speed + b.phase)) * b.driftY;
          const pulse = 0.5 + 0.5 * Math.sin(tau * (t * b.speed + b.phase + 0.2));
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x - b.r,
                top: y - b.r,
                width: b.r * 2,
                height: b.r * 2,
                borderRadius: "50%",
                background: b.color,
                opacity: b.alpha * pulse,
                filter: `blur(${b.r * 0.4}px)`,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* Left-side vignette for text contrast */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(15,23,42,0.55) 0%, rgba(15,23,42,0.25) 35%, rgba(15,23,42,0) 65%)",
        }}
      />
      {/* Bottom subtle vignette */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.25) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
