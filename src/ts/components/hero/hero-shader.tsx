import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import useStore, { ShaderState } from 'ts/hooks/use-store'
import { ShaderModel } from 'ts/model/shader-model'
import Spinner from 'ts/components/common/spinner'
import Renderer from 'ts/renderer/renderer'
import UnderConstruction from '../common/under-construction'

const DISPLAY_TIMEOUT = 5000

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 6px;
  position: relative;
  border: rgb(49, 60, 67) 1px solid;
  background-color: rgba(0, 0, 0, 0.3);
`

const CanvasContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
`

interface HeroCounterProps {
  index: number
  onChange: (x: number) => void
}

const HeroCounter: React.FC<HeroCounterProps> = ({ index, onChange }) => {
  const intemxJSX = [0, 1, 2].map((idx) => (
    <div
      key={idx}
      onClick={onChange.bind(null, idx)}
      className={`hero-canvas-switch-item ${idx === index && 'active'}`}
    ></div>
  ))

  return <div className="hero-canvas-switch">{intemxJSX}</div>
}

const HeroShader: React.FC = () => {
  const {
    state: { shaderList },
  } = useStore()
  const renderer = useRef(null)
  const containerRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [index, setIndex] = useState(0)

  const shaders = shaderList.filter((el) => !!el.daily)
  let shader = shaders[index]
  if (!shader) {
    const idx = Math.floor(shaderList.length * Math.random())
    shader = shaderList[idx]
  }

  if (!shader) return <UnderConstruction />

  const shaderModel = new ShaderModel(shader)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((cur) => (cur + 1) % 3)
    }, DISPLAY_TIMEOUT)
    return () => {
      window.clearInterval(interval)
    }
  }, [index])

  useEffect(() => {
    if (shaderModel) {
      const init = async () => {
        renderer.current = await shaderModel.createRenerer(
          containerRef.current,
          true
        )
        setLoading(false)
        renderer.current.animate()
      }
      init()
    }
    return () => {
      if (renderer.current && renderer.current instanceof Renderer) {
        shaderModel.renderer = null
        renderer.current.destroy()
        renderer.current = null
      }
    }
  }, [shaderModel])

  return (
    <>
      <Wrapper>
        {loading && <Spinner big />}
        <CanvasContainer ref={containerRef} />
      </Wrapper>
      <HeroCounter index={index} onChange={setIndex} />
    </>
  )
}

export default HeroShader
