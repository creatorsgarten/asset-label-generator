import { Text } from '@chakra-ui/react'
import { resolveUrlByTagId } from '../print/constants'
import { useInputAtom } from './inputAtom'

export const Descriptor = () => {
  const { tagId, url } = useInputAtom()

  return (
    <Text fontSize={'sm'}>
      Tag ID <b>{tagId}</b> will be created with QR code that goes to{' '}
      <b>{resolveUrlByTagId(url, tagId)}</b>
    </Text>
  )
}
