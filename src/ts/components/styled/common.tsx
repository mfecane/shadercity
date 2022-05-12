import React from 'react'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'

export const CenterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`

export const Container = styled.div`
  margin: auto;
  padding: 0 50px;
  max-width: 1200px;
  min-width: 1100px;
  width: 100%;
`

interface BlockProps {
  height?: number
  minHeight?: string
  padding?: string
}

export const Block = styled.div<BlockProps>`
  height: ${({ height }) => height}px;
  min-height: ${({ minHeight }) => minHeight};
  padding: ${({ padding }) => padding};
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
  min-height: 100vh;
  background-color: #000000cc;
`

export const ShwenterContainer = styled.div`
  margin: 20px auto 20px auto;
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
  $bold?: boolean
}

// TODO fix
export const StyledLink = styled(Link)<StyledLinkProps>`
  font-weight: ${({ $bold }) => ($bold ? '500' : 'normal')};
`

interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  green?: boolean
  red?: boolean
  disabled?: boolean
  secondary?: boolean
  big?: boolean
  narrow?: boolean
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
    return 'var(--color-neutral)'
  }};

  ${({ big, narrow }) => {
    if (big) {
      return css`
        padding: 12px 42px;
        font-size: 18px;
        min-width: 180px;
      `
    }
    if (narrow) {
      return css`
        padding: 8px 12px;
        font-size: 12px;
        min-width: 42px;
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

interface IconProps {
  icon?: string
  light?: boolean
  color?: string
  size?: number
}

export const Icon = styled.i<IconProps>`
  ${({ size }) => {
    const _size = size || 16
    return css`
      width: ${_size}px;
      height: ${_size}px;
    `
  }}

  border-radius: 3px;
  background-color: var(--color-dark);
  font-weight: bold;

  background-color: ${({ color, light }) => {
    if (color) return color
    if (light) return 'var(--color-accent)'
    return 'var(--color-dark)'
  }};

  ${({ icon }) => {
    if (icon) {
      return css`
        mask-image: url(${icon});
        mask-position: center;
        mask-repeat: no-repeat;
        mask-size: contain;
      `
    }
  }};
`

interface IconButtonProps extends ButtonProps {
  icon?: string
}

export const IconButton: React.FC<IconButtonProps> = (props) => {
  return (
    <Button narrow {...props}>
      <Row gap={6}>
        <Icon icon={props.icon} />
        {props.children}
      </Row>
    </Button>
  )
}

const RoundButton_ = styled.button`
  border: var(--color-accent-dim) 2px solid;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`

interface RoundButtonProps extends React.HTMLProps<HTMLButtonElement> {
  icon?: string
}

export const RoundButton: React.FC<RoundButtonProps> = (props) => {
  return (
    <RoundButton_ {...props}>
      <Icon icon={props.icon} light />
    </RoundButton_>
  )
}

const BlackButton_ = styled.button`
  background: #111214;
  width: 52px;
  height: 52px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ disabled }) =>
    !disabled &&
    css`
      & i:hover {
        background: var(--color-accent);
      }
    `}
`

interface BlackButtonProps extends React.HTMLProps<HTMLButtonElement> {
  icon?: string
  size?: number
}

export const BlackButton: React.FC<BlackButtonProps> = (props) => {
  return (
    <BlackButton_ {...props}>
      <Icon icon={props.icon} color={'white'} size={props.size || 24} />
    </BlackButton_>
  )
}
