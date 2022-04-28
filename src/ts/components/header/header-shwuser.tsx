import React from 'react'
import useStore from 'ts/hooks/use-store'
import HeaderAuth from 'ts/components/header/header-auth'
import HeaderUser from 'ts/components/header/header-user'

const HeaderShwuser = () => {
  const {
    state: { currentUser },
  } = useStore()

  if (currentUser) {
    return <HeaderUser />
  }

  return <HeaderAuth />
}

export default HeaderShwuser
