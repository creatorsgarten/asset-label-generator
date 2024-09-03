import { FunctionComponent, useEffect, useRef } from 'react'
import { useInputAtom } from '../dashboard/inputAtom'
import { allowDraggingOut } from './canvas/allowDraggingOut'
import { drawFlag } from './canvas/drawFlag'
import { drawSticker } from './canvas/drawSticker'

import './render.css'

export const PrintRender: FunctionComponent = () => {
  const { type, diameter, tagId, url, invert } = useInputAtom()
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current as HTMLCanvasElement

    allowDraggingOut(canvas, () => `${tagId || 'image'}.png`)

    const ctx = canvas.getContext('2d')!

    if (type === 'sticker') drawSticker(canvas, ctx, tagId, url, invert)
    else if (type === 'flag')
      drawFlag(canvas, ctx, tagId, url, invert, diameter)
  }, [type, tagId, canvasRef, diameter, url, invert])

  return <canvas ref={canvasRef} />
}
