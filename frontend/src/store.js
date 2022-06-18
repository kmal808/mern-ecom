import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'

const store = configureStore({
  reducer: {},
  preloadState: {},
  middleware: [thunk],
})

export default store
