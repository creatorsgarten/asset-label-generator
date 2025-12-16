import { FunctionComponent, useEffect, useRef, useState } from "react";
import { useInputAtom } from "../dashboard/inputAtom";
import { DrawingSerializer } from "../drawing-serializer";
import { allowDraggingOut } from "./canvas/allowDraggingOut";
import { drawFlag } from "./canvas/drawFlag";
import { drawMini } from "./canvas/drawMini";
import { drawSticker } from "./canvas/drawSticker";
import "./render.css";

export const PrintRender: FunctionComponent = () => {
  const { type, diameter, tagId, url, invert } = useInputAtom();
  const canvasRef = useRef(null);
  const [drawingSerializer] = useState(() => new DrawingSerializer());

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current as HTMLCanvasElement;
    allowDraggingOut(canvas, () => `${tagId || "image"}.png`);

    const ctx = canvas.getContext("2d")!;
    const request = drawingSerializer.acquireAndRun(async () => {
      if (type === "sticker") {
        await drawSticker(canvas, ctx, tagId, url, invert);
      } else if (type === "flag") {
        await drawFlag(canvas, ctx, tagId, url, invert, diameter);
      } else if (type === "mini") {
        await drawMini(canvas, ctx, tagId, url, invert);
      }
    });
    return () => {
      request.cancel();
    };
  }, [type, tagId, canvasRef, diameter, url, invert]);

  return <canvas ref={canvasRef} />;
};
