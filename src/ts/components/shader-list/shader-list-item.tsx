import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { ShaderModel } from 'ts/model/shader-model'
import Star from 'ts/components/common/star'
import Spinner from '../common/spinner'

const Wrapper = styled.div`
  position: relative;
  min-height: 300px;
  cursor: pointer;
  background-color: black;
  border-radius: 5px;
  display: flex;
  flex-direction: column;

  h2 {
    color: #738390;
    font-weight: bold;
    font-size: 20px;
    display: inline-block;
  }

  .author {
    color: #286699;
    display: inline-block;
  }

  &:hover {
    background-color: #1b2028;
  }
`

const CanvasWrapper = styled.div`
  flex: 1 0 auto;
  padding: 16px;

  .innerwrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .canvasConatiner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: #2b3941 solid 1px;
  }
`

const Header = styled.div`
  padding: 12px 18px 0px 18px;
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
  flex: 0 1 70%;
  align-items: flex-start;

  h2 a {
    color: #7496ae;
  }

  h2 a:hover {
    color: #fff;
  }
`

const ShaderListItem = ({ item }): JSX.Element => {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const renderer = useRef(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      if (renderer.current) {
        renderer.current.destroy()
      }

      const shaderModel = new ShaderModel(item)
      renderer.current = await shaderModel.createRenerer(containerRef.current)
      renderer.current.renderFrame()
      setLoading(false)
    }

    load()

    return () => {
      if (renderer.current) renderer.current.destroy()
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

      <CanvasWrapper onClick={() => navigate(`/shader/${item.id}`)}>
        <div className="innerwrapper">
          {loading && <Spinner smol />}
          <div className="canvasConatiner" ref={containerRef}></div>
        </div>
      </CanvasWrapper>
    </Wrapper>
  )
}

export default ShaderListItem
