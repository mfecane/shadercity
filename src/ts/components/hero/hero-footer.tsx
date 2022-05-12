import React from 'react'
import styled from 'styled-components'
import { Container } from '../styled/common'

const Wrapper = styled.div`
  background-color: #0b0d0e;
  padding: 40px 0;
  color: var(--color-accent);

  .footer-container-inner {
    font-weight: bold;

    a {
      color: var(--color-accent);
    }

    a:hover {
      color: white;
    }
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
