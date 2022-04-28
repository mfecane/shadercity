import { ShaderState } from 'ts/hooks/use-store'

export const sortByRating = (a: ShaderState, b: ShaderState) => {
  const bLength = b.likes?.length || 0
  const aLength = a.likes?.length || 0
  if (aLength === bLength) {
    const aSec = a?.updated?.seconds || 0
    const bSec = b?.updated?.seconds || 0
    return bSec - aSec
  }
  return bLength - aLength
}
