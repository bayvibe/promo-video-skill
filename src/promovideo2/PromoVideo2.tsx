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
  name: "Pencil",
  ink: "#080808",
  paper: "#F4F1E8",
  white: "#FFFFFF",
  graphite: "#2A2A2A",
  muted: "#77736A",
  line: "#D8D2C4",
  yellow: "#F6D64A",
  blue: "#5A8CFF",
  green: "#79D885",
};

const CARD_RADIUS = 28;

const font =
  "Inter, SF Pro Display, SF Pro Text, Helvetica, Arial, sans-serif";

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const fade = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

const darkPage = {
  fontFamily: font,
  background: brand.ink,
  color: brand.paper,
} satisfies React.CSSProperties;

const lightPage = {
  fontFamily: font,
  background: brand.paper,
  color: brand.ink,
} satisfies React.CSSProperties;

const Caption: React.FC<{ children: string; dark?: boolean }> = ({
  children,
  dark = true,
}) => (
  <div
    style={{
      position: "absolute",
      left: "50%",
      bottom: 66,
      transform: "translateX(-50%)",
      padding: "15px 24px",
      borderRadius: 12,
      background: dark ? "rgba(255,255,255,0.12)" : "rgba(8,8,8,0.88)",
      border: dark ? "1px solid rgba(255,255,255,0.16)" : "none",
      color: dark ? brand.paper : brand.paper,
      fontSize: 28,
      fontWeight: 760,
      whiteSpace: "nowrap",
      textAlign: "center",
    }}
  >
    {children}
  </div>
);

const CanvasGrid: React.FC<{ dark?: boolean }> = ({ dark = true }) => (
  <AbsoluteFill
    style={{
      background: dark
        ? `radial-gradient(circle at 80% 18%, rgba(90,140,255,0.18), transparent 30%), ${brand.ink}`
        : `radial-gradient(circle at 74% 16%, rgba(246,214,74,0.25), transparent 30%), ${brand.paper}`,
    }}
  >
    <AbsoluteFill
      style={{
        opacity: dark ? 0.16 : 0.55,
        backgroundImage: dark
          ? "linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)"
          : "linear-gradient(rgba(8,8,8,0.11) 1px, transparent 1px), linear-gradient(90deg, rgba(8,8,8,0.11) 1px, transparent 1px)",
        backgroundSize: "52px 52px",
      }}
    />
  </AbsoluteFill>
);

const Logo: React.FC<{ light?: boolean; size?: number }> = ({
  light = false,
  size = 88,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.28,
      background: light ? brand.paper : brand.ink,
      color: light ? brand.ink : brand.paper,
      border: `3px solid ${light ? brand.ink : brand.paper}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: size * 0.48,
      fontWeight: 950,
      fontStyle: "italic",
      letterSpacing: 0,
    }}
  >
    p
  </div>
);

const CanvasConstellation: React.FC<{ frame: number }> = ({ frame }) => {
  const items = [
    [1120, 142, 330, 170, brand.yellow, -7],
    [1360, 370, 390, 220, brand.blue, 5],
    [970, 650, 310, 160, brand.green, 8],
    [1390, 675, 230, 130, brand.white, -4],
  ];
  const lineProgress = interpolate(frame, [18, 62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  return (
    <AbsoluteFill>
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        <path
          d="M1080 680 C1160 420 1280 320 1510 460"
          fill="none"
          stroke={brand.paper}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="760"
          strokeDashoffset={760 - lineProgress * 760}
          opacity={0.82}
        />
        <path
          d="M820 820 C1000 760 1180 720 1440 700"
          fill="none"
          stroke={brand.paper}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="690"
          strokeDashoffset={690 - lineProgress * 690}
          opacity={0.5}
        />
      </svg>
      {items.map(([left, top, width, height, color, rotate], index) => {
        const p = spring({
          frame: frame - index * 7,
          fps: 30,
          config: { damping: 16, mass: 0.62 },
        });
        return (
          <div
            key={`${left}-${top}`}
            style={{
              position: "absolute",
              left,
              top,
              width,
              height,
              borderRadius: CARD_RADIUS,
              background: color as string,
              border: `4px solid ${brand.paper}`,
              boxShadow: "0 34px 90px rgba(0,0,0,0.34)",
              opacity: p,
              transform: `rotate(${rotate}deg) scale(${interpolate(p, [0, 1], [0.68, 1])})`,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          right: 112,
          bottom: 122,
          padding: "18px 22px",
          borderRadius: CARD_RADIUS,
          background: brand.paper,
          color: brand.ink,
          fontSize: 25,
          fontWeight: 900,
          opacity: fade(frame, 38, 58),
        }}
      >
        product-flow.pen
      </div>
    </AbsoluteFill>
  );
};

const Hero: React.FC = () => {
  const frame = useCurrentFrame();
  const title = spring({ frame, fps: 30, config: { damping: 18, mass: 0.68 } });
  return (
    <AbsoluteFill style={darkPage}>
      <CanvasGrid />
      <CanvasConstellation frame={frame} />
      <div
        style={{
          position: "absolute",
          top: 74,
          left: 96,
          display: "flex",
          alignItems: "center",
          gap: 26,
          opacity: fade(frame, 0, 14),
        }}
      >
        <Logo />
        <div style={{ fontSize: 40, fontWeight: 900 }}>{brand.name}</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 92,
          top: 250,
          width: 1420,
          opacity: title,
          transform: `translateY(${interpolate(title, [0, 1], [80, 0])}px)`,
        }}
      >
        <div
          style={{
            fontSize: 164,
            lineHeight: 0.82,
            fontWeight: 960,
            letterSpacing: 0,
            textTransform: "uppercase",
          }}
        >
          Design
          <br />
          on canvas.
          <br />
          <span style={{ color: brand.yellow }}>Land in code.</span>
        </div>
      </div>
      <Caption>Design mode for builders who live in code</Caption>
    </AbsoluteFill>
  );
};

const IDEScene: React.FC = () => {
  const frame = useCurrentFrame();
  const tools = ["Cursor", "VS Code", "Claude Code", "OpenAI Codex"];
  return (
    <AbsoluteFill style={lightPage}>
      <CanvasGrid dark={false} />
      <div style={{ position: "absolute", left: 105, top: 85, right: 105 }}>
        <div style={{ color: brand.muted, fontSize: 34, fontWeight: 850 }}>
          NO CONTEXT SWITCHING
        </div>
        <div
          style={{
            marginTop: 18,
            width: 1500,
            fontSize: 118,
            lineHeight: 0.9,
            fontWeight: 960,
          }}
        >
          Design where
          <br />
          you already code.
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 104,
          right: 104,
          bottom: 148,
          height: 440,
          borderRadius: CARD_RADIUS,
          background: brand.ink,
          color: brand.paper,
          overflow: "hidden",
          boxShadow: "0 38px 130px rgba(8,8,8,0.24)",
          transform: `rotate(${interpolate(frame, [0, 28], [-2.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease })}deg)`,
        }}
      >
        <div
          style={{
            height: 70,
            background: "#161616",
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            gap: 12,
          }}
        >
          {tools.map((tool, index) => (
            <div
              key={tool}
              style={{
                padding: "10px 16px",
                borderRadius: 10,
                background: index === 0 ? brand.paper : "rgba(255,255,255,0.08)",
                color: index === 0 ? brand.ink : brand.paper,
                fontSize: 18,
                fontWeight: 850,
              }}
            >
              {tool}
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", height: 370 }}>
          <div
            style={{
              borderRight: "1px solid rgba(255,255,255,0.12)",
              padding: "28px 28px",
            }}
          >
            {["app", "components", "design.pen", "tokens.css"].map((item, index) => (
              <div
                key={item}
                style={{
                  padding: "14px 16px",
                  marginBottom: 10,
                  borderRadius: 10,
                  background: item === "design.pen" ? brand.yellow : "transparent",
                  color: item === "design.pen" ? brand.ink : "rgba(244,241,232,0.72)",
                  fontSize: 22,
                  fontWeight: 760,
                  opacity: fade(frame, index * 5, index * 5 + 14),
                }}
              >
                {item}
              </div>
            ))}
          </div>
          <div style={{ position: "relative", padding: 28 }}>
            <div
              style={{
                position: "absolute",
                inset: 28,
                borderRadius: CARD_RADIUS,
                background: brand.paper,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "linear-gradient(rgba(8,8,8,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(8,8,8,0.08) 1px, transparent 1px)",
                  backgroundSize: "38px 38px",
                }}
              />
              {[brand.yellow, brand.blue, brand.green, brand.white].map((color, index) => {
                const p = spring({
                  frame: frame - index * 7,
                  fps: 30,
                  config: { damping: 15, mass: 0.6 },
                });
                return (
                  <div
                    key={color}
                  style={{
                    position: "absolute",
                      left: 70 + index * 178,
                      top: 58 + (index % 2) * 112,
                      width: 260,
                      height: 108,
                      borderRadius: CARD_RADIUS,
                      background: color,
                      border: `3px solid ${brand.ink}`,
                      opacity: p,
                      transform: `scale(${interpolate(p, [0, 1], [0.76, 1])}) rotate(${index % 2 === 0 ? -3 : 4}deg)`,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Caption dark={false}>Pencil lives in the same workspace as your code</Caption>
    </AbsoluteFill>
  );
};

const PromptScene: React.FC = () => {
  const frame = useCurrentFrame();
  const prompts = [
    "Design a website for a specialty cafe.",
    "Explore a totally different direction.",
    "Change this to light mode.",
    "Use the selected design as the base.",
  ];
  return (
    <AbsoluteFill style={darkPage}>
      <CanvasGrid />
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 76,
          fontSize: 32,
          color: brand.yellow,
          fontWeight: 880,
        }}
      >
        PROMPT GALLERY
      </div>
      <div
        style={{
          position: "absolute",
          left: 92,
          top: 162,
          width: 1720,
          fontSize: 132,
          lineHeight: 0.86,
          fontWeight: 960,
          textTransform: "uppercase",
        }}
      >
        Copy prompt.
        <br />
        Paste in Pencil.
      </div>
      <div
        style={{
          position: "absolute",
          left: 92,
          right: 92,
          bottom: 156,
          height: 360,
        }}
      >
        {prompts.map((prompt, index) => {
          const p = fade(frame, index * 9, index * 9 + 18);
          return (
            <div
              key={prompt}
              style={{
                position: "absolute",
                left: [0, 420, 910, 1260][index],
                top: [96, 0, 142, 42][index],
                width: [470, 560, 430, 390][index],
                padding: "26px 30px",
                borderRadius: CARD_RADIUS,
                background: index === 1 ? brand.yellow : "rgba(255,255,255,0.1)",
                color: index === 1 ? brand.ink : brand.paper,
                border: index === 1 ? "none" : "1px solid rgba(255,255,255,0.15)",
                opacity: p,
                transform: `translateY(${interpolate(p, [0, 1], [88, 0])}px) rotate(${[-4, 2, -2, 5][index]}deg)`,
                boxShadow: index === 1 ? "0 28px 90px rgba(246,214,74,0.18)" : "none",
                fontSize: 30,
                lineHeight: 1.16,
                fontWeight: 840,
              }}
            >
              {prompt}
              <div
                style={{
                  marginTop: 14,
                  width: 130,
                  height: 36,
                  borderRadius: 18,
                  background: index === 1 ? brand.ink : brand.paper,
                  color: index === 1 ? brand.paper : brand.ink,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 900,
                }}
              >
                COPY
              </div>
            </div>
          );
        })}
      </div>
      <Caption>Agent-driven design starts with plain language</Caption>
    </AbsoluteFill>
  );
};

const SyncScene: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = interpolate(Math.sin(frame / 5), [-1, 1], [0.55, 1]);
  return (
    <AbsoluteFill style={lightPage}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(90,140,255,0.14), transparent 44%, rgba(246,214,74,0.2))",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 104,
          top: 84,
          fontSize: 34,
          color: brand.muted,
          fontWeight: 880,
        }}
      >
        DESIGN ↔ CODE
      </div>
      <div
        style={{
          position: "absolute",
          left: 104,
          top: 152,
          width: 1060,
          fontSize: 90,
          lineHeight: 1,
          fontWeight: 960,
        }}
      >
        Keep the canvas and codebase in sync.
      </div>
      <div
        style={{
          position: "absolute",
          left: 104,
          right: 104,
          bottom: 150,
          display: "grid",
          gridTemplateColumns: "1fr 180px 1fr",
          alignItems: "center",
          gap: 26,
        }}
      >
        <Panel title="Canvas" frame={frame} mode="canvas" />
        <div
          style={{
            height: 180,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: brand.ink,
            fontSize: 80,
            fontWeight: 950,
            opacity: pulse,
          }}
        >
          ↔
        </div>
        <Panel title="Code" frame={frame} mode="code" />
      </div>
      <Caption dark={false}>Design files live with the project</Caption>
    </AbsoluteFill>
  );
};

const Panel: React.FC<{ title: string; frame: number; mode: "canvas" | "code" }> = ({
  title,
  frame,
  mode,
}) => (
  <div
    style={{
      height: 430,
      borderRadius: CARD_RADIUS,
      background: mode === "canvas" ? brand.white : brand.ink,
      color: mode === "canvas" ? brand.ink : brand.paper,
      boxShadow: "0 30px 100px rgba(8,8,8,0.14)",
      overflow: "hidden",
      border: `1px solid ${mode === "canvas" ? brand.line : "rgba(255,255,255,0.12)"}`,
    }}
  >
    <div
      style={{
        height: 64,
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        borderBottom: `1px solid ${mode === "canvas" ? brand.line : "rgba(255,255,255,0.12)"}`,
        fontSize: 24,
        fontWeight: 880,
      }}
    >
      {title}
    </div>
    <div style={{ padding: 30 }}>
      {mode === "canvas" ? (
        <div style={{ position: "relative", height: 300 }}>
          {[brand.yellow, brand.blue, brand.green].map((color, index) => {
            const p = fade(frame, index * 8, index * 8 + 16);
            return (
              <div
                key={color}
                style={{
                  position: "absolute",
                  left: 26 + index * 128,
                  top: 36 + index * 32,
                  width: 180,
                  height: 100,
                  borderRadius: CARD_RADIUS,
                  background: color,
                  border: `3px solid ${brand.ink}`,
                  opacity: p,
                  transform: `translateY(${interpolate(p, [0, 1], [42, 0])}px)`,
                }}
              />
            );
          })}
        </div>
      ) : (
        <div style={{ fontSize: 24, lineHeight: 1.55, fontFamily: "Menlo, Monaco, Consolas, monospace" }}>
          {[
            "export const Hero = () => {",
            "  return <section>",
            "    <Button variant=\"primary\" />",
            "  </section>",
            "}",
          ].map((line, index) => (
            <div
              key={line}
              style={{
                opacity: fade(frame, index * 6, index * 6 + 16),
                color: index === 2 ? brand.yellow : "rgba(244,241,232,0.86)",
              }}
            >
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

const DistributionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const channels = [
    ["Desktop", "Native canvas performance"],
    ["Extension", "Cursor, VS Code, Windsurf"],
    ["CLI", "AI-powered design in terminal"],
  ];
  return (
    <AbsoluteFill style={darkPage}>
      <CanvasGrid />
      <div style={{ position: "absolute", left: 104, top: 98 }}>
        <div style={{ fontSize: 34, color: brand.yellow, fontWeight: 880 }}>
          THREE WAYS IN
        </div>
        <div style={{ marginTop: 18, width: 900, fontSize: 92, lineHeight: 1, fontWeight: 960 }}>
          Canvas, editor,
          <br />
          terminal.
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 104,
          right: 104,
          bottom: 150,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 24,
        }}
      >
        {channels.map(([name, body], index) => {
          const p = spring({
            frame: frame - index * 8,
            fps: 30,
            config: { damping: 16, mass: 0.58 },
          });
          return (
            <div
              key={name}
              style={{
                height: 300,
                borderRadius: CARD_RADIUS,
                padding: 32,
                background: index === 1 ? brand.paper : "rgba(255,255,255,0.1)",
                color: index === 1 ? brand.ink : brand.paper,
                border: index === 1 ? "none" : "1px solid rgba(255,255,255,0.15)",
                transform: `translateY(${interpolate(p, [0, 1], [80, 0])}px)`,
                opacity: p,
              }}
            >
              <div style={{ fontSize: 42, fontWeight: 930 }}>{name}</div>
              <div style={{ marginTop: 18, fontSize: 28, lineHeight: 1.25, color: index === 1 ? brand.graphite : "rgba(244,241,232,0.74)" }}>
                {body}
              </div>
              {name === "CLI" && (
                <div
                  style={{
                    marginTop: 36,
                    padding: "18px 20px",
                    borderRadius: 14,
                    background: brand.ink,
                    color: brand.yellow,
                    fontFamily: "Menlo, Monaco, Consolas, monospace",
                    fontSize: 20,
                  }}
                >
                  npm i -g @pencil.dev/cli
                </div>
              )}
            </div>
          );
        })}
      </div>
      <Caption>Desktop, extension, and CLI workflows</Caption>
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const title = spring({ frame, fps: 30, config: { damping: 18, mass: 0.7 } });
  const facets = ["Canvas", "Extension", "CLI"];
  return (
    <AbsoluteFill style={lightPage}>
      <CanvasGrid dark={false} />
      <div
        style={{
          position: "absolute",
          top: 84,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 22,
          opacity: fade(frame, 0, 16),
        }}
      >
        <Logo light />
        <div style={{ fontSize: 38, fontWeight: 930 }}>{brand.name}</div>
      </div>
      {[
        { left: 132, top: 258, width: 260, height: 174, label: "Figma", color: brand.yellow, delay: 12 },
        { left: 1454, top: 236, width: 302, height: 198, label: "React", color: brand.blue, delay: 18 },
        { left: 242, top: 660, width: 250, height: 152, label: "Native", color: brand.green, delay: 24 },
        { left: 1404, top: 646, width: 292, height: 170, label: "Ship", color: brand.ink, delay: 30 },
      ].map((block) => {
        const p = fade(frame, block.delay, block.delay + 18);
        return (
          <div
            key={block.label}
            style={{
              position: "absolute",
              left: block.left,
              top: block.top,
              width: block.width,
              height: block.height,
              borderRadius: CARD_RADIUS,
              background: block.color,
              color: block.color === brand.ink ? brand.paper : brand.ink,
              border: "2px solid rgba(8,8,8,0.16)",
              boxShadow: "0 28px 80px rgba(8,8,8,0.14)",
              padding: 26,
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [46, 0])}px) rotate(${block.left < 900 ? -4 : 4}deg)`,
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 880, opacity: 0.7 }}>
              {block.label}
            </div>
            <div
              style={{
                position: "absolute",
                left: 26,
                right: 26,
                bottom: 26,
                height: 18,
                borderRadius: 9,
                background: block.color === brand.ink ? "rgba(244,241,232,0.28)" : "rgba(8,8,8,0.18)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: block.label === "Ship" ? "88%" : "64%",
                  height: "100%",
                  borderRadius: 9,
                  background: block.color === brand.ink ? brand.yellow : brand.ink,
                }}
              />
            </div>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 228,
          width: 1080,
          marginLeft: -540,
          textAlign: "center",
          fontSize: 116,
          lineHeight: 0.92,
          fontWeight: 960,
          opacity: title,
          transform: `translateY(${interpolate(title, [0, 1], [84, 0])}px)`,
        }}
      >
        Full canvas
        <br />
        power.
        <div
          style={{
            marginTop: 34,
            fontSize: 50,
            lineHeight: 1.12,
            fontWeight: 780,
            color: brand.graphite,
          }}
        >
          Native code flow.
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 604,
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          opacity: fade(frame, 22, 42),
        }}
      >
        {facets.map((facet) => (
          <div
            key={facet}
            style={{
              padding: "14px 22px",
              borderRadius: 999,
              border: `2px solid ${brand.ink}`,
              background: brand.paper,
              color: brand.ink,
              fontSize: 24,
              fontWeight: 860,
            }}
          >
            {facet}
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 126,
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          opacity: fade(frame, 26, 46),
        }}
      >
        <div
          style={{
            padding: "26px 58px",
            borderRadius: CARD_RADIUS,
            background: brand.ink,
            color: brand.paper,
            fontSize: 34,
            fontWeight: 920,
          }}
        >
          Download Pencil
        </div>
        <div style={{ color: brand.graphite, fontSize: 31, fontWeight: 820 }}>
          pencil.dev
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const PromoVideo2: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={darkPage}>
      <Sequence durationInFrames={72}>
        <Hero />
      </Sequence>
      <Sequence from={72} durationInFrames={78}>
        <IDEScene />
      </Sequence>
      <Sequence from={150} durationInFrames={76}>
        <PromptScene />
      </Sequence>
      <Sequence from={226} durationInFrames={86}>
        <SyncScene />
      </Sequence>
      <Sequence from={312} durationInFrames={80}>
        <DistributionScene />
      </Sequence>
      <Sequence from={392} durationInFrames={durationInFrames - 392}>
        <EndCard />
      </Sequence>
    </AbsoluteFill>
  );
};
