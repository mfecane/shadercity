import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  min-width: 400px;
  padding: 40px 30px;
  color: #82a4b6;
  line-height: 24px;

  h2 {
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 24px;
    color: white;
  }

  h3:not(:first-child) {
    margin-top: 16px;
  }

  h3 {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 10px;
    color: white;
  }

  h4 {
    font-size: 12px;
    font-weight: bold;
    margin-bottom: 10px;
    color: white;
  }

  li {
    margin-bottom: 8px;
    margin-left: 12px;
    em {
      font-style: normal;
      font-weight: bold;
    }
  }

  p {
    margin: 10px 0 10px 0;
  }
`

const Help: React.FC = () => {
  return (
    <Wrapper>
      <h2>Help</h2>

      <h3>Basic usage</h3>
      <p>
        Entry point - getColor funciton, which should return vec3 of color
        component. On the input is vec2 with values from 0 to 1.
      </p>

      <h3>Uniforms</h3>
      <ul>
        <li>
          <em>u_time</em> - use to acquire time
        </li>
        <li>
          <em>u_mouseX, u_mouseY, u_mouseScroll</em> - use to acquire mouse
          controls
        </li>
        <li>
          <em>u_'value'</em> - add floating point value from 0.0 to 1.0, a
          slider will be added in the controls section
        </li>
      </ul>

      <h3>Libraries</h3>

      <p>
        Include libraries using use_'library'. Following libraries are
        available. Libraries are inclluded via simple copy/paste operation.
      </p>

      <ul>
        <li>
          <em>distance funcitons (use_dist)</em> - sdSphere, sdGyroid, sdCube
        </li>
        <li>
          <em>noises/hashes</em> - sdSphere, sdGyroid, sdCube
        </li>
      </ul>
    </Wrapper>
  )
}

export default Help
