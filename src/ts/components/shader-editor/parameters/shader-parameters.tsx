import React from 'react'
import useStore from 'ts/hooks/use-store'
import ShaderParameter from 'ts/components/shader-editor/parameters/shader-parameter'
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

const ShaderParameters: React.FC = () => {
  const {
    state: { currentShader },
  } = useStore()

  const uniforms = currentShader.getUniformList()

  if (!uniforms.length) {
    return null
  }

  const shaderParametersJSX = uniforms.map((el) => (
    <ShaderParameter key={el.name} {...el} />
  ))

  return (
    <Wrapper>
      <h2>Shader parameters</h2>
      <Layout>{shaderParametersJSX}</Layout>
    </Wrapper>
  )
}

export default ShaderParameters
