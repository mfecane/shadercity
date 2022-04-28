import React, { useEffect } from 'react'
import styled from 'styled-components'
import useStore from 'ts/hooks/use-store'
import Spinner from 'ts/components/common/spinner'
import { Container } from '../styled/common'
import ShaderList from './shader-list'

const Wrapper = styled.div`
  overflow: auto;
  min-height: 0;

  h3.list-header {
    font-size: 1.625rem;
    margin: 30px 0;
    color: #2d5767;
    font-weight: 500;
  }
`

const FullList: React.FC = () => {
  const {
    state: { shaderList },
    doSearch,
  } = useStore()

  // TODO handle this hit better
  useEffect(() => {
    doSearch('')
  }, [])

  return (
    <Wrapper>
      <Container>
        <h3 className="list-header">Shader gallery</h3>
        <ShaderList list={shaderList} />
      </Container>
    </Wrapper>
  )
}

export default FullList
