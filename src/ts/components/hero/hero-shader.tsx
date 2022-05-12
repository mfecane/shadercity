import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import useStore from 'ts/hooks/use-store'
import { ShaderModel } from 'ts/model/shader-model'
import Spinner from 'ts/components/common/spinner'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Renderer from 'ts/renderer/renderer'
import UnderConstruction from '../common/under-construction'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 6px;
  position: relative;
  border: rgb(49, 60, 67) 1px solid;
`

const CanvasContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
`

const HeroShader: React.FC = () => {
  const {
    state: { shaderList },
  } = useStore()
  const renderer = useRef(null)
  const containerRef = useRef(null)
  const [loading, setLoading] = useState(true)

  let shader = shaderList.find((el) => !!el.daily)
  if (!shader) {
    const idx = Math.floor(shaderList.length * Math.random())
    shader = shaderList[idx]
  }

  if (!shader) return <UnderConstruction />

  const shaderModel = new ShaderModel(shader)

  useEffect(() => {
    if (shaderModel) {
      if (renderer.current) {
        renderer.current.destroy()
      }

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
        renderer.current.destroy()
        console.log('renderer deleted')
      }
    }
  }, [shaderModel])

  return (
    <Wrapper>
      {loading && <Spinner big />}
      <CanvasContainer ref={containerRef} />
    </Wrapper>
  )
}

export default HeroShader
