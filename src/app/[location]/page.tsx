"use client";

import { ActionManager, ExecuteCodeAction, Mesh, VideoTexture } from "@babylonjs/core";
import { ReactNode, use, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

import Image from "next/image";
import { Location } from "../type";
import RequestPermission from "./components/requestPermission";
import SlideHint from "./components/slideHint";
import { createLauncher } from "@/util/createLauncher";
import { createPanaroma } from "@/util/createPanaroma";
import { createScene } from "@/util/createScene";
import { createVideoTexture } from "@/util/createVideoTexture";
import { useAccessStore } from "../store/accessStore";
import { useHintStore } from "../store/hintStore";

export default function Panaroms(): ReactNode {
  const { isPermissionAccess } = useAccessStore();
  const { setHintTrigger } = useHintStore();
  const router = useRouter();
  const canvas = useRef(null);
  const params = useParams();
  const location = params.location as string | undefined;

  useEffect(() => {
    const scene = createScene(canvas.current!, isPermissionAccess);
    const dome = createPanaroma(scene, location);
    let video: { videoPlane: Mesh; videoTexture: VideoTexture } | undefined;
    if (location === "theater") {
      const launcher = createLauncher(scene);
      const actionManager = new ActionManager(scene);
      launcher.actionManager = actionManager;
      launcher.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
          createVideoTexture(scene);
          launcher.dispose(false, true);
        }),
      );
    }

    return () => {
      scene.dispose();
      dome?.dispose(false, true);
      video?.videoPlane.dispose();
      video?.videoTexture.dispose();
    };
  }, [isPermissionAccess, location]);

  return (
    <section
      className="z-100 absolute flex justify-center items-center w-full h-full bg-black py-8"
      onClick={returnToHome}
    >
      <canvas
        id="canvas"
        className="z-0 w-full max-h-full active:border-0 focus:border-0"
        ref={canvas}
        onClick={(e) => e.stopPropagation()}
        onFocus={hideHint}
      ></canvas>

      <Image
        className="drop-shadow-lg absolute top-1 right-2 w-[5dvh] md:w-[3dvw] h-auto hover:cursor-pointer"
        src="/icon/close.svg"
        alt="關閉"
        width={30}
        height={30}
      />

      <SlideHint />
      <RequestPermission />

      <h3 className="absolute top-12 landscape:hidden text-white text-lg md:text-3xl font-bold">
        行動設備建議轉為橫向觀看
      </h3>
    </section>
  );

  function returnToHome() {
    router.push("/");
  }

  function hideHint(e: React.FocusEvent<HTMLCanvasElement, Element>) {
    e.stopPropagation();
    setHintTrigger(true);
  }
}
