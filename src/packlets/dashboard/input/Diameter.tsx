import {
  HStack,
  InputGroup,
  InputRightAddon,
  NumberInput,
  NumberInputField,
  Text,
} from '@chakra-ui/react'
import { inputAtom, useInputAtom } from '../inputAtom'

export const DiameterInput = () => {
  const { type, diameter } = useInputAtom()

  if (type == 'sticker') return null

  return (
    <HStack spacing={3}>
      <Text>Cable Diameter</Text>
      <InputGroup>
        <NumberInput
          value={diameter}
          onChange={(_, val) => inputAtom.setKey('diameter', val)}
        >
          <NumberInputField borderRightRadius={0} />
        </NumberInput>
        <InputRightAddon>mm</InputRightAddon>
      </InputGroup>
    </HStack>
  )
}
