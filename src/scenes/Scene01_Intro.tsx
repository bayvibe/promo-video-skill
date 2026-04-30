import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  interpolate,
  spring,
} from "remotion";

export const Scene01Intro: React.FC<{
  brand: {
    name: string;
    tagline: string;
    colors: { primary: string; secondary: string; text: string; textSecondary: string; background: string; surface: string; accent: string };
    font: string;
    logoUrl: string;
  };
  scene: { headline?: string; subtext?: string };
  duration: number;
}> = ({ brand, scene }) => {
  const frame = useCurrentFrame();
  const headline = scene.headline || brand.name;
  const subtext = scene.subtext || brand.tagline;

  const logoScale = spring({
    frame,
    fps: 30,
    config: { damping: 14, mass: 0.5 },
  });

  const nameY = spring({
    frame: frame - 8,
    fps: 30,
    config: { damping: 16, mass: 0.5 },
  });

  const taglineOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const taglineY = interpolate(taglineOpacity, [0, 1], [16, 0]);

  return (
    <AbsoluteFill
      style={{
        fontFamily: brand.font,
        backgroundColor: brand.colors.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Subtle radial glow */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${brand.colors.primary}08, transparent 60%)`,
        }}
      />

      {/* Logo mark */}
      {brand.logoUrl && (
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.secondary})`,
            transform: `scale(${logoScale})`,
            marginBottom: 32,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: `0 8px 30px ${brand.colors.primary}20`,
          }}
        >
          <Img
            src={brand.logoUrl}
            style={{ width: 48, height: 48, objectFit: "contain" }}
            alt=""
          />
        </div>
      )}

      {/* Brand name */}
      <div
        style={{
          fontSize: 72,
          fontWeight: 800,
          color: brand.colors.text,
          letterSpacing: -2,
          transform: `translateY(${interpolate(nameY, [0, 1], [30, 0])}px)`,
          opacity: interpolate(nameY, [0, 1], [0, 1]),
        }}
      >
        {headline}
      </div>

      {/* Tagline */}
      <div
        style={{
          marginTop: 20,
          fontSize: 22,
          color: brand.colors.textSecondary,
          maxWidth: 600,
          textAlign: "center",
          lineHeight: 1.5,
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
        }}
      >
        {subtext}
      </div>
    </AbsoluteFill>
  );
};
