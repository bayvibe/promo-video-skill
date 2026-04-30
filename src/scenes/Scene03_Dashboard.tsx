import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
} from "remotion";

export const Scene03Dashboard: React.FC<{
  brand: {
    name: string;
    colors: { primary: string; secondary: string; text: string; textSecondary: string; background: string; surface: string; accent: string };
    font: string;
  };
  scene: {
    headline?: string;
    items?: { title: string; description: string }[];
  };
  duration: number;
}> = ({ brand }) => {
  const frame = useCurrentFrame();

  const dashScale = spring({
    frame,
    fps: 30,
    config: { damping: 14, mass: 0.6 },
  });

  return (
    <AbsoluteFill
      style={{
        fontFamily: brand.font,
        backgroundColor: brand.colors.background,
        padding: "60px 100px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* Full-width dashboard mockup */}
      <div
        style={{
          width: "100%",
          borderRadius: 16,
          overflow: "hidden",
          background: brand.colors.surface,
          border: `1px solid ${brand.colors.primary}12`,
          transform: `scale(${dashScale}) translateY(${interpolate(dashScale, [0, 1], [40, 0])}px)`,
          boxShadow: `0 24px 64px ${brand.colors.primary}10`,
        }}
      >
        {/* Title bar */}
        <div
          style={{
            height: 44,
            background: brand.colors.surface,
            borderBottom: `1px solid ${brand.colors.primary}10`,
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            gap: 8,
          }}
        >
          {["#EF4444", "#F59E0B", "#22C55E"].map((c) => (
            <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
          ))}
          <div style={{ marginLeft: 12, fontSize: 13, color: brand.colors.textSecondary }}>
            preview — YouWare Dashboard
          </div>
        </div>

        <div style={{ padding: 24, display: "flex", gap: 24 }}>
          {/* Left: main chart area */}
          <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Hero banner */}
            <div
              style={{
                height: 160,
                borderRadius: 14,
                background: `linear-gradient(135deg, ${brand.colors.primary}20, ${brand.colors.secondary}15)`,
                padding: "28px 32px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: interpolate(frame, [10, 40], [0, 220], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                  height: 28,
                  borderRadius: 6,
                  background: `${brand.colors.text}20`,
                  marginBottom: 14,
                }}
              />
              <div
                style={{
                  width: interpolate(frame, [20, 50], [0, 340], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                  height: 16,
                  borderRadius: 4,
                  background: `${brand.colors.text}10`,
                }}
              />
            </div>

            {/* Chart */}
            <div
              style={{
                flex: 1,
                minHeight: 200,
                borderRadius: 14,
                background: brand.colors.background,
                border: `1px solid ${brand.colors.primary}08`,
                padding: 20,
                display: "flex",
                alignItems: "flex-end",
                gap: 10,
              }}
            >
              {[55, 80, 45, 90, 65, 75, 85, 50, 70, 95, 60, 78, 88, 62].map((h, i) => {
                const progress = interpolate(frame, [30 + i * 3, 50 + i * 3], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${h * progress}%`,
                      minHeight: 4,
                      borderRadius: 6,
                      background: `linear-gradient(180deg, ${brand.colors.primary}, ${brand.colors.secondary})`,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Right: stat cards */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
            {[{ label: "Visitors", value: "12,847", pct: 85 },
              { label: "Conversions", value: "3,291", pct: 65 },
              { label: "Revenue", value: "$48.2K", pct: 92 },
              { label: "Active Users", value: "1,024", pct: 70 },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  padding: "20px 22px",
                  borderRadius: 12,
                  background: brand.colors.background,
                  border: `1px solid ${brand.colors.primary}08`,
                  opacity: interpolate(frame, [20 + i * 8, 32 + i * 8], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              >
                <div style={{ fontSize: 13, color: brand.colors.textSecondary, marginBottom: 6 }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, color: brand.colors.text, marginBottom: 10 }}>
                  {stat.value}
                </div>
                <div
                  style={{
                    height: 6,
                    borderRadius: 3,
                    background: `${brand.colors.primary}15`,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${stat.pct * interpolate(frame, [25 + i * 8, 40 + i * 8], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      })}%`,
                      height: "100%",
                      borderRadius: 3,
                      background: `linear-gradient(90deg, ${brand.colors.primary}, ${brand.colors.secondary})`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
