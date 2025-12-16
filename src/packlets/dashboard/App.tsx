import {
  Box,
  ChakraProvider,
  Container,
  Heading,
  VStack,
} from "@chakra-ui/react";
import { useStore } from "@nanostores/react";
import { FunctionComponent } from "react";
import { PrintRender } from "../print/Render";
import { Descriptor } from "./Descriptor";
import { DiameterInput } from "./input/Diameter";
import { InvertInput } from "./input/Invert";
import { TagIdInput } from "./input/TagId";
import { TypeInput } from "./input/Type";
import { UrlInput } from "./input/Url";
import { embeddedModeAtom } from "./inputAtom";

export const App: FunctionComponent = () => {
  const embeddedMode = useStore(embeddedModeAtom);
  return (
    <ChakraProvider>
      <Container maxW="container.lg" py={embeddedMode ? 4 : 12}>
        {embeddedMode ? null : (
          <>
            <Heading>Asset Label Generator</Heading>
            <VStack spacing={6} alignItems={"start"} py={6}>
              <TypeInput />
              <TagIdInput />
              <UrlInput />
              <InvertInput />
              <DiameterInput />
            </VStack>
          </>
        )}
        <Descriptor />
        <Box pt={embeddedMode ? 3 : 6}>
          <PrintRender />
        </Box>
      </Container>
    </ChakraProvider>
  );
};
