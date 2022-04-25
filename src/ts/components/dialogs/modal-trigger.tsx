import React, { ReactNode, useState } from 'react'
import styled from 'styled-components'
import Modal from 'ts/components/dialogs/modal'

const Wrapper = styled.div``

interface Props {
  trigger: ReactNode
  children: ReactNode
  onAccept: () => void
}

const ModalTrigger: React.FC<Props> = ({ trigger, children, onAccept }) => {
  const [open, setOpen] = useState(false)

  const close = (...args) => {
    setOpen(false)
    onAccept(...args)
  }

  const childClone = React.Children.map(children, (child) =>
    React.cloneElement(child, { onAccept: close })
  )

  return (
    <Wrapper>
      <div onClick={setOpen.bind(null, true)}>{trigger}</div>
      <Modal open={open} close={setOpen.bind(null, false)}>
        {childClone}
      </Modal>
    </Wrapper>
  )
}

export default ModalTrigger
