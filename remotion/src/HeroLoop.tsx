import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

// La Paz — Illimani sunset drift — 10s seamless loop, no text.
// Palette (atardecer paceño)
const SKY_TOP = "#F4C27A";
const SKY_MID = "#E88A5C";
const SKY_LOW = "#B85A3E";
const RANGE_FAR = "#7A6A8A"; // Cordillera Real lejana
const ILLIMANI = "#2A2340"; // Masa principal
const SNOW = "#F5EEDC";
const CITY = "#0F0A1F";
const ACCENT_WARM = "#F59E0B";

const UMBRELLA_COLORS = [
  "#1D4ED8", "#F59E0B", "#EF4444", "#10B981", "#8B5CF6",
  "#EC4899", "#F97316", "#06B6D4", "#FACC15", "#22C55E",
];

const tau = Math.PI * 2;

type Umbrella = {
  x: number;
  y: number;
  size: number;
  color: string;
  phase: number;
  speed: number;
  amp: number;
};

// 14 umbrellas confined to the lateral bands so they don't cover the central Illimani massif
const UMBRELLAS: Umbrella[] = Array.from({ length: 14 }, (_, i) => {
  const rnd = (n: number) => {
    const x = Math.sin(i * 9973.13 + n * 131.7) * 43758.5453;
    return x - Math.floor(x);
  };
  // Half on the left band (0..0.26), half on the right band (0.78..1)
  const onLeft = i % 2 === 0;
  const x = onLeft ? rnd(1) * 0.26 : 0.78 + rnd(1) * 0.22;
  return {
    x,
    y: 0.04 + rnd(2) * 0.28,
    size: 90 + rnd(3) * 130,
    color: UMBRELLA_COLORS[Math.floor(rnd(4) * UMBRELLA_COLORS.length)],
    phase: rnd(5),
    speed: 1 + Math.floor(rnd(6) * 2),
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

const BOKEH: Bokeh[] = Array.from({ length: 24 }, (_, i) => {
  const rnd = (n: number) => {
    const x = Math.sin(i * 1234.5 + n * 77.3) * 43758.5453;
    return x - Math.floor(x);
  };
  return {
    x0: rnd(1),
    y0: rnd(2),
    r: 4 + rnd(3) * 16,
    color: rnd(4) > 0.4 ? ACCENT_WARM : "#FFF5E1",
    phase: rnd(5),
    speed: 1 + Math.floor(rnd(6) * 2),
    driftX: (rnd(7) - 0.5) * 120,
    driftY: (rnd(8) - 0.5) * 80,
    alpha: 0.18 + rnd(9) * 0.4,
  };
});

const UmbrellaNode: React.FC<{ u: Umbrella; frame: number; total: number; parallax: number }> = ({
  u, frame, total, parallax,
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
      <line x1={0} y1={0} x2={0} y2={-260} stroke="#111827" strokeWidth={1.2} opacity={0.35} />
      <ellipse cx={0} cy={0} rx={w / 2} ry={h} fill={u.color} />
      <ellipse cx={0} cy={-h * 0.15} rx={w / 2} ry={h} fill="#000" opacity={0.08} />
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
      <circle cx={0} cy={h * 0.15} r={3} fill="#111827" opacity={0.6} />
    </g>
  );
};

export const HeroLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / durationInFrames;

  const skyShift = Math.sin(tau * t) * 40;
  const rangeParallax = Math.sin(tau * t) * 14;
  const illimaniParallax = Math.sin(tau * t + 0.5) * 8; // subtle — mountain is anchor
  const cityParallax = Math.sin(tau * t) * 40;
  const camPan = Math.sin(tau * t) * 60;

  // Illimani — wide massif with a jagged summit ridge of several close peaks.
  // Centered around x=960 so it remains visible when object-cover crops on mobile.
  // Baseline y=780, summit ridge around y=310..390.
  const illimaniPath = `
    M -20,820
    L 120,810
    L 260,800
    L 380,790
    L 500,760
    L 600,700
    L 690,630
    L 760,560
    L 820,500
    L 870,450
    L 900,405
    L 925,380
    L 950,410
    L 980,370
    L 1005,345
    L 1030,380
    L 1055,340
    L 1080,305
    L 1105,330
    L 1130,360
    L 1160,335
    L 1190,350
    L 1220,330
    L 1250,365
    L 1285,390
    L 1320,430
    L 1360,475
    L 1410,530
    L 1470,600
    L 1540,670
    L 1620,725
    L 1720,760
    L 1820,780
    L 1940,795
    L 1940,1080
    L -20,1080 Z
  `;

  // Mid-slope violet layer — gives the massif volume like in the reference photo
  const illimaniMidPath = `
    M 500,760
    L 600,700
    L 700,640
    L 800,570
    L 880,510
    L 950,460
    L 1020,430
    L 1090,410
    L 1170,420
    L 1250,450
    L 1330,500
    L 1420,570
    L 1520,640
    L 1620,700
    L 1720,740
    L 1720,780
    L 500,780 Z
  `;

  // Snow blanket — broad, covering the whole summit ridge with glacier tongues
  const snowPath = `
    M 640,660
    L 700,600
    L 760,540
    L 820,485
    L 870,440
    L 900,400
    L 925,378
    L 950,405
    L 980,368
    L 1005,343
    L 1030,378
    L 1055,338
    L 1080,303
    L 1105,328
    L 1130,358
    L 1160,333
    L 1190,348
    L 1220,328
    L 1250,363
    L 1285,388
    L 1320,425
    L 1360,470
    L 1410,520
    L 1460,575
    L 1500,620
    L 1470,625
    L 1440,600
    L 1410,635
    L 1380,590
    L 1350,555
    L 1320,600
    L 1290,555
    L 1260,530
    L 1230,570
    L 1200,540
    L 1170,505
    L 1140,545
    L 1110,510
    L 1080,470
    L 1050,510
    L 1020,485
    L 990,520
    L 960,495
    L 930,530
    L 900,500
    L 870,540
    L 840,580
    L 810,555
    L 780,600
    L 750,635
    L 720,660
    L 680,685
    Z
  `;

  return (
    <AbsoluteFill>
      {/* SKY sunset gradient */}

      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${SKY_TOP} 0%, ${SKY_MID} 55%, ${SKY_LOW} 100%)`,
        }}
      />

      {/* Sol bajo detrás del Pico Sur del Illimani */}
      <AbsoluteFill>
        <div
          style={{
            position: "absolute",
            left: `${56 + Math.sin(tau * t) * 0.4}%`,
            top: `${40 + Math.cos(tau * t) * 0.6}%`,

            width: 420,
            height: 420,
            marginLeft: -210,
            marginTop: -210,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,236,180,0.95) 0%, rgba(255,180,110,0.55) 35%, rgba(255,140,80,0.15) 60%, rgba(255,120,70,0) 75%)",
            filter: "blur(2px)",
          }}
        />
      </AbsoluteFill>

      {/* Cordillera Real lejana (muy tenue) */}
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${rangeParallax} ${skyShift * 0.08})`} opacity={0.45}>
          <path
            d="M0,700 L120,640 L220,680 L340,600 L460,660 L580,590 L720,650 L860,580 L1000,640 L1140,570 L1280,635 L1420,565 L1560,625 L1720,555 L1920,620 L1920,1080 L0,1080 Z"
            fill={RANGE_FAR}
          />
        </g>
      </svg>

      {/* Neblina cálida horizontal (haze) que separa cordillera del Illimani */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(255,190,140,0) 55%, rgba(255,180,120,0.35) 66%, rgba(255,180,120,0) 78%)",
        }}
      />

      {/* Illimani — silueta principal con nieve */}
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${illimaniParallax} 0)`}>
          {/* masa oscura */}
          <path d={illimaniPath} fill={ILLIMANI} />
          {/* sombra lateral izquierda (dirección de la luz: sol al centro-derecha) */}
          <path
            d={illimaniPath}
            fill="url(#illimaniShade)"
            opacity={0.55}
          />
          {/* nieve */}
          <path d={snowPath} fill={SNOW} opacity={0.9} />
          {/* brillo cálido sobre nieve (alpenglow tenue) */}
          <path d={snowPath} fill="url(#snowGlow)" opacity={0.6} />
        </g>
        <defs>
          <linearGradient id="illimaniShade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#000000" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="snowGlow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFD9A8" stopOpacity="0" />
            <stop offset="70%" stopColor="#FFB27A" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#FF8C55" stopOpacity="0.85" />
          </linearGradient>
        </defs>
      </svg>

      {/* Ciudad en primer término — colinas quebradas de La Paz con ventanas titilantes */}
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${-cityParallax * 0.5} 0)`}>
          <path
            d="M-40,900 L40,880 L60,820 L120,820 L140,860 L200,840 L220,780 L300,790 L320,850 L400,830 L420,770 L500,780 L520,840 L620,820 L640,760 L740,770 L760,830 L880,820 L900,760 L1000,770 L1020,830 L1140,820 L1160,760 L1280,770 L1300,830 L1440,820 L1460,760 L1600,770 L1620,830 L1780,820 L1800,780 L1960,790 L1960,1080 L-40,1080 Z"
            fill={CITY}
          />
          {Array.from({ length: 48 }).map((_, i) => {
            const r = (n: number) => {
              const x = Math.sin(i * 512.31 + n * 91.7) * 43758.5453;
              return x - Math.floor(x);
            };
            const cx = r(1) * 2000 - 20;
            const cy = 820 + r(2) * 140;
            const flick =
              0.35 + 0.4 * Math.sin(tau * (t * (1 + Math.floor(r(3) * 2)) + r(4)));
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

      {/* Paraguas flotando — sólo lado izquierdo */}
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        {UMBRELLAS.map((u, i) => (
          <UmbrellaNode
            key={i}
            u={u}
            frame={frame}
            total={durationInFrames}
            parallax={camPan * (0.3 + (i % 3) * 0.15)}
          />
        ))}
      </svg>

      {/* Bokeh partículas cálidas */}
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

      {/* Vignette izquierda para contraste con el copy */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(15,10,31,0.6) 0%, rgba(15,10,31,0.28) 35%, rgba(15,10,31,0) 65%)",
        }}
      />
      {/* Bottom vignette */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.28) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
