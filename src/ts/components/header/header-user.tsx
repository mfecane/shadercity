import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import useStore from 'ts/hooks/use-store'
import UserMenu from 'ts/components/header/user-menu'
import Gravatar from 'react-gravatar'

const Wrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  align-self: stretch;
`

const UserName = styled.div`
  font-weight: bold;
  color: ${({ theme }) => {
    theme.accent
  }};
`

const MenuContainer = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: radial-gradient(
    circle farthest-side at 60% 50%,
    #1a222c 0%,
    #13191f 100%
  );
  padding: 10px;
  z-index: 6;
`

const HeaderUser: React.FC = () => {
  const {
    state: { currentUser },
  } = useStore()
  const [showMenu, setShowMenu] = useState(false)
  const ref = useRef()

  const hadleMenuClick = (e) => {
    setShowMenu((current) => !current)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      event.stopPropagation()
      if (!ref?.current?.contains(event.target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
  }, [ref])

  return (
    <Wrapper ref={ref}>
      <UserName>
        <Link to="/account">{currentUser?.name || currentUser?.email}</Link>
      </UserName>
      <Gravatar
        onClick={hadleMenuClick}
        default="monsterid"
        email={currentUser?.email}
        style={{
          borderRadius: '4px',
          width: 42,
          height: 42,
          cursor: 'pointer',
        }}
      />
      {showMenu && (
        <MenuContainer>
          <UserMenu />
        </MenuContainer>
      )}
    </Wrapper>
  )
}

export default HeaderUser
