import React from 'react'
import styled, { css } from 'styled-components'
import HeaderUser from 'ts/components/header/header-user'
import Logo from 'ts/components/common/logo'
import { Container } from 'ts/components/styled/common'
import Nav from 'ts/components/header/nav'
import HeaderAuth from './header-auth'
import useStore from 'ts/hooks/use-store'

interface WrapperProps {
  background?: boolean
}

const Wrapper = styled.div<WrapperProps>`
  width: 100%;
  flex: 0 0 auto;
  position: relative;
  background: radial-gradient(
    circle farthest-side at 60% 50%,
    #1f2934 0%,
    #161d24 100%
  );
`

const WrapperInner = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 85px;
`
interface Props {
  container?: boolean
  background?: boolean
  thin?: boolean
}

const Header: React.FC<Props> = ({ container = true, thin = true }) => {
  const {
    state: { currentUser },
  } = useStore()

  let innerJSX = (
    <WrapperInner>
      <Logo />
      <Nav />
      {currentUser && <HeaderUser />}
      {!currentUser && <HeaderAuth />}
    </WrapperInner>
  )

  if (container) innerJSX = <Container>{innerJSX}</Container>

  return <Wrapper thin={thin}>{innerJSX}</Wrapper>
}

export default Header
