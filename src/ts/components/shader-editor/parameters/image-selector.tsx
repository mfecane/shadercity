import React, { useState } from 'react'
import styled from 'styled-components'
import ModalTrigger from 'ts/components/dialogs/modal-trigger'
import { textures } from 'ts/model/textures'

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
  const imagesJSX = textures.map((src, idx) => (
    <ImgDiv key={idx} onClick={onAccept.bind(null, idx)}>
      <img src={src} />
    </ImgDiv>
  ))
  return <Inner>{imagesJSX}</Inner>
}

const Wrapper = styled.div``

interface Props {
  onChange: (val: string) => void
}

const W2 = styled.div`
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  div {
    font-weight: bold;
  }

  img {
    flex: 0 0 40px;
    min-width: 0;
    height: 100%;
    object-fit: cover;
  }
`

const ImageTrigger = ({ name, value }) => {
  return (
    <W2>
      <div>{name}</div>
      <img src={textures[value]} />
    </W2>
  )
}

const ImageSelector: React.FC<Props> = ({ name, onChange }) => {
  const [value, setValue] = useState()

  const onAccept = (value) => {
    setValue(value)
    onChange(value)
  }

  return (
    <Wrapper>
      <ModalTrigger
        trigger={<ImageTrigger name={name} value={value} />}
        onAccept={onAccept}
      >
        <ImageWrapper />
      </ModalTrigger>
    </Wrapper>
  )
}

export default ImageSelector
