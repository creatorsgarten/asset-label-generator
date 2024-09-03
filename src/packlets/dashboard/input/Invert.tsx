import { HStack, Switch, Text } from '@chakra-ui/react'
import { inputAtom, useInputAtom } from '../inputAtom'

export const InvertInput = () => {
  const { invert } = useInputAtom()

  return (
    <HStack spacing={3}>
      <Text>Invert</Text>
      <Switch
        size="md"
        isChecked={invert}
        onChange={() => inputAtom.setKey('invert', !invert)}
      />
    </HStack>
  )
}
