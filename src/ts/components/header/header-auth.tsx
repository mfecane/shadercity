import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Button } from 'ts/components/styled/common'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const HeaderAuth: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Wrapper>
      <Button
        primary
        onClick={() => {
          navigate('/login')
        }}
      >
        Log In
      </Button>
      <Button
        primary
        onClick={() => {
          navigate('/signup')
        }}
      >
        Sign Up
      </Button>
    </Wrapper>
  )
}

export default HeaderAuth

