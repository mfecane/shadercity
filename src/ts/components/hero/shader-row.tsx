import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import useStore from 'ts/hooks/use-store'
import { sortByRating } from 'ts/model/helpers'
import ShaderListItem from 'ts/components/shader-list/shader-list-item'
import { Container } from 'ts/components/styled/common'

const Wrapper = styled.div`
  display: block;

  .header {
    margin: 32px 0 20px 0;
    font-weight: 500;
    color: var(--color-accent);
    font-size: 32px;
    text-transform: capitalize;
  }

  .shaderRow {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .shaderRowLink {
    margin: 20px 0 40px 0;

    a {
      color: #dde2e5;
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

  let renderList

  if (kind === 'featured') {
    renderList = shaderList.filter((el) => el.featured).slice(0, 3)
  }

  if (kind === 'top') {
    renderList = shaderList.sort(sortByRating).slice(0, 3)
  }

  const ElementsJSX = renderList.map((item) => (
    <ShaderListItem item={item} key={item.id} />
  ))

  return (
    <Container>
      <Wrapper>
        <h2 className="header">{kind}</h2>
        <div className="shaderRow">{ElementsJSX}</div>
        <div className="shaderRowLink">
          <Link to="/list/">View all</Link>
        </div>
      </Wrapper>
    </Container>
  )
}

export default ShaderRow
