import React from 'react'
import styled from 'styled-components'
import ShaderTitle from 'ts/components/shader-editor/shader-title'
import useStore from 'ts/hooks/use-store'
import Canvas from 'ts/components/shader-editor/canvas'

const Wrapper = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;
  background-color: rgba(0, 0, 0, 0.3);
`

const CanvasContainer: React.FC = () => {
  const {
    state: { currentShader },
  } = useStore()

  return (
    <Wrapper>
      <ShaderTitle
        name={currentShader.name}
        author={currentShader.user}
      ></ShaderTitle>
      <Canvas />
    </Wrapper>
  )
}

export default CanvasContainer

