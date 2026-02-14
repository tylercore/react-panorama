import { PhotoDome, Scene } from "@babylonjs/core";

export const createPanaroma = (scene: Scene | null, location: string | undefined) => {
  if (!scene) return null;
  if (location?.length === 0) return null;
  const imageSrc = `/panaroms/${location}.webp`;

  //photoDome
  const dome = new PhotoDome(
    "dome",
    imageSrc,
    {
      resolution: 64,
      size: 400,
    },
    scene,
  );

  return dome;
};
