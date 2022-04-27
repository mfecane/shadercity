import React, { useRef } from 'react'

import { Form, Input, InputGroup, Label } from 'ts/components/styled/form'

import { Button, Header1 } from 'ts/components/styled/common'

const Rename: React.FC = ({ name, onAccept, onReject }) => {
  const nameRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    onAccept(nameRef.current.value)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Header1>Rename shader</Header1>
      <InputGroup>
        <Label>Name</Label>
        <Input type="text" ref={nameRef} defaultValue={name} />
      </InputGroup>
      <InputGroup>
        <Button onClick={handleSubmit}>Save</Button>
        <Button onClick={onReject}>Close</Button>
      </InputGroup>
    </Form>
  )
}

export default Rename
