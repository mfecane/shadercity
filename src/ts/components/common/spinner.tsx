import React, { useEffect, useRef } from 'react'
import styled, { css } from 'styled-components'

const Wrapper = styled.div`
  ${({ smol, big }) => {
    if (smol)
      return css`
        width: 40px;
        height: 40px;
      `
    if (big)
      return css`
        width: 160px;
        height: 160px;
      `
    return css`
      width: 80px;
      height: 80px;
    `
  }}
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .spinnerEl {
    position: absolute;
    width: 20%;
    height: 20%;
    border-radius: 10%;
    background: #87a9c0;
    box-shadow: inset 0 0 5px 2px #fff;
    opacity: 0;
    transform: scale(0);
    animation: spinner-anim 1600ms ease-out infinite;
  }
`

interface Props {
  smol?: boolean
  big?: boolean
}

const Spinner: React.FC<Props> = ({ smol = false, big = false }) => {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    for (let i = 0; i < 5; ++i) {
      for (let j = 0; j < 5; ++j) {
        if ((i === 0 || i === 4) && (j === 0 || j === 4)) {
          continue
        }

        if (Math.random() < 0.2) {
          continue
        }

        const div = document.createElement('div')
        div.classList.add('spinnerEl')
        div.style.top = `${20 * i}%`
        div.style.left = `${20 * j}%`
        div.style.animationDelay = `${-1600 * Math.random()}ms`
        div.style.animationDuration = `${800 + 800 * Math.random()}ms`
        el.appendChild(div)
      }
    }

    return () => {
      el.innerHTML = ''
    }
  }, [])

  return <Wrapper smol={smol} big={big} ref={ref}></Wrapper>
}

export default Spinner
