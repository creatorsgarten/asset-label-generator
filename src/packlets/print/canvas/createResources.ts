import { createFreeTypeRenderer } from './freeType'
import { loadImage } from './loadImage'

/**
 * Fonts
 */
import interUrl from '@fontsource/inter/files/inter-latin-600-normal.woff2'
import jetbrainsMonoUrl from '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-600-normal.woff2?url'

/**
 * Images
 */
import logoMonochromeUrl from '../assets/logo_monochrome.png'
import logotypeMonochromeUrl from '../assets/logotype_monochrome.png'

export const createResources = async () => {
  const renderer = await createFreeTypeRenderer()
  const jetbrainsMono = await renderer.loadFont(jetbrainsMonoUrl)
  const inter = await renderer.loadFont(interUrl)
  const logo = await loadImage(logoMonochromeUrl)
  const logotype = await loadImage(logotypeMonochromeUrl)
  return {
    fonts: {
      jetbrainsMono,
      inter,
    },
    images: {
      logo,
      logotype,
    },
  }
}
