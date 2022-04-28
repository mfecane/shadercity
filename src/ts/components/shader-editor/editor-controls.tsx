import React, { useState } from 'react'
import { IconButton } from 'ts/components/styled/common'
import useAuth from 'ts/hooks/use-auth'
import useStore from 'ts/hooks/use-store'
import Help from 'ts/components/help'
import Modal from 'ts/components/dialogs/modal'
import styled from 'styled-components'
import Confirm from 'ts/components/dialogs/confirm'
import { toast } from 'react-toastify'

import saveIcon from 'assets/save.svg'
import playIcon from 'assets/play.svg'
import deleteIcon from 'assets/delete.svg'
import forkIcon from 'assets/fork.svg'

import { useNavigate } from 'react-router-dom'

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

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
`

const HelpButton = styled.button`
  width: 36px;
  height: 36px;
  background-color: #3a74bb;
  box-shadow: inset 0px 0px 1px 1px black;
  border: 1px solid #3a74bb;
  border-radius: 50%;
  color: black;
  font-weight: bold;
  font-size: 20px;
  transition: 200ms background-color ease-in;

  &:hover {
    background-color: white;
  }
`

const ButtonsGroup = styled.div`
  display: flex;
  gap: 10px;
`

// TODO confirm button
interface DeleteButtonProps {
  onClick: () => void
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick }) => {
  const [open, setOpen] = useState(false)

  const onConfirm = () => {
    setOpen(false)
    onClick()
  }

  return (
    <>
      <IconButton icon={deleteIcon} red onClick={setOpen.bind(null, true)}>
        Delete
      </IconButton>
      <Modal open={open} close={setOpen.bind(null, false)}>
        <Confirm onConfirm={onConfirm} onReject={setOpen.bind(null, false)}>
          Are you sure?
        </Confirm>
      </Modal>
    </>
  )
}

const EditorControls: React.FC = () => {
  const {
    state: { currentShader, shaderError, editorCode },
    saveShader,
    updateShader,
    setShaderError,
    forkShader,
    deleteShader,
    setEditorError,
  } = useStore()
  const { currentUser } = useAuth()
  const [helpOpen, setHelpOpen] = useState(false)
  const navigate = useNavigate()

  const handleUpdateShader = () => {
    currentShader.setSource(editorCode)
    const error = currentShader.validate()
    if (error) {
      setShaderError(error)
      return false
    }
    updateShader(currentShader)
    return true
  }

  const handleSaveShader = () => {
    const save = async () => {
      const res = handleUpdateShader()
      if (res) {
        try {
          await saveShader()
        } catch (e) {
          setEditorError(e.message)
          return
        }
        runToast('Saved')
      }
    }
    save()
  }

  const handleForkShader = () => {
    const save = async () => {
      setEditorError('')
      try {
        const shader = await forkShader()
        navigate(`/shader/${shader.id}`)
        runToast('Forked')
      } catch (e) {
        setEditorError(e.message)
      }
    }
    save()
  }

  const handleDeleteShader = async () => {
    try {
      await deleteShader()
    } catch (e) {
      setEditorError(e.message)
      return
    }
    navigate(`/`)
    runToast('Deleted')
  }

  const buttonJSX = [
    <IconButton icon={playIcon} green onClick={handleUpdateShader} key="run">
      Run
    </IconButton>,
  ]

  if (currentShader?.user?.uid === currentUser?.uid) {
    buttonJSX.push(
      <IconButton
        icon={saveIcon}
        onClick={handleSaveShader}
        disabled={!!shaderError}
        key="save"
      >
        Save
      </IconButton>
    )
  }

  if (currentUser) {
    buttonJSX.push(
      <IconButton
        icon={forkIcon}
        disabled={!!shaderError}
        onClick={handleForkShader}
        key="fork"
      >
        Fork
      </IconButton>
    )
  }

  if (currentShader?.user?.uid === currentUser?.uid) {
    buttonJSX.push(<DeleteButton onClick={handleDeleteShader} key="del" />)
  }

  return (
    <Row>
      <ButtonsGroup>{buttonJSX}</ButtonsGroup>
      <HelpButton onClick={setHelpOpen.bind(null, true)}>?</HelpButton>
      {helpOpen}
      <Modal open={helpOpen} close={setHelpOpen.bind(null, false)}>
        <Help />
      </Modal>
    </Row>
  )
}

export default EditorControls
