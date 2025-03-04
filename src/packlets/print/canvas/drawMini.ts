import { resolveUrlByTagId } from '../constants'
import { createQr } from './createQr'
import { loadImage } from './loadImage'

import logotypeMiniUrl from '../assets/logotype_mini.png'

export const drawMini = async (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  tagId: string,
  url: string,
  invert: boolean
) => {
  /**
   * Prepare the canvas
   */
  canvas.width = 80
  canvas.height = 112
  canvas.dataset.tape = 'gold/black'

  if (invert) ctx.filter = 'invert(1)'

  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, 80, 112)
  ctx.fillStyle = 'black'

  // Create QR with 2px module size and 1px padding
  const qr = createQr(resolveUrlByTagId(url, tagId), 2, 1)

  // Position QR code at the top with some margin
  const xb = Math.floor((canvas.width - qr.size) / 2)
  const yb = 8 // Top margin

  qr.draw(ctx, xb, yb, { invert: true })

  // Load custom QR logo and logotype
  const [logotypeMini] = await Promise.all([loadImage(logotypeMiniUrl)])

  // Draw logotype below QR code
  const logotypeY = yb + qr.size + 5 // Position below QR with margin
  ctx.drawImage(logotypeMini, 9, logotypeY)
}
