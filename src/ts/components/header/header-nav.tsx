import React from 'react'
import useAuth from 'ts/hooks/use-auth'
import { Row, StyledLink } from '../styled/common'

const HeaderNav: React.FC = () => {
  const { currentUser } = useAuth()

  return (
    <Row gap={32}>
      <StyledLink bold to="/">
        Home
      </StyledLink>
      <StyledLink bold to="/list">
        Browse
      </StyledLink>
      <StyledLink bold to="/tutorials">
        Tutorials
      </StyledLink>
      {currentUser && (
        <StyledLink bold to="/create">
          Create
        </StyledLink>
      )}
    </Row>
  )
}

export default HeaderNav
