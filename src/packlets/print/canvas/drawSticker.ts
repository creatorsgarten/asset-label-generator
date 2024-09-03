import { resolveUrlByTagId } from '../constants'
import { createQr } from './createQr'
import { createResources } from './createResources'
import { createGlyphFlipper } from './freeType'
import { loadImage } from './loadImage'

import customQrInvertedUrl from '../assets/custom_qr_inverted.png'

export const drawSticker = async (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  tagId: string
) => {
  /**
   * Prepare the canvas
   */
  canvas.width = 112
  canvas.height = 174
  canvas.dataset.tape = 'gold/black'
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, 112, 174)
  ctx.fillStyle = 'black'

  const qr = createQr(resolveUrlByTagId(tagId), 3, 3)
  const xb = Math.floor((canvas.width - qr.size) / 2)

  qr.draw(ctx, xb, 1, { invert: true })

  const [customQr, { fonts, images }] = await Promise.all([
    loadImage(customQrInvertedUrl),
    createResources(),
  ])
  ctx.drawImage(customQr, xb + 9, 1 + 9)

  ctx.fillRect(xb, 1 + qr.size, qr.size, 18)
  {
    const osc = new OffscreenCanvas(canvas.width, canvas.height)
    const osctx = osc.getContext('2d')!
    await fonts.jetbrainsMono
      .withSize(19, (_code, char, glyph) => {
        if (char === '0') {
          const { flip } = createGlyphFlipper(glyph)
          flip(3, 6)
          flip(3, 7)
        }
      })
      .draw(osctx, tagId, 11, 116, { letterSpacing: 2 })
    osctx.globalCompositeOperation = 'source-in'
    osctx.fillStyle = 'white'
    osctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(osc, 0, 0)
  }

  ctx.drawImage(
    images.logotype,
    Math.floor((canvas.width - images.logotype.width) / 2),
    xb + qr.size + 19
  )
  {
    ctx.save()
    ctx.fillStyle = 'white'
    ctx.fillRect(xb, 1, 1, 2)
    ctx.fillRect(xb, 1, 2, 1)
    ctx.fillRect(xb + qr.size - 1, 1, 1, 2)
    ctx.fillRect(xb + qr.size - 2, 1, 2, 1)
    ctx.fillRect(xb, 19 + qr.size - 2, 1, 2)
    ctx.fillRect(xb, 19 + qr.size - 1, 2, 1)
    ctx.fillRect(xb + qr.size - 1, 19 + qr.size - 2, 1, 2)
    ctx.fillRect(xb + qr.size - 2, 19 + qr.size - 1, 2, 1)
  }
}
