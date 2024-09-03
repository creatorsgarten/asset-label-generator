import { HStack, Select, Text } from '@chakra-ui/react'
import { inputAtom, useInputAtom } from '../inputAtom'
import { PrintType } from '../types'

export const TypeInput = () => {
  const { type } = useInputAtom()

  return (
    <HStack spacing={3}>
      <Text>Type</Text>
      <Select
        onChange={e => inputAtom.setKey('type', e.target.value as PrintType)}
        value={type}
      >
        <option value="sticker">Sticker</option>
        <option value="flag">Flag</option>
      </Select>
    </HStack>
  )
}
