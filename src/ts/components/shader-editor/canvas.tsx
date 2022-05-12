import React, { useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import useStore from 'ts/hooks/use-store'
import Spinner from '../common/spinner'
import { BlackButton } from '../styled/common'

import iconExpand from 'assets/expand.svg'
import iconMouse from 'assets/mouse.svg'
import Renderer from 'ts/renderer/renderer'

const Wrapper = styled.div`
  flex: 1 1 auto;
  overflow: hidden;
  min-height: 0;
  position: relative;

  .canvas-button-position {
    position: absolute;
    bottom: 24px;
    right: 24px;
    display: flex;
    gap: 8px;
  }
`

const CanvasContainer = styled.div<{ square: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  ${({ square }) =>
    square
      ? css`
          width: 512px;
          height: 512px;
        `
      : css`
          width: 100%;
          height: 100%;
        `}
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

  div {
    margin: 10px;
  }
`

const Canvas: React.FC = () => {
  const containerRef = useRef(null)
  const renderer = useRef(null)
  const [loading, setLoading] = useState(true)

  const {
    state: { currentShader, shaderError },
    toggleEditorFullscreen,
  } = useStore()

  const mouse = currentShader.hasMouseControls()

  useEffect(() => {
    if (currentShader) {
      if (renderer.current) {
        renderer.current.destroy()
      }

      const init = async () => {
        renderer.current = await currentShader.createRenerer(
          containerRef.current,
          true
        )
        setLoading(false)
        renderer.current.animate()
      }
      init()
    }
    return () => {
      if (renderer.current && renderer.current instanceof Renderer) {
        renderer.current.destroy()
      }
    }
  }, [currentShader])

  return (
    <Wrapper className="canvasOuter">
      {loading && <Spinner big />}
      {shaderError && (
        <ErrorOverlay>
          Errors:
          <br />
          {shaderError.map((el, idx) => (
            <div key={idx}>
              {el.line}: {el.text}
            </div>
          ))}
        </ErrorOverlay>
      )}
      <CanvasContainer square={false} ref={containerRef} />
      <div className="canvas-button-position">
        {mouse && <BlackButton icon={iconMouse} size={36} disabled />}
        <BlackButton icon={iconExpand} onClick={toggleEditorFullscreen} />
      </div>
    </Wrapper>
  )
}

export default Canvas
