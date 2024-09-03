import {
  Box,
  ChakraProvider,
  Container,
  HStack,
  Heading,
  InputGroup,
  InputRightAddon,
  NumberInput,
  NumberInputField,
  PinInput,
  PinInputField,
  Select,
  Text,
  VStack,
} from '@chakra-ui/react'
import { FunctionComponent, useState } from 'react'
import { resolveUrlByTagId } from '../print/constants.ts'
import { PrintRender } from '../print/render'
import { PrintType } from './types'

export const App: FunctionComponent = () => {
  const [type, setType] = useState<PrintType>('sticker')
  const [tagId, setTagId] = useState<string>('CG00123')
  const [diameter, setDiameter] = useState<number>(5)

  return (
    <ChakraProvider>
      <Container maxW="container.lg" py={12}>
        <Heading>Asset Label Generator</Heading>
        <VStack spacing={6} alignItems={'start'} py={6}>
          <HStack spacing={3}>
            <Text>Type</Text>
            <Select
              onChange={e => setType(e.target.value as PrintType)}
              value={type}
            >
              <option value="sticker">Sticker</option>
              <option value="flag">Flag</option>
            </Select>
          </HStack>
          <HStack spacing={3}>
            <Text>Tag ID</Text>
            <PinInput
              type="alphanumeric"
              value={tagId}
              onChange={v => setTagId(v.toUpperCase())}
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
          {type === 'flag' && (
            <HStack spacing={3}>
              <Text>Cable Diameter</Text>
              <InputGroup>
                <NumberInput
                  value={diameter}
                  onChange={(_, val) => setDiameter(val)}
                >
                  <NumberInputField borderRightRadius={0} />
                </NumberInput>
                <InputRightAddon>mm</InputRightAddon>
              </InputGroup>
            </HStack>
          )}
        </VStack>
        <Text fontSize={'sm'}>
          Tag ID <b>{tagId}</b> will be created with QR code that goes to{' '}
          <b>{resolveUrlByTagId(tagId)}</b>
        </Text>
        <Box pt={6}>
          <PrintRender type={type} id={tagId} diameter={diameter} />
        </Box>
      </Container>
    </ChakraProvider>
  )
}
