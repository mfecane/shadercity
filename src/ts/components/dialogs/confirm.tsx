import React, { ReactNode } from 'react'
import { Button } from 'ts/components/styled/common'
import styled from 'styled-components'

interface Props {
  onConfirm: () => void
  onReject: () => void
  children: ReactNode
}

const Wrapper = styled.div`
  padding: 30px;

  .message {
    margin-bottom: 40px;
  }

  .buttons {
    display: flex;
    gap: 20px;
  }
`

const Confirm: React.FC<Props> = ({ onConfirm, onReject, children }) => {
  return (
    <Wrapper>
      <div className="message">{children}</div>
      <div className="buttons">
        <Button onClick={onConfirm}>Yes</Button>
        <Button onClick={onReject}>No</Button>
      </div>
    </Wrapper>
  )
}

export default Confirm
