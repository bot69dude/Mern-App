import { configureStore } from '@reduxjs/toolkit'
import todoReducer from './Todo-Slice'
import authReducer from './Auth-Slice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    todos: todoReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store