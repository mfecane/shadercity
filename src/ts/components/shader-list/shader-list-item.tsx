import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { ShaderModel } from 'ts/model/shader-model'
import Star from 'ts/components/common/star'
import Spinner from '../common/spinner'
import { ShaderState } from 'ts/hooks/use-store'
import Renderer from 'ts/renderer/renderer'

const Wrapper = styled.div`
  position: relative;
  min-height: 300px;
  cursor: pointer;
  background: radial-gradient(
    circle farthest-corner at 30% 50%,
    #1a1f24 0%,
    #181e24 100%
  );
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  display: flex;
  flex-direction: column;

  h2 {
    color: #738390;
    font-weight: bold;
    font-size: 18px;
    display: inline-block;
  }

  &:hover {
    background-color: #1b2028;
  }
`

const CanvasWrapper = styled.div`
  flex: 1 0 auto;
  padding: 8px 16px 16px 16px;

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
  padding: 18px 18px 0 18px;
  position: relative;
  z-index: 5;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  .shader-item-header-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 0 1 70%;
    align-items: flex-start;
  }

  .shader-item-header {
    font-weight: 500;

    a {
      color: #e0e5e5;
    }

    a:hover {
      color: var(--color-accent);
    }
  }

  .shader-item-author {
    color: #879097;
    font-size: 14px;

    a {
      color: #879097;
      display: inline-block;
    }

    a:hover {
      color: #aec7d2;
      display: inline-block;
    }
  }

  .shader-item-star {
    display: flex;
    gap: 6px;
    align-items: center;
    color: #95b9d4;
  }
`

interface Props {
  item: ShaderState
}

const ShaderListItem: React.FC<Props> = ({ item }) => {
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
      if (renderer.current && renderer.current instanceof Renderer)
        renderer.current.destroy()
    }
  }, [])

  return (
    <Wrapper>
      <Header error={item.error}>
        <div className="shader-item-header-group">
          <h2 className="shader-item-header">
            <Link to={`/shader/${item.id}`}>{item.name}</Link>
          </h2>
          {item.user && (
            <span className="shader-item-author">
              by{' '}
              <Link to={`/list/user/${item.user.uid}`}>{item.user.name}</Link>
            </span>
          )}
        </div>
        <div className="shader-item-star">
          <Star value={item.likes.length} />
        </div>
      </Header>

      <CanvasWrapper onClick={() => navigate(`/shader/${item.id}`)}>
        <div className="innerwrapper">
          {loading && <Spinner />}
          <div className="canvasConatiner" ref={containerRef}></div>
        </div>
      </CanvasWrapper>
    </Wrapper>
  )
}

export default ShaderListItem
