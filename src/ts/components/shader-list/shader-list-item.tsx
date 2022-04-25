import React, { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { ShaderModel } from 'ts/model/shader-model'
import Star from 'ts/components/common/star'

const Wrapper = styled.div`
  position: relative;
  min-height: 300px;
  cursor: pointer;

  &:hover {
    background-color: rgba(90, 167, 234, 0.142);
  }

  h2 {
    font-weight: bold;
    font-size: 20px;
    display: inline-block;
  }

  .canvasConatiner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .author {
    color: #447095;
    display: inline-block;
  }
`

const Header = styled.div`
  background-color: ${({ error }) => {
    if (error) return '#e30000'
    return '#000000'
  }};
  padding: 12px 18px;
  position: relative;
  z-index: 5;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`

const StarGroup = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  color: #95b9d4;
`

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
  flex: 0 1 70%;
`

const ShaderListItem = ({ item }): JSX.Element => {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const renderer = useRef(null)

  // console.log('ShaderListItem', item)

  useEffect(() => {
    if (renderer.current) {
      renderer.current.destroy()
    }

    const shaderModel = new ShaderModel()
    shaderModel.setSource(item.code)
    renderer.current = shaderModel.createRenerer(containerRef.current)
    renderer.current.renderFrame()

    if (renderer.current)
      return () => {
        renderer.current.destroy()
      }
  }, [])

  return (
    <Wrapper>
      <Header error={item.error}>
        <TitleGroup>
          <h2>
            <Link to={`/shader/${item.id}`}>{item.name}</Link>
          </h2>
          {item.user && (
            <span className="author">
              by{' '}
              <Link to={`/list/user/${item.user.uid}`}>{item.user.name}</Link>
            </span>
          )}
        </TitleGroup>
        <StarGroup>
          <Star smol /> <span>{item.likes.length || 0}</span>
        </StarGroup>
      </Header>

      <div></div>
      <div className="canvasConatiner" ref={containerRef}></div>
    </Wrapper>
  )
}

export default ShaderListItem
