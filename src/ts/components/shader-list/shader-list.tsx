import React, { useState } from 'react'
import ShaderListItem from 'ts/components/shader-list/shader-list-item'

import styled from 'styled-components'
import { Container } from 'ts/components/styled/common'
import { ShaderState } from 'ts/hooks/use-store'
import Paginator, { MAX_ITEMS } from './paginator'

import { sortByRating } from 'ts/model/helpers'

const List = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  height: 100%;
  overflow-y: auto;
  margin-bottom: 60px;
`

interface Props {
  list: ShaderState[]
}

const ShaderList: React.FC<Props> = ({ list }) => {
  const [page, setPage] = useState(0)

  let renderList = list

  const totalItems = renderList.length
  renderList = renderList
    .sort(sortByRating)
    .filter(
      (el: any, index: number) =>
        index >= page * MAX_ITEMS && index < (page + 1) * MAX_ITEMS
    )

  const elementsJSX = renderList.map((item: ShaderState) => {
    return <ShaderListItem item={item} key={item.id} />
  })

  return (
    <>
      <List>
        {!!renderList.length && elementsJSX}
        {!renderList.length && 'Empty'}
      </List>
      <Paginator count={totalItems} setPage={setPage} />
    </>
  )
}

export default ShaderList
