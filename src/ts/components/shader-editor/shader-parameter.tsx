import React from 'react'
import styled from 'styled-components'
import RangeSlider from 'ts/components/common/range-slider'
import useStore from 'ts/hooks/use-store'
import { Uniform } from 'ts/model/shader-model'
import { getShaderParameter } from 'ts/model/shader-parameters'

import { textures } from 'ts/model/textures'
import ModalTrigger from '../dialogs/modal-trigger'

const Wrapper = styled.div`
  background-color: #273341;
  padding: 8px 8px;
  border-radius: 3px;
`

const ImageWrapper = ({ src, onAccept }) => {
  return (
    <div onClick={onAccept.bind(null, src)}>
      <img src={src} />
    </div>
  )
}

const ShaderParameter = ({
  type,
  token,
  name = '',
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
          />
        </Wrapper>
      )
    case 'texture': {
      const imagesJSX = textures.map((src) => <ImageWrapper src={src} />)
      return (
        <Wrapper>
          <ModalTrigger trigger={<b>image</b>} onAccept={handleChange}>
            {imagesJSX}
          </ModalTrigger>
        </Wrapper>
      )
    }
    default:
      return null
  }
}

export default ShaderParameter
