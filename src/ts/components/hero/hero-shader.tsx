import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import useStore from 'ts/hooks/use-store'
import { ShaderModel } from 'ts/model/shader-model'
import Spinner from 'ts/components/common/spinner'

const Wrapper = styled.div`
  width: 700px;
  height: 60vh;
  position: relative;
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

  const shader = shaderList.find((el) => el.id === 'pre0AVsTtilvNBYbfptn')
  const shaderModel = new ShaderModel(shader)

  useEffect(() => {
    if (shaderModel) {
      if (renderer.current) {
        renderer.current.destroy()
      }

      const init = async () => {
        renderer.current = await shaderModel.createRenerer(containerRef.current)
        setLoading(false)
        renderer.current.animate()
      }
      init()

      if (renderer.current)
        return () => {
          renderer.current.destroy()
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
