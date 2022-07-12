import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import {
	productListReducer,
	productDetailsReducer,
} from './reducers/productReducers'
import { cartReducer } from './reducers/cartReducers'
import { userLoginReducer } from './reducers/userReducers'

const cartItemsFromStorage = localStorage.getItem('cartItems')
	? JSON.parse(localStorage.getItem('cartItems'))
	: []

const initialState = {
	cart: { cartItems: cartItemsFromStorage },
}
const reducer = {
	productList: productListReducer,
	productDetails: productDetailsReducer,
	cart: cartReducer,
	userLogin: userLoginReducer,
}
const middleware = [thunk]

const store = configureStore({
	reducer,
	middleware,
	devTools: process.env.NODE_ENV !== 'production',
	preloadedState: initialState,
})

export default store
