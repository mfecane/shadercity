import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 26px;
  height: 26px;

  path {
    stroke: #77a7cc;
    stroke-width: 2px;
    fill: #243544;
    transition: fill 200ms ease-in;
    cursor: pointer;
  }

  &.active {
    path {
      fill: #e3bd27;
    }
  }

  &.smol {
    width: 20px;
    height: 20px;
  }

  &:hover {
    path {
      fill: #ffffff;
    }
  }
`

interface Props {
  active: boolean
  onClick: React.MouseEventHandler<HTMLDivElement>
}

const Star = ({
  active = false,
  smol = false,
  onClick = () => {
    /* do nothing */
  },
}: Props): JSX.Element => {
  return (
    <Wrapper
      className={`${active && 'active'} ${smol && 'smol'}`}
      onClick={onClick}
    >
      <svg viewBox="0 0 110.92 105.87">
        <path d="M59.1,2.64,69.57,34.86a3.82,3.82,0,0,0,3.64,2.65h33.87a3.82,3.82,0,0,1,2.25,6.92L81.93,64.34a3.81,3.81,0,0,0-1.39,4.28L91,100.84a3.83,3.83,0,0,1-5.89,4.28L57.71,85.21a3.81,3.81,0,0,0-4.5,0L25.8,105.12a3.83,3.83,0,0,1-5.89-4.28L30.38,68.62A3.84,3.84,0,0,0,29,64.34L1.59,44.43a3.82,3.82,0,0,1,2.24-6.92H37.71a3.82,3.82,0,0,0,3.64-2.65L51.82,2.64A3.83,3.83,0,0,1,59.1,2.64Z" />
      </svg>
    </Wrapper>
  )
}

export default Star
