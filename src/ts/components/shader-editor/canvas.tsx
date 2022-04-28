import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import useStore from 'ts/hooks/use-store'
import Spinner from '../common/spinner'
import { BlackButton } from '../styled/common'
import iconExpand from 'assets/expand.svg'

const Wrapper = styled.div`
  flex: 1 1 auto;
  overflow: hidden;
  min-height: 0;
  position: relative;

  .canvas-button-position {
    position: absolute;
    bottom: 24px;
    right: 24px;
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

  useEffect(() => {
    if (currentShader) {
      if (renderer.current) {
        renderer.current.destroy()
      }

      const init = async () => {
        renderer.current = await currentShader.createRenerer(
          containerRef.current
        )
        setLoading(false)
        renderer.current.animate()
      }
      init()

      if (renderer.current)
        return () => {
          renderer.current.destroy()
        }
    }
  }, [currentShader])

  return (
    <Wrapper className="canvasOuter">
      {loading && <Spinner big />}
      {shaderError && (
        <ErrorOverlay>
          {shaderError.map((el, idx) => (
            <div key={idx}>{el}</div>
          ))}
        </ErrorOverlay>
      )}
      <CanvasContainer ref={containerRef} />
      <div className="canvas-button-position">
        <BlackButton icon={iconExpand} onClick={toggleEditorFullscreen} />
      </div>
    </Wrapper>
  )
}

export default Canvas
