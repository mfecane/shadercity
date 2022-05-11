import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import useStore from 'ts/hooks/use-store'

const colors = [
  '#28cb3b',
  '#e4c02e',
  '#d41837',
  '#14bcef',
  '#d515e7',
  '#1523e7',
  '#e78215',
  '#9eb0b7',
  '#e71585',
  '#9fff22',
]

interface ItemProps {
  index: number
  selected: boolean
}

const Item = styled.div<ItemProps>`
  width: 18px;
  height: 18px;
  display: inline-flex;
  border-radius: 4px;
  margin-right: 4px;
  background-color: ${({ index }) => colors[index % 10]};
  ${({ selected }) => {
    return (
      selected &&
      css`
        border: 2px solid white;
      `
    )
  }}
`

const Icon = styled.div`
  width: 12px;
  height: 12px;
  background-color: white;

  button:disabled & {
    background-color: #888;
  }
`

const But = styled.button`
  margin-right: 4px;
  width: 18px;
  height: 18px;
  display: inline-grid;
  place-items: center;
`

const Button: React.FC<{
  icon: 'plus' | 'minus'
  onClick: () => void
  disabled?: boolean
}> = ({ icon, onClick, disabled }) => {
  const icons = {
    plus: 'icon-plus',
    minus: 'icon-minus',
  }
  return (
    <But
      style={{
        marginRight: '4px',
        width: '18px',
        height: '18px',
      }}
      disabled={disabled}
    >
      <Icon className={`icon ${icons[icon]}`} onClick={onClick}></Icon>
    </But>
  )
}

const Wrapper = styled.div`
  margin: 0 0 6px 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
`

const ShaderSteps: React.FC = () => {
  const {
    state: { currentShader, editorCode },
    setStep,
    addStep,
    removeStep,
    setShaderError,
    updateShader,
  } = useStore()

  const [selected, setSelected] = useState(-1)

  // FIXME bruh it is straight copy
  const handleUpdateShader = () => {
    currentShader.setSource(editorCode)
    const error = currentShader.validate()
    if (error) {
      setShaderError(error)
      return false
    }
    updateShader(currentShader)
    return true
  }

  useEffect(() => {
    console.log('heer')
    if (editorCode !== currentShader.steps[selected]) setSelected(-1)
  }, [editorCode])

  const stepsJSX = currentShader.steps.map((el, index) => (
    <Item
      key={index}
      index={index}
      selected={selected === index}
      onClick={() => {
        setSelected(index)
        setStep(index)
      }}
    />
  ))

  return (
    <Wrapper>
      {stepsJSX}
      <Button
        icon={'plus'}
        onClick={() => {
          const res = handleUpdateShader()
          if (res) addStep()
        }}
      />
      <Button
        icon={'minus'}
        onClick={() => {
          removeStep(selected)
        }}
        disabled={selected === -1 || !currentShader.steps.length}
      />
    </Wrapper>
  )
}

export default ShaderSteps
