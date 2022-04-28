import React from 'react'
import styled from 'styled-components'
import HeroHeader from '../hero/hero-header'
import HeroSection from '../hero/hero-section'
import heroBackground from 'assets/hero-background.svg'
import ShaderRow from './shader-row'
import HeroFooter from '../hero/hero-footer'

const Wrapper = styled.div`
  background: 30% 10% / 70% auto no-repeat url(${heroBackground}),
    radial-gradient(
      circle 80vw at 30% 40vh,
      var(--color-dark1) 0%,
      var(--color-dark2) 100%
    );
  min-height: 100vh;
`

const Hero: React.FC = () => {
  return (
    <Wrapper>
      <HeroHeader />
      <HeroSection />
      <ShaderRow />
      <ShaderRow />
      <HeroFooter />
    </Wrapper>
  )
}

export default Hero
