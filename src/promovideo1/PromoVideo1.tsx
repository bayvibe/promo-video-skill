import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const brand = {
  name: "YouWare",
  primary: "#536449",
  secondary: "#C7F36E",
  ink: "#08100D",
  cream: "#F6F3E8",
  mint: "#DDF5C5",
  muted: "#71806F",
};

const CARD_RADIUS = 28;

const features = [
  ["AI Website Builder", "Responsive, SEO-ready landing pages from a plain prompt."],
  ["AI Dashboard Generator", "KPI layouts, charts, and structure ready for your data."],
  ["AI Prototype Generator", "Clickable product flows from user stories or mockups."],
  ["Figma to Website", "Turn static designs into live, production-ready pages."],
];

const cls = {
  fontFamily:
    "Inter, SF Pro Display, SF Pro Text, Helvetica, Arial, sans-serif",
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const fade = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

const slide = (frame: number, start: number, end: number, distance: number) =>
  interpolate(frame, [start, end], [distance, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

const page = {
  ...cls,
  background: brand.ink,
  color: brand.cream,
} satisfies React.CSSProperties;

const GridBackdrop: React.FC<{ tone?: "dark" | "light" }> = ({ tone = "dark" }) => (
  <AbsoluteFill
    style={{
      background:
        tone === "dark"
          ? `linear-gradient(135deg, ${brand.ink} 0%, #152016 48%, #273319 100%)`
          : `linear-gradient(135deg, ${brand.cream} 0%, #EEF4E5 56%, #DDEBC9 100%)`,
    }}
  >
    <AbsoluteFill
      style={{
        opacity: tone === "dark" ? 0.18 : 0.28,
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.22) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }}
    />
    <AbsoluteFill
      style={{
        background:
          tone === "dark"
            ? "linear-gradient(90deg, rgba(8,16,13,0.92), rgba(8,16,13,0.08) 50%, rgba(8,16,13,0.92))"
            : "linear-gradient(90deg, rgba(246,243,232,0.9), rgba(246,243,232,0.16) 50%, rgba(246,243,232,0.9))",
      }}
    />
  </AbsoluteFill>
);

const LogoMark: React.FC<{ dark?: boolean; size?: number }> = ({
  dark = false,
  size = 112,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: CARD_RADIUS,
      background: dark
        ? `linear-gradient(135deg, ${brand.primary}, #7A8D55)`
        : `linear-gradient(135deg, ${brand.secondary}, #F4FFD1)`,
      color: dark ? brand.cream : brand.ink,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 900,
      fontSize: size * 0.34,
      boxShadow: dark
        ? "0 34px 90px rgba(83,100,73,0.38)"
        : "0 34px 90px rgba(199,243,110,0.34)",
    }}
  >
    YW
  </div>
);

const Caption: React.FC<{ text: string; light?: boolean }> = ({ text, light = false }) => (
  <div
    style={{
      position: "absolute",
      left: "50%",
      bottom: 72,
      transform: "translateX(-50%)",
      padding: "16px 24px",
      borderRadius: 12,
      background: light ? "rgba(8,16,13,0.88)" : "rgba(246,243,232,0.12)",
      border: light ? "none" : "1px solid rgba(246,243,232,0.16)",
      color: light ? brand.cream : brand.mint,
      fontSize: 28,
      fontWeight: 650,
      textAlign: "center",
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </div>
);

const Hero: React.FC = () => {
  const frame = useCurrentFrame();
  const title = spring({ frame, fps: 30, config: { damping: 18, mass: 0.65 } });
  const input = fade(frame, 18, 34);
  const cursor = Math.floor(frame / 8) % 2 === 0 ? 1 : 0;

  return (
    <AbsoluteFill style={page}>
      <GridBackdrop />
      <div
        style={{
          position: "absolute",
          top: 72,
          left: 96,
          display: "flex",
          alignItems: "center",
          gap: 28,
          opacity: fade(frame, 0, 14),
        }}
      >
        <LogoMark size={78} />
        <div style={{ fontSize: 34, fontWeight: 850 }}>{brand.name}</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 210,
          width: 1200,
          transform: `translateY(${interpolate(title, [0, 1], [80, 0])}px)`,
          opacity: title,
        }}
      >
        <div
          style={{
            fontSize: 132,
            lineHeight: 0.92,
            fontWeight: 930,
            letterSpacing: 0,
          }}
        >
          Your One-Stop
          <br />
          <span style={{ color: brand.secondary }}>Vibe Coding</span>
          <br />
          Platform
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 100,
          top: 300,
          width: 520,
          padding: 28,
          borderRadius: CARD_RADIUS,
          background: "rgba(246,243,232,0.1)",
          border: "1px solid rgba(246,243,232,0.18)",
          opacity: input,
          transform: `translateX(${slide(frame, 18, 38, 70)}px)`,
        }}
      >
        <div style={{ color: brand.mint, fontSize: 22, fontWeight: 800 }}>
          Chat with AI to Create
        </div>
        <div
          style={{
            marginTop: 22,
            background: brand.cream,
            color: brand.ink,
            borderRadius: CARD_RADIUS,
            padding: "26px 28px",
            fontSize: 30,
            lineHeight: 1.32,
            fontWeight: 720,
          }}
        >
          Build a launch-ready product page for my new idea
          <span style={{ opacity: cursor, color: brand.primary }}>_</span>
        </div>
      </div>
      <Caption text="From idea to live product in minutes" />
    </AbsoluteFill>
  );
};

const PromptFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const rows = [
    ["Build", "What to make"],
    ["for", "Who it is for"],
    ["to", "What it should do"],
    ["And", "Additional requirements"],
  ];

  return (
    <AbsoluteFill style={{ ...page, background: brand.cream, color: brand.ink }}>
      <GridBackdrop tone="light" />
      <div style={{ position: "absolute", left: 110, top: 110, width: 680 }}>
        <div style={{ fontSize: 36, color: brand.primary, fontWeight: 800 }}>
          START WITH AN IDEA
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 92,
            lineHeight: 1,
            fontWeight: 930,
          }}
        >
          The prompt becomes the product.
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 120,
          top: 126,
          width: 720,
          padding: 34,
          borderRadius: CARD_RADIUS,
          background: "#FFFFFF",
          boxShadow: "0 38px 120px rgba(8,16,13,0.16)",
        }}
      >
        {rows.map(([label, value], index) => {
          const rowFade = fade(frame, index * 7, index * 7 + 16);
          return (
            <div
              key={label}
              style={{
                display: "grid",
                gridTemplateColumns: "130px 1fr",
                gap: 22,
                alignItems: "center",
                padding: "22px 24px",
                marginBottom: 16,
                borderRadius: CARD_RADIUS,
                background: index === 0 ? brand.ink : "#EEF3E5",
                color: index === 0 ? brand.cream : brand.ink,
                opacity: rowFade,
                transform: `translateX(${interpolate(rowFade, [0, 1], [64, 0])}px)`,
              }}
            >
              <div style={{ fontSize: 26, color: index === 0 ? brand.secondary : brand.primary, fontWeight: 850 }}>
                {label}
              </div>
              <div style={{ fontSize: 34, fontWeight: 800 }}>{value}</div>
            </div>
          );
        })}
        <div
          style={{
            marginTop: 22,
            height: 78,
            borderRadius: 18,
            background: `linear-gradient(135deg, ${brand.primary}, #75865B)`,
            color: brand.cream,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 30,
            fontWeight: 850,
            opacity: fade(frame, 34, 48),
          }}
        >
          Start building
        </div>
      </div>
      <Caption text="No credit card required" light />
    </AbsoluteFill>
  );
};

const ProjectSpectrum: React.FC = () => {
  const frame = useCurrentFrame();
  const lanes = [
    "Website / Dashboard / Prototype / Internal Tools / Website / Dashboard",
    "Figma to Website / App / Game / Website / Figma to Website / App",
    "Creative Projects / Analytics / Launch Pages / Games / Tools / Apps",
  ];
  return (
    <AbsoluteFill style={page}>
      <GridBackdrop />
      <div style={{ position: "absolute", left: 96, top: 80, right: 96 }}>
        <div style={{ fontSize: 34, color: brand.secondary, fontWeight: 820 }}>
          Build any project with
        </div>
        <div style={{ fontSize: 138, lineHeight: 0.82, marginTop: 22, fontWeight: 940, textTransform: "uppercase" }}>
          All-in-one
          <br />
          creation stack
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: -260,
          right: -260,
          top: 500,
          height: 390,
          overflow: "visible",
        }}
      >
        {lanes.map((lane, index) => {
          const x = interpolate(frame, [0, 72], [index % 2 === 0 ? -520 : 140, index % 2 === 0 ? 140 : -520], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.linear,
          });
          return (
            <div
              key={lane}
              style={{
                height: 96,
                marginBottom: 24,
                padding: "0 44px",
                width: 2600,
                background: index === 1 ? brand.secondary : brand.cream,
                color: brand.ink,
                display: "flex",
                alignItems: "center",
                transform: `translateX(${x}px) rotate(-7deg)`,
                transformOrigin: "50% 50%",
                whiteSpace: "nowrap",
                fontSize: 46,
                fontWeight: 920,
                letterSpacing: 0,
                boxShadow: "0 28px 90px rgba(0,0,0,0.24)",
              }}
            >
              {lane}
            </div>
          );
        })}
      </div>
      <Caption text="Websites, apps, tools, games, dashboards" />
    </AbsoluteFill>
  );
};

const FeatureBurst: React.FC = () => {
  const frame = useCurrentFrame();
  const active = Math.min(features.length - 1, Math.floor(frame / 18));
  const positions = [
    { left: 100, top: 132, width: 600, height: 292 },
    { left: 760, top: 86, width: 500, height: 410 },
    { left: 1320, top: 190, width: 470, height: 272 },
    { left: 250, top: 560, width: 1280, height: 250 },
  ];

  return (
    <AbsoluteFill style={{ ...page, background: "#EEF3E5", color: brand.ink }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(120deg, rgba(83,100,73,0.18), transparent 42%, rgba(199,243,110,0.24))",
        }}
      />
      <div style={{ position: "absolute", left: 100, top: 72, fontSize: 34, color: brand.primary, fontWeight: 860 }}>
        FEATURE SET
      </div>
      <div style={{ position: "absolute", left: 100, top: 712, fontSize: 118, lineHeight: 0.86, fontWeight: 940, textTransform: "uppercase", opacity: 0.08 }}>
        One chat / many outputs
      </div>
      {features.map(([title, body], index) => {
        const local = frame - index * 13;
        const p = fade(local, 0, 16);
        const isActive = index === active;
        const pos = positions[index];
        return (
          <div
            key={title}
            style={{
              position: "absolute",
              ...pos,
              padding: "34px 38px",
              background: isActive ? brand.ink : "#FFFFFF",
              color: isActive ? brand.cream : brand.ink,
              boxShadow: isActive
                ? "0 42px 120px rgba(8,16,13,0.28)"
                : "0 20px 60px rgba(8,16,13,0.08)",
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [80, 0])}px) rotate(${[-2, 3, -4, 1][index]}deg)`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ fontSize: index === 3 ? 58 : 42, lineHeight: 0.98, fontWeight: 930 }}>{title}</div>
            <div style={{ fontSize: 24, lineHeight: 1.32, color: isActive ? brand.mint : brand.muted, maxWidth: index === 3 ? 820 : "auto" }}>
              {body}
            </div>
          </div>
        );
      })}
      <Caption text="Builder, dashboard, prototype, Figma to website" light />
    </AbsoluteFill>
  );
};

const BuildMoment: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [8, 78], [4, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.24, 0, 0.2, 1),
  });
  const lines = [
    "Reading product goal",
    "Mapping sections",
    "Designing responsive UI",
    "Generating production code",
    "Publishing live project",
  ];

  return (
    <AbsoluteFill style={page}>
      <GridBackdrop />
      <div style={{ position: "absolute", left: 92, top: 88, right: 92, display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 34 }}>
        <div
          style={{
            position: "relative",
            height: 760,
            borderRadius: CARD_RADIUS,
            background: "rgba(246,243,232,0.1)",
            border: "1px solid rgba(246,243,232,0.18)",
            padding: 34,
            overflow: "hidden",
          }}
        >
          <div style={{ fontSize: 30, color: brand.secondary, fontWeight: 850 }}>
            AI Agent Run
          </div>
          <div style={{ marginTop: 40 }}>
            {lines.map((line, index) => {
              const p = fade(frame, index * 10, index * 10 + 16);
              return (
                <div
                  key={line}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    marginBottom: 25,
                    opacity: p,
                    transform: `translateX(${interpolate(p, [0, 1], [-34, 0])}px)`,
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 17,
                      background: index * 12 < frame ? brand.secondary : "rgba(246,243,232,0.25)",
                    }}
                  />
                  <div style={{ fontSize: 34, fontWeight: 760 }}>{line}</div>
                </div>
              );
            })}
          </div>
          <div style={{ position: "absolute", left: 128, right: 34, bottom: 180 }}>
            <div style={{ height: 18, borderRadius: 9, background: "rgba(246,243,232,0.18)", overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: brand.secondary, borderRadius: 9 }} />
            </div>
            <div style={{ marginTop: 18, fontSize: 28, color: brand.mint, fontWeight: 760 }}>
              {Math.round(progress)}% to live
            </div>
          </div>
        </div>
        <div
          style={{
            height: 760,
            borderRadius: CARD_RADIUS,
            background: brand.cream,
            color: brand.ink,
            overflow: "hidden",
            boxShadow: "0 44px 120px rgba(0,0,0,0.34)",
            transform: `scale(${interpolate(frame, [0, 24], [0.94, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease })})`,
          }}
        >
          <div style={{ height: 68, background: "#FFFFFF", borderBottom: "1px solid rgba(8,16,13,0.1)", display: "flex", alignItems: "center", gap: 10, padding: "0 22px" }}>
            {["#EF4444", "#F59E0B", "#22C55E"].map((color) => (
              <div key={color} style={{ width: 16, height: 16, borderRadius: 8, background: color }} />
            ))}
            <div style={{ marginLeft: 14, fontSize: 21, color: brand.muted, fontWeight: 700 }}>
              youware.app/live-project
            </div>
          </div>
          <div style={{ padding: 36 }}>
            <div style={{ height: 160, borderRadius: CARD_RADIUS, background: `linear-gradient(135deg, ${brand.ink}, ${brand.primary})`, padding: 30, color: brand.cream }}>
              <div style={{ width: 320, height: 28, borderRadius: 14, background: brand.secondary }} />
              <div style={{ marginTop: 26, fontSize: 44, lineHeight: 1.08, fontWeight: 900 }}>
                Launch-ready page
              </div>
            </div>
            <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
              {[1, 2, 3, 4].map((item) => (
                <div key={item} style={{ height: 160, borderRadius: CARD_RADIUS, background: "#E8EEDF", padding: 24 }}>
                  <div style={{ width: 76, height: 20, borderRadius: 10, background: brand.primary }} />
                  <div style={{ marginTop: 46, width: "78%", height: 20, borderRadius: 10, background: "rgba(8,16,13,0.18)" }} />
                  <div style={{ marginTop: 14, width: "52%", height: 20, borderRadius: 10, background: "rgba(8,16,13,0.12)" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Caption text="No setup. No config. Just ship." />
    </AbsoluteFill>
  );
};

const TrustStack: React.FC = () => {
  const frame = useCurrentFrame();
  const cards = [
    ["1M+", "creators"],
    ["Best", "models"],
    ["Boost", "design"],
    ["Auto", "error fix"],
  ];

  return (
    <AbsoluteFill style={{ ...page, background: brand.cream, color: brand.ink }}>
      <div style={{ position: "absolute", left: 104, top: 110, width: 790 }}>
        <div style={{ fontSize: 34, color: brand.primary, fontWeight: 870 }}>
          TRUSTED CREATION FLOW
        </div>
        <div style={{ marginTop: 22, fontSize: 96, lineHeight: 1, fontWeight: 930 }}>
          Advanced agents,
          <br />
          approachable speed.
        </div>
      </div>
      <div style={{ position: "absolute", left: 104, right: 104, bottom: 150, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 22 }}>
        {cards.map(([big, label], index) => {
          const p = spring({ frame: frame - index * 7, fps: 30, config: { damping: 16, mass: 0.6 } });
          return (
            <div
              key={label}
              style={{
                height: 260,
                borderRadius: CARD_RADIUS,
                padding: 30,
                background: index === 0 ? brand.ink : "#FFFFFF",
                color: index === 0 ? brand.cream : brand.ink,
                boxShadow: "0 28px 90px rgba(8,16,13,0.12)",
                transform: `translateY(${interpolate(p, [0, 1], [80, 0])}px)`,
                opacity: p,
              }}
            >
              <div style={{ fontSize: 76, lineHeight: 1, fontWeight: 940, color: index === 0 ? brand.secondary : brand.primary }}>
                {big}
              </div>
              <div style={{ marginTop: 22, fontSize: 34, lineHeight: 1.08, fontWeight: 850 }}>
                {label}
              </div>
            </div>
          );
        })}
      </div>
      <Caption text="Trusted by 1M+ creators" light />
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const p = spring({ frame, fps: 30, config: { damping: 18, mass: 0.7 } });
  const chips = ["Prompt", "Build", "Ship", "Share"];

  return (
    <AbsoluteFill style={page}>
      <GridBackdrop />
      {chips.map((chip, index) => {
        const angle = [-12, 9, -7, 11][index];
        const positions = [
          { left: 210, top: 170 },
          { right: 230, top: 170 },
          { left: 260, bottom: 170 },
          { right: 260, bottom: 170 },
        ];
        return (
          <div
            key={chip}
            style={{
              position: "absolute",
              ...positions[index],
              padding: "18px 30px",
              borderRadius: CARD_RADIUS,
              background: index % 2 === 0 ? brand.cream : brand.secondary,
              color: brand.ink,
              fontSize: 30,
              fontWeight: 920,
              opacity: fade(frame, 8 + index * 5, 24 + index * 5),
              transform: `rotate(${angle}deg)`,
              boxShadow: "0 24px 70px rgba(0,0,0,0.22)",
            }}
          >
            {chip}
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 150,
          textAlign: "center",
          fontSize: 118,
          lineHeight: 0.88,
          fontWeight: 940,
          transform: `translateY(${interpolate(p, [0, 1], [88, 0])}px)`,
          opacity: p,
        }}
      >
        Bring
        <br />
        your ideas
        <br />
        <span style={{ color: brand.secondary }}>to life.</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 126,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          transform: "translateX(-50%)",
          opacity: fade(frame, 22, 42),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <LogoMark size={74} />
          <div style={{ fontSize: 34, fontWeight: 920 }}>{brand.name}</div>
        </div>
        <div
          style={{
            padding: "26px 58px",
            borderRadius: CARD_RADIUS,
            background: brand.secondary,
            color: brand.ink,
            fontSize: 34,
            fontWeight: 900,
            boxShadow: "0 30px 90px rgba(199,243,110,0.28)",
          }}
        >
          Start Building
        </div>
        <div style={{ color: brand.mint, fontSize: 30, fontWeight: 720 }}>
          youware.com
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const PromoVideo1: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={page}>
      <Sequence durationInFrames={64}>
        <Hero />
      </Sequence>
      <Sequence from={64} durationInFrames={76}>
        <PromptFlow />
      </Sequence>
      <Sequence from={140} durationInFrames={72}>
        <ProjectSpectrum />
      </Sequence>
      <Sequence from={212} durationInFrames={84}>
        <FeatureBurst />
      </Sequence>
      <Sequence from={296} durationInFrames={100}>
        <BuildMoment />
      </Sequence>
      <Sequence from={396} durationInFrames={78}>
        <TrustStack />
      </Sequence>
      <Sequence from={474} durationInFrames={durationInFrames - 474}>
        <EndCard />
      </Sequence>
    </AbsoluteFill>
  );
};
