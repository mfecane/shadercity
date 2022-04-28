import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import useAuth from 'ts/hooks/use-auth'
import Search from 'ts/components/shader-list/search'
import { StyledLink } from 'ts/components/styled/common'

const Wrapper = styled.div`
  display: flex;
  gap: 20px;
  justify-self: stretch;
  align-items: center;
`

const Nav: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  return (
    <Wrapper>
      <Search />
      <StyledLink to="/">Home</StyledLink>
      <StyledLink to="/list">Browse</StyledLink>
      <StyledLink to="/tutorials">Tutorials</StyledLink>
      {currentUser && <StyledLink to="/create">Create</StyledLink>}
    </Wrapper>
  )
}

export default Nav
