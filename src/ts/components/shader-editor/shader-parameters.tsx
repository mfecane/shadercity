import React, { useState } from 'react'
import useStore from 'ts/hooks/use-store'
import ShaderParameter from 'ts/components/shader-editor/shader-parameter'
import styled from 'styled-components'

const Wrapper = styled.div`
  h2 {
    margin: 12px 0 8px 0;
    font-size: 16px;
    font-weight: bold;
  }
`
const Layout = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
`

const ShaderParameters = (): JSX.Element => {
  const [expanded, setExpanded] = useState(false)
  const {
    state: { currentShader },
  } = useStore()

  const uniforms = currentShader.uniforms.filter((el) =>
    ['float', 'texture'].includes(el.type)
  )

  if (!uniforms.length) {
    return null
  }

  const shaderParametersJSX = uniforms.map((el) => (
    <ShaderParameter key={el.token} {...el} />
  ))

  return (
    <>
      <Wrapper onClick={() => setExpanded(!expanded)}>
        <h2>Shader parameters</h2>
        <Layout>{shaderParametersJSX}</Layout>
      </Wrapper>
    </>
  )
}

export default ShaderParameters
