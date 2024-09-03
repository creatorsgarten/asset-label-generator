import { resolveUrlByTagId } from '../constants'
import { createQr } from './createQr'
import { createResources } from './createResources'
import { loadImage } from './loadImage'

import customQrUrl from '../assets/custom_qr.png'

export const drawFlag = async (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  tagId: string,
  url: string,
  invert: boolean,
  diameter: number
) => {
  const wrapAround = Math.ceil(20 * diameter)

  /**
   * Prepare the canvas
   */
  const width = 112 * 2 + wrapAround
  const height = 112
  canvas.width = width
  canvas.height = height
  canvas.dataset.tape = 'black/white'

  if (invert) ctx.filter = 'invert(1)'

  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = 'black'

  const qr = createQr(resolveUrlByTagId(url, tagId), 3, 3)

  const [customQr, { images, fonts }] = await Promise.all([
    loadImage(customQrUrl),
    createResources(),
  ])

  const { logo } = images
  ctx.drawImage(
    logo,
    canvas.width - logo.width - 20,
    Math.floor((canvas.height - logo.height) / 2)
  )

  const yb = Math.floor((canvas.height - qr.size) / 2)
  qr.draw(ctx, yb, yb)
  ctx.drawImage(customQr, yb + 9, yb + 9)

  ctx.fillStyle = '#fb1'
  ctx.fillRect(112, 0, 1, canvas.height)
  ctx.fillRect(canvas.width - 112 - 1, 0, 1, canvas.height)

  ctx.translate(112, 112)
  ctx.rotate(-Math.PI / 2)
  await fonts.jetbrainsMono
    .withSize(19)
    .draw(ctx, tagId, 12, 20, { letterSpacing: 2 })
}
