import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
} from "remotion";

export const Scene02Feature: React.FC<{
  brand: {
    name: string;
    colors: { primary: string; secondary: string; text: string; textSecondary: string; background: string; surface: string; accent: string };
    font: string;
    features: { title: string; description: string }[];
  };
  scene: {
    headline?: string;
    items?: { title: string; description: string }[];
  };
  duration: number;
}> = ({ brand, scene }) => {
  const frame = useCurrentFrame();
  const features = scene.items || brand.features || [];

  const cards = features.slice(0, 3);
  const cardStart = 8;
  const cardSpacing = 18;

  return (
    <AbsoluteFill
      style={{
        fontFamily: brand.font,
        backgroundColor: brand.colors.background,
        padding: "80px 120px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* Section title */}
      <div
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: brand.colors.primary,
          textTransform: "uppercase",
          letterSpacing: 4,
          marginBottom: 48,
          opacity: interpolate(frame, [0, 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Features
      </div>

      <div style={{ display: "flex", gap: 36, alignItems: "stretch" }}>
        {cards.map((feature, i) => {
          const cardFrame = frame - (cardStart + i * cardSpacing);
          const cardSpring = spring({
            frame: cardFrame,
            fps: 30,
            config: { damping: 14, mass: 0.5 },
          });

          const cardScale = interpolate(cardSpring, [0, 1], [0.85, 1]);
          const cardY = interpolate(cardSpring, [0, 1], [80, 0]);
          const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1]);

          return (
            <div
              key={i}
              style={{
                flex: 1,
                padding: "48px 36px",
                borderRadius: 20,
                background: brand.colors.surface,
                border: `1px solid ${brand.colors.primary}12`,
                transform: `scale(${cardScale}) translateY(${cardY}px)`,
                opacity: cardOpacity,
                display: "flex",
                flexDirection: "column",
                boxShadow: `0 16px 48px ${brand.colors.primary}0A`,
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.secondary})`,
                  marginBottom: 28,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 24,
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                {i === 0 ? "✦" : i === 1 ? "▦" : "⚡"}
              </div>

              <div
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: brand.colors.text,
                  marginBottom: 14,
                  letterSpacing: -0.5,
                  lineHeight: 1.2,
                }}
              >
                {feature.title}
              </div>

              <div
                style={{
                  fontSize: 16,
                  color: brand.colors.textSecondary,
                  lineHeight: 1.65,
                }}
              >
                {feature.description}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
