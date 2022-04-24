import React, { useState } from 'react'
import { Button } from 'ts/components/styled/common'
import useAuth from 'ts/hooks/use-auth'
import useStore from 'ts/hooks/use-store'
import Help from 'ts/components/help'
import Modal from 'ts/components/modal'
import styled from 'styled-components'

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  align-items: center;
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

interface Props {
  handleUpdateShader: () => void
  handleSaveShader: () => void
  handleForkShader: () => void
}

const EditorControls = ({
  handleUpdateShader,
  handleSaveShader,
  handleForkShader,
}: Props): JSX.Element => {
  const {
    state: { currentShader, shaderError },
  } = useStore()
  const { currentUser } = useAuth()
  const [helpOpen, setHelpOpen] = useState(false)

  let buttonJSX

  if (!currentUser) {
    buttonJSX = null
  } else if (currentShader.user.uid === currentUser.uid) {
    buttonJSX = (
      <Button onClick={handleSaveShader} disabled={!!shaderError}>
        Save
      </Button>
    )
  } else {
    buttonJSX = (
      <Button disabled={!!shaderError} onClick={handleForkShader}>
        Fork
      </Button>
    )
  }

  return (
    <Row>
      <ButtonsGroup>
        <Button green onClick={handleUpdateShader}>
          Run
        </Button>
        {buttonJSX}
      </ButtonsGroup>
      <HelpButton onClick={setHelpOpen.bind(null, true)}>?</HelpButton>
      {helpOpen}
      <Modal open={helpOpen} close={setHelpOpen.bind(null, false)}>
        <Help />
      </Modal>
    </Row>
  )
}

export default EditorControls
