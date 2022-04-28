import React from 'react'
import styled from 'styled-components'
import { Button, Container } from 'ts/components/styled/common'

import placeholderImage from 'assets/bg.jpg'
import HeroShader from 'ts/components/hero/hero-shader'
import { Link } from 'react-router-dom'
import HeroUserSection from './hero-usersection'

const Wrapper = styled.div`
  min-height: 75vh;
  padding-top: 130px;
  display: flex;
  align-items: flex-end;
  gap: 40px;

  .right-column {
    flex: 1 1 65%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .canvas-placeholder {
    background: url(${placeholderImage}) no-repeat center center;
    background-size: cover;
    width: 100%;
    height: 60vh;
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

  .header-block {
    flex: 1 0 190px;
    min-height: 190px;
    position: relative;
  }

  .hero-page__header-block-inner {
    position: absolute;
    top: 0;
    left: 0;
    min-width: 140%;
    padding: 40px 40px 40px 0;

    &:before {
      content: '';
      position: absolute;
      height: 100%;
      left: -100vw;
      right: 0;
      top: 0;
      z-index: 2;

      background: radial-gradient(
        circle farthest-side at 30% 50%,
        #38424f 0%,
        #29333f 100%
      );
    }

    h1 {
      display: block;
      position: relative;
      z-index: 4;
      font-size: 52px;
      font-weight: 500;
      color: var(--color-accent);

      &:before {
        content: '';
        position: absolute;
        width: 8px;
        height: 100%;
        top: 0;
        border-radius: 3px;
        left: -20px;
        background-color: var(--color-accent);
      }
    }
  }

  .explore-button {
    margin: 18px 0 0 0;
  }

  .enter-group {
    margin: 40px 0 30px 0;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .enter-label {
    font-size: 20px;
    color: #16afb9;
    font-weight: 500;
  }

  .enter-button-container {
    justify-content: flex-start;
    display: flex;
    gap: 20px;
  }

  .enter-button {
    width: 180px;
  }
`

const HeroSection: React.FC = () => {
  return (
    <Container>
      <Wrapper>
        <div className="left-column">
          <div className="header-block">
            <div className="hero-page__header-block-inner">
              <h1>Explore the city of shaders</h1>
            </div>
          </div>
          <Link to="/list/">
            <Button big className="explore-button">
              Explore
            </Button>
          </Link>
          <HeroUserSection />
        </div>
        <div className="right-column">
          <HeroShader />
          <div className="canvas-scroller">
            <div className="canvas-scroller-item"></div>
            <div className="canvas-scroller-item"></div>
            <div className="canvas-scroller-item"></div>
          </div>
        </div>
      </Wrapper>
    </Container>
  )
}

export default HeroSection
