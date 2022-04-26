import React from 'react'
import styled from 'styled-components'
import RangeSlider from 'ts/components/common/range-slider'
import useStore from 'ts/hooks/use-store'
import { Uniform } from 'ts/model/shader-model'
import { getShaderParameter } from 'ts/model/shader-parameters'

import { textures } from 'ts/model/textures'
import ModalTrigger from '../dialogs/modal-trigger'
import ImageSelector from './parameters/image-selector'

const Wrapper = styled.div`
  background-color: #273341;
  padding: 8px 8px;
  border-radius: 3px;
`

const ShaderParameter = ({
  type,
  token,
  name = '',
  value,
}: {
  type: Uniform['type']
  token: string
  name?: string
}): JSX.Element => {
  const { setShaderParameter } = useStore()

  const handleChange = (value: number) => {
    setShaderParameter(token, value)
  }

  switch (type) {
    case 'float':
      return (
        <Wrapper>
          <RangeSlider
            label={name}
            value={getShaderParameter(token)}
            onChange={handleChange}
            value={value}
          />
        </Wrapper>
      )
    case 'texture': {
      return (
        <Wrapper>
          <ImageSelector name={token} onChange={handleChange} />
        </Wrapper>
      )
    }
    default:
      return null
  }
}

export default ShaderParameter
