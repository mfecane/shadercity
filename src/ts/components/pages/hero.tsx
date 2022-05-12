import React from 'react'
import HeroHeader from '../hero/hero-header'
import HeroSection from '../hero/hero-section'
import ShaderRow from '../hero/shader-row'
import HeroFooter from '../hero/hero-footer'

const Hero: React.FC = () => {
  return (
    <>
      <HeroHeader />
      <HeroSection />
      <ShaderRow kind="featured" />
      <ShaderRow kind="top" />
      <HeroFooter />
    </>
  )
}

export default Hero
