import React from 'react'
import styled, { css } from 'styled-components'

interface WrapperProps {
  readonly: boolean
  active: boolean
}

const Wrapper = styled.div<WrapperProps>`
  svg {
    width: 20px;
    height: 20px;
  }

  ${({ readonly }) =>
    readonly
      ? css`
          pointer-events: none;
          svg {
            width: 18px;
            height: 18px;
          }
        `
      : css`
          cursor: pointer;
          &:hover svg path {
            fill: white;
          }
        `}

  ${({ active }) =>
    active
      ? css`
          & path {
            fill: var(--color-accent);
          }
        `
      : css`
          & path {
            fill: #3b444d;
          }
        `}

  path {
    transition: fill 200ms ease-in;
  }
  display: flex;
  align-items: center;
  gap: 4px;
`

interface Props {
  active: boolean
  value: number
  readonly?: boolean
  onClick: React.MouseEventHandler<HTMLDivElement>
}

const Star: React.FC<Props> = ({
  active = false,
  value = 0,
  readonly = true,
  onClick = () => {
    /* do nothing */
  },
}) => {
  return (
    <Wrapper
      readonly={readonly}
      active={active}
      onClick={(!readonly && onClick) || null}
    >
      <svg viewBox="0 0 110.92 105.87">
        <path d="M59.1,2.64,69.57,34.86a3.82,3.82,0,0,0,3.64,2.65h33.87a3.82,3.82,0,0,1,2.25,6.92L81.93,64.34a3.81,3.81,0,0,0-1.39,4.28L91,100.84a3.83,3.83,0,0,1-5.89,4.28L57.71,85.21a3.81,3.81,0,0,0-4.5,0L25.8,105.12a3.83,3.83,0,0,1-5.89-4.28L30.38,68.62A3.84,3.84,0,0,0,29,64.34L1.59,44.43a3.82,3.82,0,0,1,2.24-6.92H37.71a3.82,3.82,0,0,0,3.64-2.65L51.82,2.64A3.83,3.83,0,0,1,59.1,2.64Z" />
      </svg>
      <span>{value}</span>
    </Wrapper>
  )
}

export default Star
