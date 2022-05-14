import React from 'react'
import styled from 'styled-components'
import { Button, Container, Icon } from 'ts/components/styled/common'

import HeroShader from 'ts/components/hero/hero-shader'
import { Link } from 'react-router-dom'
import HeroUserSection from './hero-usersection'

import bgImg from 'assets/img/bg.png'
import dotsSvg from 'assets/svg/dots.svg'
import underlineSvg from 'assets/svg/underline.svg'
import rightIcon from 'assets/svg/arrow2.svg'

const Wrapper = styled.div`
  position: relative;
  border-bottom: #1f1f20 1px solid;

  background: radial-gradient(
    farthest-corner at 70% 40%,
    #242628 0%,
    #070b10 100%
  );

  .hero-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background: center/ cover url(${bgImg}) no-repeat;
    opacity: 0.3;
  }

  .hero-inner {
    position: relative;
    padding-top: 100px;
    padding-bottom: 40px;
    height: 85vh;
    z-index: 2;
  }

  .hero-layout {
    display: flex;
    height: 100%;
    gap: 2vw;
  }

  .hero-left-col {
    flex: 0 1 33%;
    min-width: 250px;
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  .hero-title-group {
  }

  .hero-title {
    position: relative;
    margin-top: 3rem;
    font-size: 3.5rem;
    font-weight: 600;
    white-space: nowrap;
  }

  .hero-subtitle {
    margin-top: 0.5rem;
    font-size: 1.4rem;
    font-weight: 400;
    color: rgb(182, 200, 211);
  }

  .hero-button {
    display: block;
    margin-top: 32px;
    margin-bottom: 20px;

    button {
      padding-left: 48px;
      padding-right: 48px;
    }
  }

  .hero-button button {
    font-size: 1.3rem;
    min-width: 160px;
  }

  .hero-button-icon {
    margin-left: 8px;
    transform: translateY(2px);
  }

  .canvas-scroller {
    align-self: center;
    display: flex;
    gap: 12px;
  }

  .canvas-scroller-item {
    width: 18px;
    height: 18px;
    background-color: #274568;
    border-radius: 3px;
  }

  .left-column {
    flex: 1 1 35%;
  }

  .hero-user-group {
    background: black;
    border-right: var(--color-accent) 8px solid;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    padding: 24px 60px 24px 0;
    position: relative;
    font-size: 1.5rem;
    margin-bottom: 5vh;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .hero-user-group::before {
    background-color: black;
    content: '';
    width: 100vw;
    right: 100%;
    bottom: 0;
    top: 0;
    position: absolute;
  }

  .hero-user-caption {
  }

  .hero-user-caption span {
    display: inline-block;
    position: relative;
    color: var(--color-accent);
  }

  .hero-user-caption span::before {
    position: absolute;
    content: '';
    top: 100%;
    left: 0;
    right: 0;
    height: 20px;
    background: top center / contain url(${underlineSvg}) no-repeat;
  }

  .hero-user-buttons {
    display: flex;
    gap: 12px;
  }

  .hero-user-button {
  }

  .hero-user-button button {
    background-color: transparent;
    border: var(--color-accent) 1px solid;
    border-radius: 5px;
    color: white;
    transition: border-color 300ms ease-in-out;
    padding: 8px 18px;
  }

  .hero-user-button button:hover {
    border-color: white;
  }

  .hero-right-col {
    flex: 0 1 66%;
    min-width: 0;
    padding: 70px 0 0 0;
    gap: 10px;
    display: flex;
    flex-direction: column;
  }

  .hero-canvas-dots {
    width: 50px;
    height: 50px;
    background: center right / contain url(${dotsSvg}) no-repeat;
    align-self: flex-end;
  }

  .hero-canvas-switch {
    align-self: center;
    display: flex;
    gap: 20px;
  }

  .hero-canvas-switch-item {
    width: 24px;
    height: 12px;
    background-color: rgb(41, 64, 73);
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 300ms ease-in-out;
  }

  .hero-canvas-switch-item.active {
    background-color: var(--color-accent);
  }
`

const HeroSection: React.FC = () => {
  return (
    <Wrapper>
      <div className="hero-background">
        <canvas></canvas>
      </div>
      <Container>
        <div className="hero-inner">
          <div className="hero-layout">
            <div className="hero-left-col">
              <div className="hero-title-group">
                <h1 className="hero-title">
                  Have fun in a club
                  <br />
                  of shaders
                </h1>
                <h2 className="hero-subtitle">
                  Play with glsl shaders in real time
                </h2>
                <Link to="/list/" className="hero-button">
                  <Button primary>
                    Browse
                    <Icon
                      icon={rightIcon}
                      className="hero-button-icon"
                      size={18}
                    />
                  </Button>
                </Link>
              </div>
              <HeroUserSection />
            </div>
            <div className="hero-right-col">
              <div className="hero-canvas-dots"></div>
              <HeroShader />
            </div>
          </div>
        </div>
      </Container>
    </Wrapper>
  )
}

export default HeroSection
