import {
  Box,
  ChakraProvider,
  Container,
  Heading,
  VStack,
} from '@chakra-ui/react'
import { FunctionComponent } from 'react'
import { PrintRender } from '../print/Render'
import { Descriptor } from './Descriptor'
import { DiameterInput } from './input/Diameter'
import { InvertInput } from './input/Invert'
import { TagIdInput } from './input/TagId'
import { TypeInput } from './input/Type'
import { UrlInput } from './input/Url'

export const App: FunctionComponent = () => {
  return (
    <ChakraProvider>
      <Container maxW="container.lg" py={12}>
        <Heading>Asset Label Generator</Heading>
        <VStack spacing={6} alignItems={'start'} py={6}>
          <TypeInput />
          <TagIdInput />
          <UrlInput />
          <InvertInput />
          <DiameterInput />
        </VStack>
        <Descriptor />
        <Box pt={6}>
          <PrintRender />
        </Box>
      </Container>
    </ChakraProvider>
  )
}
