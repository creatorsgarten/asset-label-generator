import jetbrainsMonoUrl from "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-600-normal.woff2?url";
import { createFreeTypeRenderer } from "./FreeType";
import "./style.css";

async function main() {
  const renderer = await createFreeTypeRenderer();
  const jetbrainsMono = await renderer.loadFont(jetbrainsMonoUrl);

  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d")!;
  canvas.width = 256;
  canvas.height = 112;
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";

  await jetbrainsMono.withSize(20).draw(ctx, "Creatorsgarten", 10, 30);
}

main();
