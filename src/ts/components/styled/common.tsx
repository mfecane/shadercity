import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'

const getColor =
  (prop: string) =>
  ({ theme }) =>
    theme[prop]

export const CenterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`

export const Container = styled.div`
  max-width: 1200px;
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  padding: 0 20px;
`

interface BlockProps {
  height?: number
  minHeight?: string
}

export const Block = styled.div<BlockProps>`
  height: ${({ height }) => height}px;
  min-height: ${({ minHeight }) => minHeight};
`

export const IconButton = styled.button`
  padding: 8px;
  border-radius: 3px;
  color: ${getColor('dark')};
  background-color: ${getColor('accent')};
  font-weight: bold;
`

export const ButtonLink = styled.button`
  color: ${getColor('light')};
  font-weight: bold;
  font-size: 16px;

  a {
    color: white;
  }

  a:hover {
    color: white;
    text-decoration: underline;
  }
`

export const Header1 = styled.h1`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
`

export const ModalContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #000000cc;
`

interface RowProps {
  center?: boolean
  space?: boolean
  fillHeight?: boolean
  gap?: number
}

export const Row = styled.div<RowProps>`
  display: flex;
  gap: ${({ gap = 16 }) => `${gap}px`};
  align-items: center;
  ${({ center }) =>
    center &&
    css`
      justify-content: center;
    `}
  ${({ space }) =>
    space &&
    css`
      justify-content: space-between;
    `}
  ${({ fillHeight }) =>
    fillHeight &&
    css`
      height: 100%;
    `}
`

export const ErrorWrapper = styled.div`
  color: ${({ theme }) => theme.dark};
  background-color: #f16d6d;
  padding: 8px 12px;
  border-radius: 3px;
  margin: 6px 0;
`

interface StyledLinkProps {
  bold?: boolean
}

// TODO fix
export const StyledLink = styled(Link)<StyledLinkProps>`
  font-weight: ${({ bold }) => (bold ? '500' : 'normal')};
`

interface ButtonProps {
  green?: boolean
  red?: boolean
  disabled?: boolean
  secondary?: boolean
  big?: boolean
}

export const Button = styled.button<ButtonProps>`
  padding: 8px 10px;
  min-width: 120px;
  border-radius: 3px;
  font-weight: bold;
  transition: all 200ms ease-in;

  background-color: ${({ green, red, disabled, secondary }) => {
    if (secondary) return 'transparent'
    if (green) return '#65d026'
    if (red) return '#ad2727'
    if (disabled) return '#666'
    return 'var(--color-accent-dim)'
  }};

  ${({ big }) => {
    if (big) {
      return css`
        padding: 12px 42px;
        font-size: 18px;
        min-width: 180px;
      `
    }
    return css`
      padding: 8px 10px;
      min-width: 120px;
      font-size: 12px;
    `
  }};

  ${({ secondary }) => {
    if (secondary) {
      return css`
        color: var(--color-accent);
        border: var(--color-accent-dim) 1px solid;
        box-shadow: inset 0 0 3px 0 #86fff374;
        &:hover {
          color: white;
          border: white 1px solid;
        }
      `
    }
    return css`
      color: black;
      &:hover {
        background-color: white;
      }
    `
  }};
`

export const Col = styled.div`
  display: flex;
  flex-direction: column;
`
