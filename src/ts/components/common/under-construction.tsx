import React from 'react'
import styled from 'styled-components'

import underConstruction from 'assets/svg/under-construction.svg'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: calc(100vh - 180px);

  img {
    width: 40vw;
    height: auto;
  }
`

const UnderConstruction: React.FC = () => {
  return (
    <>
      <Wrapper>
        <img src={underConstruction} />
      </Wrapper>
    </>
  )
}

export default UnderConstruction

