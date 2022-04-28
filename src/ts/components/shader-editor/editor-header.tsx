import React from 'react'
import { Block, Row } from 'ts/components/styled/common'
import Logo from 'ts/components/common/logo'
import HeaderNav from 'ts/components/header/header-nav'
import styled from 'styled-components'
import EditorControls from 'ts/components/shader-editor/editor-controls'
import HeaderShwuser from 'ts/components/header/header-shwuser'

const Wrapper = styled.div`
  width: 100%;
  max-width: 100vw;
  z-index: 7;
  transition: background-color 200ms ease;
  background: radial-gradient(
    circle farthest-side at 60% 50%,
    #1f2934 0%,
    #161d24 100%
  );
  position: relative;
`

const EditorHeader: React.FC = () => {
  return (
    <Wrapper>
      <Block height={64} padding={'5px 10px'}>
        <Row space fillHeight>
          <Row gap={18}>
            <Logo smol />
            <EditorControls />
          </Row>
          <Row gap={64}>
            <HeaderNav />
            <HeaderShwuser />
          </Row>
        </Row>
      </Block>
    </Wrapper>
  )
}

export default EditorHeader
