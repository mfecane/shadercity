import React from 'react'
import styled from 'styled-components'
import useAuth from 'ts/hooks/use-auth'
import { Link } from 'react-router-dom'

const Wrapper = styled.div`
  hr {
    margin: 12px 12px;
    height: 2px;
    background-color: #70aac2;
  }
`

const Option = styled.div`
  padding: 12px 16px;
  font-weight: bold;
  min-width: 280px;

  a {
    cursor: pointer;
    color: #6894a7;
  }

  a:hover {
    color: #70aac2;
    text-decoration: underline;
  }
`

const UserMenu: React.FC = () => {
  const { signout } = useAuth()

  return (
    <Wrapper>
      <Option>
        <Link to="/create">Create shader</Link>
      </Option>
      <Option>
        <Link to="/list/my">Your shaders</Link>
      </Option>
      <hr />
      <Option>
        <Link to="/account">Profile</Link>
      </Option>
      <Option>
        <a onClick={signout}>Logout</a>
      </Option>
    </Wrapper>
  )
}

export default UserMenu
