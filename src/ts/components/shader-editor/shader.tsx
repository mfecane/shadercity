import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Canvas from 'ts/components/shader-editor/canvas'
import Editor from 'ts/components/shader-editor/editor'
import EditorContainer from 'ts/components/shader-editor/editor-container'
import useStore from 'ts/hooks/use-store'
import Spinner from 'ts/components/common/spinner'
import EditorHeader from './editor-header'
import styled from 'styled-components'
import CanvasContainer from './canvas-container'

const Wrapper1 = styled.div``

const Wrapper2 = styled.div`
  height: 100%;
  width: 100%;
  height: 100vh;
  display: flex;
`

const Shader: React.FC = () => {
  const { shaderId } = useParams()

  const {
    state: { shaderListLoading, currentShader, editorFullscreen },
    setCurrentShader,
  } = useStore()

  useEffect(() => {
    setCurrentShader(shaderId)
  }, [shaderListLoading, shaderId])

  if (shaderId !== currentShader?.id) {
    return null
  }

  if (shaderListLoading) {
    return <Spinner /> // TODO ::: spinner
  }

  if (editorFullscreen) {
    return (
      <Wrapper2>
        <Canvas />
      </Wrapper2>
    )
  }

  return (
    <Wrapper1>
      <EditorHeader />
      <EditorContainer left={<Editor />} right={<CanvasContainer />} />
    </Wrapper1>
  )
}

export default Shader
