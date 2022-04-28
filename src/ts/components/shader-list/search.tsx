import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import useStore from 'ts/hooks/use-store'

import searchIcon from 'assets/glass.svg'

const Wrapper = styled.div`
  position: relative;
  margin: 0 8px;

  .search-bar {
    border: #333c53 1px solid;
    border-radius: 3px;
    background-color: #131a20;

    &:before {
      mask-image: url(${searchIcon});
      background-color: var(--color-accent);
      width: 22px;
      height: 22px;
      content: '';
      position: absolute;
      top: 50%;
      left: 8px;
      transform: translateY(-50%);
      mask-position: center;
      mask-repeat: no-repeat;
      mask-size: contain;
    }
  }
`

const SearchInput = styled.input`
  height: 36px;
  background-color: transparent;
  min-width: 200px;
  padding: 0 0 0 40px;
  border-radius: 3px;
  color: var(--color-accent);
  font-size: 18px;
  font-weight: bold;
`

const Search: React.FC = () => {
  const {
    state: { search },
    doSearch,
  } = useStore()
  const navigate = useNavigate()

  const handleSearch: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const search = e.target.value
    doSearch(search)
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    navigate('/list/search')
  }

  return (
    <div>
      <Wrapper>
        <form onSubmit={handleSubmit} className="search-bar">
          <SearchInput
            type="text"
            value={search || ''}
            onChange={handleSearch}
          />
        </form>
      </Wrapper>
    </div>
  )
}

export default Search
