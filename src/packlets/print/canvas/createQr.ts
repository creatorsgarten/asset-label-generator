import { qrcodegen } from "../vendor/qrcodegen-v1.8.0";

export function createQr(text: string, scale = 3, pad = 3) {
  const QRC = qrcodegen.QrCode;
  const segments = qrcodegen.QrSegment.makeSegments(text);
  const qr = QRC.encodeSegments(segments, QRC.Ecc.MEDIUM, 3);
  const size = (qr.size + 2 * pad) * scale;
  const draw = (
    ctx: CanvasRenderingContext2D,
    xb = 0,
    yb = 0,
    { invert = false } = {}
  ) => {
    for (let y = 0; y < qr.size + 2 * pad; y++) {
      for (let x = 0; x < qr.size + 2 * pad; x++) {
        if (qr.getModule(x - pad, y - pad) === !invert) {
          ctx.fillRect(xb + x * scale, yb + y * scale, scale, scale);
        }
      }
    }
  };
  return { draw, size };
}
