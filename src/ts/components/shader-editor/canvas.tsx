import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import ShaderTitle from 'ts/components/shader-editor/shader-title'

// import ShaderFpsBadge from 'ts/components/shader-editor/shader-fps-badge'
import RendererCode from 'ts/renderer/renderer'
import { ShaderModel } from 'ts/model/shader-model'
import useStore from 'ts/hooks/use-store'

const Wrapper = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  .canvasOuter {
    flex: 1 1 auto;
    overflow: hidden;
    min-height: 0;
    position: relative;
  }

  .aspectWrapper {
    flex: 0 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;
  }

  .parameters {
    flex: 0 0 auto;
  }
`

const CanvasContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
`

const ErrorOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  background: #00000099;
  color: #ff7070;
  font-weight: bold;
  padding: 40px;
`

const Canvas = (): JSX.Element => {
  const containerRef = useRef(null)

  const {
    state: { currentShader, shaderError },
  } = useStore()

  const renderer = useRef(null)

  useEffect(() => {
    if (currentShader) {
      if (renderer.current) {
        renderer.current.destroy()
      }

      const shaderModel = new ShaderModel()
      shaderModel.setSource(currentShader.code)
      renderer.current = shaderModel.createRenerer(containerRef.current)
      renderer.current.animate()

      if (renderer.current)
        return () => {
          renderer.current.destroy()
        }
    }
  }, [currentShader])

  return (
    <Wrapper>
      <ShaderTitle
        name={currentShader.name}
        author={currentShader.user}
        rating={3000}
      ></ShaderTitle>
      <div className="canvasOuter">
        {shaderError && <ErrorOverlay>{shaderError}</ErrorOverlay>}
        <CanvasContainer ref={containerRef} />
      </div>
    </Wrapper>
  )
}

export default Canvas
