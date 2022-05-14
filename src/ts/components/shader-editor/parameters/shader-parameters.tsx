import React, { useState } from 'react'
import useStore from 'ts/hooks/use-store'
import ShaderParameter from 'ts/components/shader-editor/parameters/shader-parameter'
import styled from 'styled-components'
import { Icon as BaseIcon, Row } from 'ts/components/styled/common'

import iconArrow from 'assets/svg/arrow-up.svg'

const Wrapper = styled.div`
  background: #1f2730;
  border-radius: 3px;
  margin-top: 8px;

  h2 {
    padding: 8px;
    font-size: 16px;
    font-weight: 400;
    background-color: rgba(0, 0, 0, 20%);
    width: 100%;
  }
`
const Layout = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  padding: 8px;
  gap: 8px 12px;
`

const Icon = styled(BaseIcon)<{ collapsed?: boolean }>`
  transform: translateY(2px)
    ${({ collapsed = false }) => !collapsed && 'rotate(180deg)'};
  margin-left: 8px;
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
        <h2 onClick={handleClick}>
          Shader parameters
          <Icon icon={iconArrow} light collapsed={collapsed} size={12} />
        </h2>
      </Row>

      {!collapsed && <Layout>{shaderParametersJSX}</Layout>}
    </Wrapper>
  )
}

export default ShaderParameters
