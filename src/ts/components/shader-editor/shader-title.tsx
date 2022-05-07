import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import useStore, { UserState } from 'ts/hooks/use-store'
import Star from 'ts/components/common/star'
import Modal from '../dialogs/modal'
import Rename from '../dialogs/rename'

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
    font-size: 18px;
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
    font-size: 26px;
  }

  h2.editable {
    cursor: pointer;
  }

  h2.editable:hover {
    color: #a7c5ff;
  }
`

const ShaderTitle: React.FC<Props> = () => {
  const {
    state: { currentShader, currentUser },
    likeShader,
    renameShader,
  } = useStore()

  const liked = currentShader.likes.includes(currentUser?.uid)
  const owned = currentShader.user.uid === currentUser?.uid

  const [open, setOpen] = useState(false)
  const handleRenameShader = async (name) => {
    await renameShader(name)
    setOpen(false)
  }

  return (
    <Wrapper>
      <div className="title">
        {owned ? (
          <>
            <h2 onClick={setOpen.bind(null, true)} className="editable">
              {currentShader.name}
            </h2>
            <Modal open={open} close={setOpen.bind(null, false)}>
              <Rename
                name={currentShader.name}
                onAccept={handleRenameShader}
                onReject={setOpen.bind(null, false)}
              />
            </Modal>
          </>
        ) : (
          <h2>{currentShader.name}</h2>
        )}
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
