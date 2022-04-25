import React from 'react'
import styled from 'styled-components'
import RangeSlider from 'ts/components/common/range-slider'
import { Uniform } from 'ts/model/shader-model'
import {
  setShaderParameter,
  getShaderParameter,
} from 'ts/model/shader-parameters'

const Wrapper = styled.div`
  background-color: #273341;
  padding: 8px 8px;
  border-radius: 3px;
`

const ShaderParameter = ({
  type,
  token,
  name = '',
}: {
  type: Uniform['type']
  token: string
  name?: string
}): JSX.Element => {
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
          />
        </Wrapper>
      )
    default:
      return null
  }
}

export default ShaderParameter
