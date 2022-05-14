import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { ErrorWrapper } from 'ts/components/styled/common'
import useStore from 'ts/hooks/use-store'
import ShaderParameters from 'ts/components/shader-editor/parameters/shader-parameters'

import {
  init,
  setErrors,
  setEditorCode as setMonacoCode,
} from 'ts/editor/monaco'
import ShaderSteps from './shader-steps'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  padding: 16px;
  padding-right: 0;

  .innerWrapper {
    height: 0;
    border-radius: 3px;
    flex: 1 0 auto;
    overflow: hidden;
  }
`

const Editor: React.FC = () => {
  const ref = useRef(null)

  const {
    state: { editorCode, editorError, shaderError },
    setEditorCode,
  } = useStore()

  useEffect(() => {
    return init(ref.current, editorCode, setEditorCode)
  }, [])

  // useEffect(() => {
  //   setMonacoCode(editorCode)
  // }, [editorCode])

  useEffect(() => {
    setErrors(shaderError)
  }, [shaderError])

  return (
    <Wrapper>
      <ShaderSteps />
      {editorError && <ErrorWrapper>{editorError}</ErrorWrapper>}
      <div className="innerWrapper" id="monacoEditor" ref={ref}></div>
      <ShaderParameters />
    </Wrapper>
  )
}

export default Editor
