import interUrl from "@fontsource/inter/files/inter-latin-600-normal.woff2";
import jetbrainsMonoUrl from "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-600-normal.woff2?url";
import { createFreeTypeRenderer, createGlyphFlipper } from "./FreeType";
import { allowDraggingOut } from "./allowDraggingOut";
import { createQr } from "./createQr";
import customQrUrl from "./custom_qr.png";
import customQrInvertedUrl from "./custom_qr_inverted.png";
import { loadImage } from "./loadImage";
import logoMonochromeUrl from "./logo_monochrome.png";
import logotypeMonochromeUrl from "./logotype_monochrome.png";
import "./style.css";

type TemplateArgs = Awaited<ReturnType<typeof createArgs>>;
const templates: Record<string, (args: TemplateArgs) => Promise<void>> = {};

templates.sticker = async (args) => {
  const { canvas, ctx, images, fonts, params, prepare } = args;
  const asset = resolveAsset(params);
  prepare(112, 174, "gold/black");
  const qr = createQr(asset.url, 3, 3);
  const xb = Math.floor((canvas.width - qr.size) / 2);

  qr.draw(ctx, xb, 1, { invert: true });

  const customQr = await loadImage(customQrInvertedUrl);
  ctx.drawImage(customQr, xb + 9, 1 + 9);

  ctx.fillRect(xb, 1 + qr.size, qr.size, 18);
  {
    const osc = new OffscreenCanvas(canvas.width, canvas.height);
    const osctx = osc.getContext("2d")!;
    await fonts.jetbrainsMono
      .withSize(19, (code, char, glyph) => {
        if (char === "0") {
          const { flip } = createGlyphFlipper(glyph);
          flip(3, 6);
          flip(3, 7);
        }
      })
      .draw(osctx, asset.id, 11, 116, { letterSpacing: 2 });
    osctx.globalCompositeOperation = "source-in";
    osctx.fillStyle = "white";
    osctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(osc, 0, 0);
  }

  ctx.drawImage(
    images.logotype,
    Math.floor((canvas.width - images.logotype.width) / 2),
    xb + qr.size + 19
  );
  {
    ctx.save();
    ctx.fillStyle = "white";
    ctx.fillRect(xb, 1, 1, 2);
    ctx.fillRect(xb, 1, 2, 1);
    ctx.fillRect(xb + qr.size - 1, 1, 1, 2);
    ctx.fillRect(xb + qr.size - 2, 1, 2, 1);
    ctx.fillRect(xb, 19 + qr.size - 2, 1, 2);
    ctx.fillRect(xb, 19 + qr.size - 1, 2, 1);
    ctx.fillRect(xb + qr.size - 1, 19 + qr.size - 2, 1, 2);
    ctx.fillRect(xb + qr.size - 2, 19 + qr.size - 1, 2, 1);
  }
};

templates.flag = async (args) => {
  const { canvas, ctx, images, prepare, params, fonts } = args;
  const asset = resolveAsset(params);
  const diameter = +params.diameter || 5;
  const wrapAround = Math.ceil(20 * diameter);
  prepare(112 * 2 + wrapAround, 112, "black/white");
  const qr = createQr(asset.url, 3, 3);
  const { logo } = images;
  ctx.drawImage(
    logo,
    canvas.width - logo.width - 20,
    Math.floor((canvas.height - logo.height) / 2)
  );

  const yb = Math.floor((canvas.height - qr.size) / 2);
  qr.draw(ctx, yb, yb);
  const customQr = await loadImage(customQrUrl);
  ctx.drawImage(customQr, yb + 9, yb + 9);

  ctx.fillStyle = "#fb1";
  ctx.fillRect(112, 0, 1, canvas.height);
  ctx.fillRect(canvas.width - 112 - 1, 0, 1, canvas.height);

  ctx.translate(112, 112);
  ctx.rotate(-Math.PI / 2);
  await fonts.jetbrainsMono
    .withSize(19)
    .draw(ctx, asset.id, 12, 20, { letterSpacing: 2 });
};

async function main() {
  const params = Object.fromEntries(
    new URLSearchParams(window.location.search)
  );
  const availableTemplates = Object.keys(templates);
  if (!availableTemplates.includes(params.template)) {
    const menu = document.createElement("ul");
    for (const template of availableTemplates) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = `?template=${template}`;
      link.textContent = template;
      item.appendChild(link);
      menu.appendChild(item);
    }
    document.body.appendChild(menu);
  } else {
    await templates[params.template](await createArgs(params));
  }
}

async function createResources() {
  const renderer = await createFreeTypeRenderer();
  const jetbrainsMono = await renderer.loadFont(jetbrainsMonoUrl);
  const inter = await renderer.loadFont(interUrl);
  const logo = await loadImage(logoMonochromeUrl);
  const logotype = await loadImage(logotypeMonochromeUrl);
  return {
    fonts: {
      jetbrainsMono,
      inter,
    },
    images: {
      logo,
      logotype,
    },
  };
}

async function createArgs(params: Record<string, string>) {
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  allowDraggingOut(canvas, () => {
    return `${params.id || "image"}.png`;
  });
  const ctx = canvas.getContext("2d")!;
  return {
    ...(await createResources()),
    params,
    canvas,
    ctx,
    prepare(w: number, h: number, paper: "black/white" | "gold/black") {
      canvas.width = w;
      canvas.height = h;
      canvas.dataset.tape = paper;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "black";
    },
  };
}

function resolveAsset(params: Record<string, string>) {
  if (!params.id) {
    return {
      url: `https://youtu.be/dQw4w9WgXcQ`,
      id: "EXAMPLE",
    };
  } else {
    return {
      url: `https://grtn.org/i/${params.id}`,
      id: params.id,
    };
  }
}

main();
