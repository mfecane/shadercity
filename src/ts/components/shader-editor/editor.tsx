import React, { useEffect } from 'react'
import styled from 'styled-components'
import { ErrorWrapper } from 'ts/components/styled/common'
import useStore from 'ts/hooks/use-store'
import CodeEditorImport from '@uiw/react-textarea-code-editor'
import ShaderParameters from 'ts/components/shader-editor/parameters/shader-parameters'
import Canvas from './canvas'

const CodeEditor = styled(CodeEditorImport)`
  flex: 2 1 auto;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  padding: 16px;
  padding-right: 0;

  .innerWrapper {
    height: 0;
    background-color: #212b38;
    border-radius: 3px;
    margin-right: 2px;
    font-size: 16px;
    flex: 1 0 auto;
    overflow: auto;
  }
`

const Editor: React.FC = () => {
  const {
    state: { currentShader, editorCode, editorError },
    setEditorCode,
  } = useStore()

  useEffect(() => {
    setEditorCode(currentShader?.code)
  }, [currentShader])
  return (
    <Wrapper>
      {editorError && <ErrorWrapper>{editorError}</ErrorWrapper>}
      <div className="innerWrapper">
        <CodeEditor
          value={editorCode}
          language="glsl"
          placeholder="Shader source."
          onChange={(evn) => setEditorCode(evn.target.value)}
          padding={15}
          style={{
            backgroundColor: '#212b38',
            fontFamily:
              'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
          }}
        />
      </div>
      <ShaderParameters />
    </Wrapper>
  )
}

export default Editor
