import { Composition } from "remotion";
import { PromoVideo, promoSchema } from "./PromoVideo";
import { PromoVideo1 } from "./promovideo1/PromoVideo1";
import { PromoVideo2 } from "./promovideo2/PromoVideo2";
import brandData from "./data/brand.json";
import scriptData from "./data/script.json";

const totalDuration = scriptData.scenes.reduce(
  (sum: number, s: { duration: number }) => sum + s.duration,
  0,
);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PromoVideo"
        component={PromoVideo}
        durationInFrames={totalDuration}
        fps={scriptData.fps}
        width={scriptData.width}
        height={scriptData.height}
        schema={promoSchema}
        defaultProps={{
          brand: brandData,
          script: scriptData,
        }}
      />
      <Composition
        id="PromoVideo1"
        component={PromoVideo1}
        durationInFrames={540}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="PromoVideo2"
        component={PromoVideo2}
        durationInFrames={510}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
