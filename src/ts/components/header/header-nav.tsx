import React from 'react'
import useStore from 'ts/hooks/use-store'
import { Row, StyledLink } from '../styled/common'

const HeaderNav: React.FC = () => {
  const {
    state: { currentUser },
  } = useStore()

  return (
    <Row gap={32}>
      <StyledLink $bold to="/">
        Home
      </StyledLink>
      <StyledLink $bold to="/list">
        Browse
      </StyledLink>
      <StyledLink $bold to="/tutorials">
        Tutorials
      </StyledLink>
      {currentUser && (
        <StyledLink $bold to="/create">
          Create
        </StyledLink>
      )}
    </Row>
  )
}

export default HeaderNav
