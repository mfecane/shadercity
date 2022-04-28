import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { FirestoreContextProvider } from 'ts/hooks/use-store'
import { AuthContextProvider } from 'ts/hooks/use-auth'
import { ToastContainer } from 'react-toastify'

import Create from 'ts/components/create'
import Account from 'ts/components/auth/account'
import Forgot from 'ts/components/auth/forgot'
import SignUp from 'ts/components/auth/signup'
import Layout from 'ts/components/layout'
import LogIn from 'ts/components/auth/login'
import Shader from 'ts/components/shader-editor/shader'
import FullList from 'ts/components/shader-list/full-list'
import UserList from 'ts/components/shader-list/user-list'
import SearchList from 'ts/components/shader-list/search-list'
import Hero from 'ts/components/pages/hero'
import NotFound from 'ts/components/pages/404'

const App: React.FC = () => {
  return (
    <AuthContextProvider>
      <FirestoreContextProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<Hero />} />
            <Route path="/list" element={<Layout />}>
              <Route path="search/" element={<SearchList />} />
              <Route path="user/:userId" element={<UserList />} />
              <Route path="my" element={<UserList />} />
              <Route index element={<FullList />} />
            </Route>
            <Route path="shader/:shaderId" element={<Shader />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/forgot" element={<Forgot />} />
            <Route path="/account" element={<Account />} />
            <Route path="/create" element={<Create />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer theme="dark" />
      </FirestoreContextProvider>
    </AuthContextProvider>
  )
}

export default App
