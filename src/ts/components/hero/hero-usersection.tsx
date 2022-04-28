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
        <div className="enter-group">
          <div className="enter-label">Welcome, {currentUser.name}</div>
          <div className="enter-button-container">
            <Link to="/create">
              <Button secondary className="enter-button">
                Create
              </Button>
            </Link>
            <Link to="/list/my">
              <Button secondary className="enter-button">
                View your shaders
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="enter-group">
        <div className="enter-label">Become a citizen</div>
        <div className="enter-button-container">
          <Button secondary className="enter-button">
            Log In
          </Button>
          <Button secondary className="enter-button">
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HeroUserSection
