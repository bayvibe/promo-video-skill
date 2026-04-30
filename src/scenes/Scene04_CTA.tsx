import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
} from "remotion";

export const Scene04CTA: React.FC<{
  brand: {
    name: string;
    colors: { primary: string; secondary: string; text: string; textSecondary: string; background: string; surface: string; accent: string };
    font: string;
    cta: { headline: string; buttonText: string; url: string };
  };
  scene: { headline?: string; buttonText?: string };
  duration: number;
}> = ({ brand, scene, duration }) => {
  const frame = useCurrentFrame();
  const headline = scene.headline || brand.cta.headline || "Your idea. AI builds it.";
  const buttonText = scene.buttonText || brand.cta.buttonText || "Get Started";

  const headlineScale = spring({
    frame,
    fps: 30,
    config: { damping: 12, mass: 0.5 },
  });

  const buttonScale = spring({
    frame: frame - 18,
    fps: 30,
    config: { damping: 10, mass: 0.4 },
  });

  const brandOpacity = interpolate(frame, [35, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const shimmer = interpolate(frame, [25, duration - 10], [-200, 1200]);

  const parts = headline.split(".");

  return (
    <AbsoluteFill
      style={{
        fontFamily: brand.font,
        backgroundColor: brand.colors.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${brand.colors.primary}08, transparent 60%)`,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: 50,
          transform: `scale(${headlineScale})`,
        }}
      >
        <div
          style={{
            fontSize: 90,
            fontWeight: 800,
            color: brand.colors.text,
            letterSpacing: -3,
            marginBottom: 8,
          }}
        >
          {parts[0]}.
        </div>
        {parts[1]?.trim() && (
          <div
            style={{
              fontSize: 90,
              fontWeight: 800,
              background: `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.secondary})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: -3,
            }}
          >
            {parts[1].trim()}
          </div>
        )}
      </div>

      {/* CTA button */}
      <div
        style={{
          padding: "24px 72px",
          borderRadius: 16,
          background: `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.secondary})`,
          transform: `scale(${buttonScale})`,
          fontSize: 28,
          fontWeight: 600,
          color: "#fff",
          position: "relative",
          overflow: "hidden",
          boxShadow: `0 8px 40px ${brand.colors.primary}20`,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: shimmer,
            width: 200,
            height: "100%",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
          }}
        />
        {buttonText}
      </div>

      <div
        style={{
          marginTop: 80,
          fontSize: 20,
          color: brand.colors.primary,
          opacity: brandOpacity,
          fontWeight: 500,
          letterSpacing: 6,
          textTransform: "uppercase",
        }}
      >
        {brand.name}
      </div>
    </AbsoluteFill>
  );
};
