import React from 'react'
import styled from 'styled-components'
import RangeSlider from 'ts/components/common/range-slider'
import useStore from 'ts/hooks/use-store'
import { getShaderParameter } from 'ts/model/shader-parameters'
import ImageSelector from 'ts/components/shader-editor/parameters/image-selector'
import CubemapSelector from './cubemap-selector'

const Wrapper = styled.div``

const ShaderParameter: React.FC<{
  type: string
  name: string
}> = ({ name = '', type }) => {
  const {
    state: { currentShader },
  } = useStore()

  const value = currentShader.getUniformValue(name)

  const handleChange = (value: number) => {
    // setShaderParameter(name, value)
    currentShader.setShaderParameter(name, value)
  }

  switch (type) {
    case 'float':
      return (
        <Wrapper>
          <RangeSlider
            label={name}
            value={getShaderParameter(name)}
            onChange={handleChange}
            value={value}
          />
        </Wrapper>
      )
    case 'texture': {
      return (
        <Wrapper>
          <ImageSelector name={name} value={value} onChange={handleChange} />
        </Wrapper>
      )
    }
    case 'cubemap': {
      return (
        <Wrapper>
          <CubemapSelector name={name} value={value} onChange={handleChange} />
        </Wrapper>
      )
    }
    default:
      return null
  }
}

export default ShaderParameter
