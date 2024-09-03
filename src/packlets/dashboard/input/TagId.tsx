import { HStack, PinInput, PinInputField, Text } from '@chakra-ui/react'
import { inputAtom, useInputAtom } from '../inputAtom'

export const TagIdInput = () => {
  const { tagId } = useInputAtom()

  return (
    <HStack spacing={3}>
      <Text>Tag ID</Text>
      <PinInput
        type="alphanumeric"
        value={tagId}
        onChange={v => inputAtom.setKey('tagId', v.toUpperCase())}
      >
        <PinInputField />
        <PinInputField />
        <PinInputField />
        <PinInputField />
        <PinInputField />
        <PinInputField />
        <PinInputField />
      </PinInput>
    </HStack>
  )
}
