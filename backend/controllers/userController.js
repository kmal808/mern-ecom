import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'

//* @desc    Auth user & get token
//* @route   POST /api/users/login
//* @access  Public

const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body //? this is from the client side

	const user = await User.findOne({ email }) //? find user with this email

	if (user && (await user.matchPassword(password))) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id),
		})
	} else {
		res.status(401) //? 401 is unauthorized
		throw new Error('Invalid email or password')
	}
})

//* @desc    Register a new user
//* @route   POST /api/users
//* @access  Public

const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body //? this is from the client side

	const userExists = await User.findOne({ email }) //? find user with this email

	if (userExists) {
		res.status(400) //? bad request
		throw new Error('User already exists')
	}

	const user = await User.create({
		//? creates user
		name,
		email,
		password,
	})

	if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id),
		})
	} else {
		res.status(400)
		throw new Error('Invalid user data')
	}
})

//* @desc    Get user profile
//* @route   GET /api/users/login
//* @access  Private

const getUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id)

	if (user) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
		})
	} else {
		res.status(404)
		throw new Error('User not found')
	}
})

export { authUser, registerUser, getUserProfile }
