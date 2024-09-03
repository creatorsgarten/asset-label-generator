import {
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Text,
} from '@chakra-ui/react'
import { inputAtom, useInputAtom } from '../inputAtom'

export const UrlInput = () => {
  const { url } = useInputAtom()

  return (
    <HStack spacing={3}>
      <Text>URL</Text>
      <InputGroup>
        <InputLeftAddon>https://</InputLeftAddon>
        <Input
          placeholder="Type URL here"
          value={url}
          onChange={e => inputAtom.setKey('url', e.target.value)}
        />
        <InputRightAddon>/:tagId</InputRightAddon>
      </InputGroup>
    </HStack>
  )
}
