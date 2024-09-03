import { persistentMap } from '@nanostores/persistent'
import { useStore } from '@nanostores/react'
import { PrintType } from './types'

interface Options {
  type: PrintType
  tagId: string
  diameter: number
  url: string
}

export const inputAtom = persistentMap<Options>(
  'creatorsgarten:assetLabel:input',
  {
    type: 'sticker',
    tagId: 'CG00123',
    diameter: 5,
    url: 'grtn.org/i',
  },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
)

export const useInputAtom = () => useStore(inputAtom)