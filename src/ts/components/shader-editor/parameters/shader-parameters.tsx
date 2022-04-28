import React, { useState } from 'react'
import useStore from 'ts/hooks/use-store'
import ShaderParameter from 'ts/components/shader-editor/parameters/shader-parameter'
import styled from 'styled-components'
import { Icon, Row } from 'ts/components/styled/common'

import iconArrow from 'assets/arrow-up.svg'

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

  const [collapsed, setCollapsed] = useState(false)

  const handleClick = () => {
    setCollapsed((current) => !current)
  }

  const uniforms = currentShader.getUniformList()

  if (!uniforms.length) {
    return null
  }

  const shaderParametersJSX = uniforms.map((el) => (
    <ShaderParameter key={el.name} {...el} />
  ))

  return (
    <Wrapper>
      <Row style={{ cursor: 'pointer' }}>
        <h2 onClick={handleClick}>Shader parameters</h2>
        <Icon
          icon={iconArrow}
          light
          style={!collapsed ? { transform: 'rotate(180deg)' } : {}}
        />
      </Row>

      {!collapsed && <Layout>{shaderParametersJSX}</Layout>}
    </Wrapper>
  )
}

export default ShaderParameters
