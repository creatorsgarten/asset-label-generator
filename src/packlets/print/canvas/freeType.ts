import FreeTypeInit, { FT_GlyphSlotRec } from 'freetype-wasm/dist/freetype.js'
import wasmUrl from 'freetype-wasm/dist/freetype.wasm?url'

async function initializeFreeType() {
  const FreeType = await FreeTypeInit({
    locateFile: () => wasmUrl,
  })
  return FreeType
}

export async function createFreeTypeRenderer() {
  const FreeType = await initializeFreeType()
  const loadFont = async (url: string, { forceAutoHint = true } = {}) => {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to load font')
    }
    const font = await response.arrayBuffer()
    const [face] = FreeType.LoadFontFromBytes(new Uint8Array(font))
    const withSize = (
      size: number,
      handleNewGlyph = (
        _code: number,
        _char: string,
        _glyph: FT_GlyphSlotRec
        // biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
      ) => {}
    ) => {
      const cache = new Map<
        string,
        { glyph: FT_GlyphSlotRec; bitmap: ImageBitmap | null }
      >()
      async function updateCache(str: string) {
        FreeType.SetFont(face.family_name, face.style_name)
        FreeType.SetCharmap(FreeType.FT_ENCODING_UNICODE)
        FreeType.SetPixelSize(0, size)

        // Get char codes without bitmaps
        const codes = []
        for (const char of new Set(str)) {
          const point = char.codePointAt(0)
          if (!cache.has(char) && point !== undefined) {
            codes.push(point)
          }
        }

        // Populate missing bitmaps
        const newGlyphs = FreeType.LoadGlyphs(
          codes,
          FreeType.FT_LOAD_RENDER |
            FreeType.FT_LOAD_MONOCHROME |
            FreeType.FT_LOAD_TARGET_MONO |
            (forceAutoHint ? FreeType.FT_LOAD_FORCE_AUTOHINT : 0)
        )
        for (const [code, glyph] of newGlyphs) {
          const char = String.fromCodePoint(code)
          await Promise.resolve(handleNewGlyph(code, char, glyph))
          cache.set(char, {
            glyph,
            bitmap: glyph.bitmap.imagedata
              ? await createImageBitmap(glyph.bitmap.imagedata)
              : null,
          })
        }
      }

      const draw = async (
        ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
        str: string,
        offsetx: number,
        offsety: number,
        { letterSpacing = 0 } = {}
      ) => {
        await updateCache(str)
        let prev = null
        for (const char of str) {
          const { glyph, bitmap } = cache.get(char) || {}
          if (glyph) {
            // Kerning
            if (prev) {
              const kerning = FreeType.GetKerning(
                prev.glyph_index,
                glyph.glyph_index,
                0
              )
              offsetx += kerning.x >> 6
            }

            if (bitmap) {
              ctx.drawImage(
                bitmap,
                offsetx + glyph.bitmap_left,
                offsety - glyph.bitmap_top
              )
            }

            offsetx += glyph.advance.x >> 6
            offsetx += letterSpacing
            prev = glyph
          }
        }
      }

      const measure = async (str: string, { letterSpacing = 0 } = {}) => {
        await updateCache(str)
        let width = 0
        let prev = null
        for (const char of str) {
          const { glyph } = cache.get(char) || {}
          if (glyph) {
            if (prev) {
              const kerning = FreeType.GetKerning(
                prev.glyph_index,
                glyph.glyph_index,
                0
              )
              width += kerning.x >> 6
              width += letterSpacing
            }
            width += glyph.advance.x >> 6
            prev = glyph
          }
        }
        return width
      }

      const getGlyph = async (char: string) => {
        await updateCache(char)
        return cache.get(char)
      }
      return { draw, measure, getGlyph }
    }
    return { withSize }
  }
  return { loadFont }
}

export function createGlyphFlipper(glyph: FT_GlyphSlotRec) {
  const flip = (x: number, y: number) => {
    const imageData = glyph.bitmap.imagedata
    if (!imageData) return
    const index = (y * imageData.width + x) * 4
    imageData.data[index + 3] = 255 - imageData.data[index + 3]
  }
  return { flip }
}
