import { FieldValue } from 'firebase/firestore'
import React, { createContext, useContext, useEffect, useReducer } from 'react'
import useAuth from 'ts/hooks/use-auth'
import firestore from 'ts/model/firestore'
import { ShaderModel } from 'ts/model/shader-model'
import Shader from 'ts/webgl/shader'

export interface UserState {
  email: string
  name?: string
  uid: string
}

export interface ShaderState {
  id?: string
  code: string
  name: string
  user: UserState | string
  error?: boolean
  updated: FieldValue
  likes: Array<string>
}

interface State {
  shaderList: ShaderState[]
  userList: UserState[]
  currentUser: UserState
  currentShader: ShaderModel
  shaderListLoading: boolean
  shaderError: string[]
  search: string
}

const initialState: State = {
  shaderList: [],
  userList: [],
  shaderListLoading: true,
  currentUser: null,
  currentShader: null,
  shaderError: null,
  search: '',
}

interface Context {
  state: State
  updateCurrentUser: () => Promise<void>
  createShader: () => Promise<ShaderState>
  setCurrentShader: () => Promise<void>
  saveShader: () => Promise<void>
  updateShader: (shader: ShaderModel) => void
  forkShader: () => Promise<ShaderState>
  setShaderError: (s: string[]) => void
  getuserById: (id: string) => UserState
  doSearch: (s: string) => void
  likeShader: () => void
  deleteShader: () => Promise<void>
  renameShader: (n: string) => Promise<void>
}

export const FirestoreContext = createContext<Context>(undefined)

const useStore = (): Context => {
  return useContext<Context>(FirestoreContext)
}
type Action =
  | { type: 'SET_CURRENT_USER'; payload: UserState }
  | { type: 'UPDATE_CURRENT_USER'; payload: UserState }
  | {
      type: 'SET_SHADER_LIST'
      payload: ShaderState[]
    }
  | { type: 'CREATE_SHADER'; payload: ShaderState }
  | { type: 'SET_CURRENT_SHADER'; payload: string }
  | { type: 'SAVE_SHADER'; payload: ShaderState }
  | { type: 'UPDATE_CURRENT_SHADER'; payload: ShaderModel }
  | { type: 'SET_USER_LIST'; payload: UserState[] }
  | { type: 'SET_SHADER_ERROR'; payload: string[] }
  | { type: 'LOADING_FINISHED'; payload?: null }
  | { type: 'SEARCH'; payload: string }
  | { type: 'LIKE_SHADER'; payload?: null }
  | { type: 'DELETE_SHADER'; payload: string }

const reducer = (state: State, action: Action) => {
  const { type, payload } = action

  switch (type) {
    case 'SET_CURRENT_USER':
      return {
        ...state,
        currentUser: payload,
      }

    case 'UPDATE_CURRENT_USER': {
      const currentUser = { ...state.currentUser, payload }
      return {
        ...state,
        currentUser: currentUser,
      }
    }

    case 'SET_SHADER_LIST':
      return { ...state, shaderList: payload }

    case 'SET_USER_LIST':
      return { ...state, userList: payload }

    case 'LOADING_FINISHED':
      return { ...state, shaderListLoading: false }

    case 'CREATE_SHADER': {
      const shader = { ...payload, user: { ...state.currentUser } }
      const shaderList = [...state.shaderList, shader]

      return {
        ...state,
        shaderList: shaderList,
      }
    }

    case 'SET_CURRENT_SHADER': {
      if (state.currentShader?.id === payload) {
        return state
      }
      const shader = state.shaderList.find((el) => el.id === payload)
      if (!shader) return state
      const shaderModel = new ShaderModel(shader)
      return {
        ...state,
        currentShader: shaderModel,
      }
    }

    case 'SAVE_SHADER': {
      const idx = state.shaderList.findIndex((el) => el.id === payload.id)
      if (idx === -1) {
        throw new Error('Shader id error')
      }

      const shaderList = [...state.shaderList]
      shaderList.splice(idx, 1, payload)

      return {
        ...state,
        shaderList,
      }
    }

    case 'UPDATE_CURRENT_SHADER': {
      return { ...state, currentShader: payload, shaderError: null }
    }

    case 'DELETE_SHADER': {
      const idx = state.shaderList.findIndex((el) => el.id === payload)
      const list = [...state.shaderList]
      list.splice(idx, 1)
      return { ...state, shaderList: list }
    }

    case 'SET_SHADER_ERROR': {
      return { ...state, shaderError: payload }
    }

    case 'SEARCH':
      return { ...state, search: payload }

    case 'LIKE_SHADER': {
      const id = state.currentUser.uid
      const likes = state.currentShader.likes || []
      if (likes.includes(id)) {
        const index = likes.findIndex((el) => el === id)
        likes.splice(index, 1)
      } else {
        likes.push(state.currentUser.uid)
      }
      return {
        ...state,
        currentShader: { ...state.currentShader, likes: [...likes] },
      }
    }

    default:
      return state
  }
} // reducer

export const FirestoreContextProvider = ({
  children,
}: {
  children: React.ReactNode
}): JSX.Element => {
  const { currentUser } = useAuth()
  const [state, dispatch] = useReducer(reducer, initialState)

  const initCurrentUser = () => {
    const read = async () => {
      const user = await firestore.readUser(currentUser)
      if (!user) {
        return
      }
      dispatch({
        type: 'SET_CURRENT_USER',
        payload: user,
      })
    }

    read()
  }

  const initShaderData = () => {
    const read = async () => {
      const [shaders, users] = await firestore.readShaders()
      dispatch({
        type: 'SET_SHADER_LIST',
        payload: shaders,
      })

      dispatch({
        type: 'SET_USER_LIST',
        payload: users,
      })

      dispatch({
        type: 'LOADING_FINISHED',
        payload: null,
      })
    }
    read()
  }

  useEffect(initCurrentUser, [currentUser])
  useEffect(initShaderData, [])

  const updateCurrentUser = async (data: UserState) => {
    firestore.saveUser(data, state.currentUser)
    dispatch({
      type: 'UPDATE_CURRENT_USER',
      payload: data,
    })
  }

  const createShader = async (name: string): Promise<ShaderState> => {
    const shader = await firestore.createShader(name, currentUser)
    dispatch({
      type: 'CREATE_SHADER',
      payload: shader,
    })
    return shader
  }

  const setCurrentShader = (id: string) => {
    dispatch({
      type: 'SET_CURRENT_SHADER',
      payload: id,
    })
  }

  const updateShader: Context['updateShader'] = (shader) => {
    dispatch({
      type: 'UPDATE_CURRENT_SHADER',
      payload: shader.clone(),
    })
  }

  const saveShader = async () => {
    const shader = state.currentShader.toState()
    await firestore.saveShader(shader)
    dispatch({
      type: 'SAVE_SHADER',
      payload: shader,
    })
  }

  const forkShader: Context['forkShader'] = async () => {
    const shader = await firestore.forkShader(
      state.currentShader.toState(),
      state.currentUser
    )
    dispatch({
      type: 'CREATE_SHADER',
      payload: shader,
    })
    return shader
  }

  const setShaderError: Context['setShaderError'] = (error) => {
    dispatch({
      type: 'SET_SHADER_ERROR',
      payload: error,
    })
  }

  const getuserById = (uid: string) => {
    if (state.userList) {
      console.error('userList not loaded')
    }
    return (state.userList || []).find((u) => u.uid === uid)
  }

  const doSearch: Context['doSearch'] = (payload) => {
    dispatch({
      type: 'SEARCH',
      payload,
    })
  }

  const likeShader = () => {
    const likes = state.currentShader.likes
    if (likes.includes(state.currentUser.uid)) {
      const index = likes.findIndex((el) => el === state.currentUser.uid)
      likes.splice(index, 1)
    } else {
      likes.push(state.currentUser.uid)
    }
    const shader = state.currentShader.clone()
    shader.likes = likes
    firestore.saveShader(shader)
    dispatch({
      type: 'UPDATE_CURRENT_SHADER',
      payload: shader,
    })
  }

  const deleteShader: Context['deleteShader'] = async () => {
    const id = state.currentShader.id
    if (state.currentShader.user.uid !== state.currentUser.uid) {
      throw new Error('Wrong user')
    }
    await firestore.deleteShader(id)

    dispatch({
      type: 'DELETE_SHADER',
      payload: id,
    })
  }

  const renameShader: Context['renameShader'] = async (name: string) => {
    const shader = state.currentShader.clone()
    shader.name = name
    dispatch({
      type: 'UPDATE_CURRENT_SHADER',
      payload: shader,
    })
    return await firestore.saveShader(shader)
  }

  const setShaderParameter = async (name, value) => {
    state.currentShader.setShaderParameter(name, value)
    const shader = state.currentShader.clone()
    dispatch({
      type: 'UPDATE_CURRENT_SHADER',
      payload: shader,
    })
  }

  const context = {
    state,
    updateCurrentUser,
    createShader,
    setCurrentShader,
    saveShader,
    updateShader,
    forkShader,
    setShaderError,
    getuserById,
    doSearch,
    likeShader,
    deleteShader,
    renameShader,
    setShaderParameter,
  }

  return (
    <FirestoreContext.Provider value={context}>
      {!state.shaderListLoading && children}
    </FirestoreContext.Provider>
  )
}

export default useStore
