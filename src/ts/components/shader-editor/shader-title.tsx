import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import useStore, { UserState } from 'ts/hooks/use-store'
import Star from 'ts/components/common/star'

const Wrapper = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 16px;

  .title {
    display: flex;
    gap: 10px;
    align-items: flex-end;
  }

  .author {
    font-size: 24px;
    color: #34586c;
  }

  .rating {
    font-size: 24px;
    color: #3b82a8;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  h2 {
    font-size: 36px;
  }
`

const ShaderTitle = (): JSX.Element => {
  const {
    state: { currentShader, currentUser },
    likeShader,
  } = useStore()

  const liked = currentShader.likes.includes(currentUser.uid)

  return (
    <Wrapper>
      <div className="title">
        <h2>{currentShader.name}</h2>
        <span className="author">
          by{' '}
          <Link to={`/list/user/${currentShader.user.uid}`}>
            {currentShader.user.name}
          </Link>
        </span>
      </div>
      <span className="rating">
        <Star active={liked} onClick={likeShader} />
        {currentShader.likes.length}
      </span>
    </Wrapper>
  )
}

export default ShaderTitle
