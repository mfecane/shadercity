import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from 'ts/components/header/header'
import 'react-toastify/dist/ReactToastify.css'

const Layout: React.FC = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default Layout
