import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  spring,
} from "remotion";
import { z } from "zod";
import { Scene01Intro } from "./scenes/Scene01_Intro";
import { Scene02Feature } from "./scenes/Scene02_Feature";
import { Scene03Dashboard } from "./scenes/Scene03_Dashboard";
import { Scene04CTA } from "./scenes/Scene04_CTA";

export const promoSchema = z.object({
  brand: z.object({
    name: z.string(),
    tagline: z.string(),
    colors: z.object({
      primary: z.string(),
      secondary: z.string(),
      background: z.string(),
      surface: z.string(),
      text: z.string(),
      textSecondary: z.string(),
      accent: z.string(),
    }),
    font: z.string(),
    logoUrl: z.string(),
    features: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
      }),
    ),
    cta: z.object({
      headline: z.string(),
      buttonText: z.string(),
      url: z.string(),
    }),
  }),
  script: z.object({
    fps: z.number(),
    width: z.number(),
    height: z.number(),
    scenes: z.array(
      z.object({
        id: z.string(),
        duration: z.number(),
        headline: z.string().optional(),
        subtext: z.string().optional(),
        items: z
          .array(
            z.object({
              title: z.string(),
              description: z.string(),
            }),
          )
          .optional(),
        buttonText: z.string().optional(),
        subtitle: z.string().optional(),
      }),
    ),
  }),
});

type PromoProps = z.infer<typeof promoSchema>;

const sceneComponents: Record<
  string,
  React.FC<{
    brand: PromoProps["brand"];
    scene: PromoProps["script"]["scenes"][0];
    duration: number;
  }>
> = {
  intro: Scene01Intro,
  feature: Scene02Feature,
  dashboard: Scene03Dashboard,
  cta: Scene04CTA,
};

export const PromoVideo: React.FC<PromoProps> = ({ brand, script }) => {
  const frame = useCurrentFrame();
  const totalDuration = script.scenes.reduce(
    (sum: number, s: { duration: number }) => sum + s.duration,
    0,
  );

  const globalOpacity = interpolate(
    frame,
    [totalDuration - 20, totalDuration],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Figure out which scene we're in and the local frame
  let sceneOffset = 0;
  let activeSubtitle = "";
  let localFrame = 0;
  for (const scene of script.scenes) {
    if (frame >= sceneOffset && frame < sceneOffset + scene.duration) {
      activeSubtitle = scene.subtitle || "";
      localFrame = frame - sceneOffset;
      break;
    }
    sceneOffset += scene.duration;
  }

  const subtitleSpring = spring({
    frame: localFrame,
    fps: script.fps,
    config: { damping: 20, mass: 0.5 },
  });

  let offset = 0;
  const sequences = script.scenes.map((scene) => {
    const from = offset;
    offset += scene.duration;
    const Component = sceneComponents[scene.id];
    return (
      <Sequence key={scene.id} from={from} durationInFrames={scene.duration}>
        {Component ? (
          <Component brand={brand} scene={scene} duration={scene.duration} />
        ) : null}
      </Sequence>
    );
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: brand.colors.background,
        opacity: globalOpacity,
      }}
    >
      {sequences}

      {/* Global subtitle bar */}
      {activeSubtitle && (
        <div
          style={{
            position: "absolute",
            bottom: 50,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              padding: "18px 48px",
              borderRadius: 14,
              background: `${brand.colors.text}CC`,
              color: brand.colors.background,
              fontSize: 32,
              fontWeight: 500,
              fontFamily: brand.font,
              letterSpacing: 0.5,
              transform: `translateY(${interpolate(subtitleSpring, [0, 1], [24, 0])}px)`,
              opacity: interpolate(subtitleSpring, [0, 1], [0, 1]),
            }}
          >
            {activeSubtitle}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
