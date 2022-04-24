import React, { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'

interface Props {
  children: React.ReactNode
  open: boolean
  close: () => void
}

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000000bb;
  z-index: 1;
`

const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  max-height: 80vh;
  transform: translate(-50%, -50%);
  background-color: #21282d;
  z-index: 2;
  border-radius: 5px;
  overflow: hidden;
  display: flex;
`

const InnerWrapper = styled.div`
  min-height: 0;
  width: 100%;
  overflow: auto;
  flex: 0 1 100%;
`

const CloseButton = styled.button`
  position: fixed;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;

  i {
    display: block;
    background-color: #ff7b7b;
    width: 24px;
    height: 24px;
    transition: background-color 200ms ease-in;
  }

  &:hover {
    i {
      background-color: #ffffff;
    }
  }
`

const Modal = ({ open, close, children }: Props): React.ReactPortal => {
  const el = useRef<HTMLDivElement>(document.createElement('div'))
  const portalRoot = document.getElementById('modals')

  useEffect(() => {
    portalRoot.appendChild(el.current)
    return () => {
      portalRoot.removeChild(el.current)
    }
  }, [])

  if (!open) {
    return null
  }

  return createPortal(
    <>
      <Overlay onClick={close}></Overlay>
      <Wrapper>
        <CloseButton onClick={close}>
          <i className="icon icon-close" />
        </CloseButton>
        <InnerWrapper>{children}</InnerWrapper>
      </Wrapper>
    </>,
    el.current
  )
}

export default Modal
