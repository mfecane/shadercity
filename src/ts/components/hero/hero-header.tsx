import React, { useEffect, useRef } from 'react'
import { Block, Container, Row } from 'ts/components/styled/common'
import Logo from 'ts/components/common/logo'
import HeaderNav from 'ts/components/header/header-nav'
import styled from 'styled-components'
import HeaderShwuser from '../header/header-shwuser'

const Wrapper = styled.div`
  position: fixed;
  width: 100vw;
  z-index: 7;
  transition: background-color 200ms ease;

  &.darkBg {
    background: #0d1216ee;
    backdrop-filter: blur(5px);
  }
`

const HeroHeader: React.FC = () => {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current

    const scrollHander = () => {
      const scroll = document.documentElement.scrollTop
      if (scroll > 10) {
        el.classList.toggle('darkBg', true)
      } else {
        el.classList.toggle('darkBg', false)
      }
    }

    window.addEventListener('scroll', scrollHander)

    return () => {
      window.removeEventListener('scroll', scrollHander)
    }
  }, [])

  return (
    <Wrapper ref={ref}>
      <Container>
        <Block height={100}>
          <Row space fillHeight>
            <Logo />
            <Row gap={64}>
              <HeaderNav />
              <HeaderShwuser />
            </Row>
          </Row>
        </Block>
      </Container>
    </Wrapper>
  )
}

export default HeroHeader
