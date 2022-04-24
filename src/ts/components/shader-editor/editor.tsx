import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ErrorWrapper } from 'ts/components/styled/common'
import useStore from 'ts/hooks/use-store'
import { ShaderModel } from 'ts/model/shader-model'
import CodeEditorImport from '@uiw/react-textarea-code-editor'
import EditorControls from './editor-controls'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import ShaderParameters from './shader-parameters'

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

const runToast = (msg: string): void => {
  toast.success(`🦄 ${msg}`, {
    position: 'bottom-right',
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
  })
}

const Editor = (): JSX.Element => {
  const {
    state: { currentShader },
    saveShader,
    updateShader,
    setShaderError,
    forkShader,
  } = useStore()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    setCode(currentShader?.code)
  }, [currentShader])

  const handleSaveShader = () => {
    const save = async () => {
      setError('')
      try {
        updateShader({
          code,
        })
        await saveShader()
        runToast('Saved')
      } catch (e) {
        setError(e.message)
      }
    }
    save()
  }

  const handleUpdateShader = () => {
    const model = new ShaderModel()
    model.setSource(code)
    const error = model.validate()
    if (error) {
      setShaderError(error)
      return
    }
    updateShader({
      code,
    })
  }

  const handleForkShader = () => {
    const save = async () => {
      setError('')
      try {
        await updateShader()
        const shader = await forkShader()
        navigate(`/shader/${shader.id}`)
        runToast('Forked')
      } catch (e) {
        setError(e.message)
      }
    }
    save()
  }

  return (
    <Wrapper>
      {error && <ErrorWrapper>{error}</ErrorWrapper>}
      <div className="innerWrapper">
        <CodeEditor
          value={code}
          language="glsl"
          placeholder="Shader source."
          onChange={(evn) => setCode(evn.target.value)}
          padding={15}
          style={{
            fontFamily:
              'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
          }}
        />
      </div>
      <ShaderParameters />
      <EditorControls
        handleUpdateShader={handleUpdateShader}
        handleSaveShader={handleSaveShader}
        handleForkShader={handleForkShader}
      />
    </Wrapper>
  )
}

export default Editor
