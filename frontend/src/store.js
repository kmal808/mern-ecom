import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import { productListReducer } from './reducers/productReducers'

const initialState = {}
const reducer = {
  productList: productListReducer,
}
const middleware = [thunk]

const store = configureStore({
  reducer,
  middleware,
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState: initialState,
})

export default store
