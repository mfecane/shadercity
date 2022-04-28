import React from 'react'
import styled from 'styled-components'
import { Container } from '../styled/common'

const Wrapper = styled.div`
  height: 100px;
  background-color: #06090a;

  .footer-container-inner {
    padding: 40px 0;
  }
`

const HeroFooter: React.FC = () => {
  return (
    <Wrapper>
      <Container>
        <div className="footer-container-inner">
          Made by <a href="https://mfecane.github.io">Mfecane</a>
        </div>
      </Container>
    </Wrapper>
  )
}

export default HeroFooter
