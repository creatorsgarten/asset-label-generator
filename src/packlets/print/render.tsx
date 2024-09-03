import { FunctionComponent, useEffect, useRef } from 'react'
import { allowDraggingOut } from './canvas/allowDraggingOut'
import { drawFlag } from './canvas/drawFlag'
import { drawSticker } from './canvas/drawSticker'

import './render.css'

interface Props {
  type: 'sticker' | 'flag'
  id: string
  diameter: number
}

export const PrintRender: FunctionComponent<Props> = ({
  type,
  id,
  diameter,
}) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current as HTMLCanvasElement

    allowDraggingOut(canvas, () => `${id || 'image'}.png`)

    const ctx = canvas.getContext('2d')!

    if (type === 'sticker') drawSticker(canvas, ctx, id)
    else if (type === 'flag') drawFlag(canvas, ctx, id, diameter)
  }, [type, id, canvasRef, diameter])

  return <canvas ref={canvasRef} />
}
