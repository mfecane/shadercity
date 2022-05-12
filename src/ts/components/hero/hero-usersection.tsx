import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'ts/components/styled/common'
import useStore from 'ts/hooks/use-store'

const HeroUserSection: React.FC = () => {
  const {
    state: { currentUser },
  } = useStore()

  if (currentUser) {
    return (
      <div>
        <div className="hero-user-group">
          <div className="hero-user-caption">Welcome, {currentUser.name}</div>
          <div className="hero-user-buttons">
            <Link to="/create" className="hero-user-button">
              <Button secondary>Create</Button>
            </Link>
            <Link to="/list/my" className="hero-user-button">
              <Button secondary>Your shaders</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="hero-user-group">
        <div className="hero-user-caption">
          or <span>become</span> a member
        </div>
        <div className="hero-user-buttons">
          <Link to="/login" className="hero-user-button">
            <Button secondary>Log In</Button>
          </Link>
          <Link to="/signup" className="hero-user-button">
            <Button secondary>Sign Up</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HeroUserSection
