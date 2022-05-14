import React, { useState } from 'react'
import styled from 'styled-components'

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`

const Wrapper = styled.div`
  height: 32px;
  font-size: 12px;
  overflow-y: auto;
  max-height: 100%;
  color: #838e98;
  font-weight: 500;

  .value {
    color: var(--color-accent);
    font-weight: bold;
  }
`

const Range = styled.input`
  margin-top: 8px;
  width: 100%;
  -webkit-appearance: none;
  background: transparent;

  &:focus {
    outline: none;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 18px;
    width: 8px;
    border-radius: 3px;
    background: var(--color-accent);
    cursor: pointer;
    margin-top: -6px;
  }

  &::-webkit-slider-thumb:hover {
    background-color: white;
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 6px;
    cursor: pointer;
    background: #42464b;
    border-radius: 3px;
  }
`

const RangeSlider = ({ label, value, onChange }) => {
  const [_value, _setValue] = useState(value)

  const _onChange = (e) => {
    e.preventDefault()
    const value = e.target.value || 0
    _setValue(value)
    onChange(value)
  }

  return (
    <Wrapper>
      <Header>
        <div>{label}</div>
        <div className="value">{_value}</div>
      </Header>
      <div>
        <Range
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={_value}
          onChange={_onChange}
        />
      </div>
    </Wrapper>
  )
}

export default RangeSlider
