import React, { useState } from 'react'
import styled from 'styled-components'
import ModalTrigger from 'ts/components/dialogs/modal-trigger'
import { cubemaps } from 'ts/resources/cubemaps'

const Inner = styled.div`
  min-width: 400px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 50px;
`

const ImgDiv = styled.div`
  width: 200px;
  height: 200px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
  }
`

const ImageWrapper = ({ onAccept }) => {
  const imagesJSX = cubemaps.map((src, idx) => (
    <ImgDiv key={idx} onClick={onAccept.bind(null, idx)}>
      <img src={src.posX} />
    </ImgDiv>
  ))
  return <Inner>{imagesJSX}</Inner>
}

const Wrapper = styled.div``

const W2 = styled.div`
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #838e98;
  font-weight: 500;

  div {
    font-weight: bold;
  }

  img {
    flex: 0 0 80px;
    min-width: 0;
    height: 100%;
    object-fit: cover;
    border: #5e656a 1px solid;
    border-radius: 3px;
    background: rgba(0, 0, 0, 20%);
  }
`

const ImageTrigger = ({ name, value }) => {
  return (
    <W2>
      <div>{name}</div>
      <img src={cubemaps[value]?.posX || null} />
    </W2>
  )
}

interface Props {
  name: string
  value: number
  onChange: (val: string) => void
}

const CubemapSelector: React.FC<Props> = ({ name, value, onChange }) => {
  const [_value, setValue] = useState<number>(value)

  const onAccept = (value: number) => {
    setValue(value)
    onChange(value)
  }

  return (
    <Wrapper>
      <ModalTrigger
        trigger={<ImageTrigger name={name} value={_value} />}
        onAccept={onAccept}
      >
        <ImageWrapper />
      </ModalTrigger>
    </Wrapper>
  )
}

export default CubemapSelector
