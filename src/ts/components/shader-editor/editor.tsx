import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { ErrorWrapper } from 'ts/components/styled/common'
import useStore from 'ts/hooks/use-store'
import ShaderParameters from 'ts/components/shader-editor/parameters/shader-parameters'

import { init, setErrors } from 'ts/editor/monaco'

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
    margin-right: 2px;
    flex: 1 0 auto;
    overflow: hidden;
  }
`

const Editor: React.FC = () => {
  const ref = useRef(null)

  const {
    state: { currentShader, editorCode, editorError, shaderError },
    setEditorCode,
  } = useStore()

  const code = editorCode || currentShader?.code

  useEffect(() => {
    setEditorCode(code)
    init(ref.current, code, setEditorCode)
  }, [])

  useEffect(() => {
    setErrors(shaderError)
  }, [shaderError])

  return (
    <Wrapper>
      {editorError && <ErrorWrapper>{editorError}</ErrorWrapper>}
      <div className="innerWrapper" id="monacoEditor" ref={ref}></div>
      <ShaderParameters />
    </Wrapper>
  )
}

export default Editor
