import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import useStore from 'ts/hooks/use-store'
import ShaderListItem from '../shader-list/shader-list-item'
import { Container } from '../styled/common'

const Wrapper = styled.div`
  display: block;

  .header {
    margin: 40px 0 20px 0;
    font-weight: 500;
    color: #16afb9;
    font-size: 32px;
  }

  .shaderRow {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .shaderRowLink {
    margin: 20px 0 40px 0;

    a {
      color: #16afb9;
    }

    a:hover {
      color: white;
    }
  }
`

interface Props {
  kind?: 'top' | 'featured'
}

const ShaderRow: React.FC<Props> = ({ kind = 'featured' }) => {
  const {
    state: { shaderList },
  } = useStore()

  const renderList = shaderList.slice(0, 3)

  const ElementsJSX = renderList.map((item) => (
    <ShaderListItem item={item} key={item.id} />
  ))

  return (
    <Container>
      <Wrapper>
        <h2 className="header">Featured</h2>
        <div className="shaderRow">{ElementsJSX}</div>
        <div className="shaderRowLink">
          <Link to="/">View all</Link>
        </div>
      </Wrapper>
    </Container>
  )
}

export default ShaderRow
