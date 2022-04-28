import React from 'react'
import styled from 'styled-components'
import { Button, Container } from 'ts/components/styled/common'

import placeholderImage from 'assets/bg.jpg'
import HeroShader from 'ts/components/hero/hero-shader'

const Wrapper = styled.div`
  min-height: 75vh;
  padding-top: 130px;
  display: flex;
  align-items: flex-end;
  gap: 40px;

  .right-column {
    flex: 1 1 60%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .canvas-title {
    color: #4b5475;
    font-weight: 500;
    font-size: 20px;
  }

  .canvas-placeholder {
    background: url(${placeholderImage}) no-repeat center center;
    background-size: cover;
    width: 700px;
    height: 60vh;
  }

  .canvas-scroller {
    align-self: center;
    display: flex;
    gap: 16px;
  }

  .canvas-scroller-item {
    width: 24px;
    height: 24px;
    background-color: #274568;
    border-radius: 3px;
  }

  .left-column {
    flex: 1 1 40%;
  }

  .header-block {
    flex: 1 0 210px;
    min-height: 210px;
    position: relative;
  }

  .header-block-inner {
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
      font-size: 64px;
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
    margin: 30px 0 0 0;
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
            <div className="header-block-inner">
              <h1>Explore the city of shaders</h1>
            </div>
          </div>
          <Button big className="explore-button">
            Explore
          </Button>
          <div className="enter-group">
            <div className="enter-label">Become a citizen</div>
            <div className="enter-button-container">
              <Button secondary className="enter-button">
                Log In
              </Button>
              <Button secondary className="enter-button">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
        <div className="right-column">
          <div className="canvas-title">Shader of the day</div>
          <HeroShader />
          {/* TODO implement */}
          {/* <div className="canvas-scroller">
            <div className="canvas-scroller-item"></div>
            <div className="canvas-scroller-item"></div>
            <div className="canvas-scroller-item"></div>
          </div> */}
        </div>
      </Wrapper>
    </Container>
  )
}

export default HeroSection
