import express from 'express'
import {
	addOrderItems,
	getOrderById,
	updateOrderToPaid,
	getMyOrders,
} from '../controllers/orderController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').post(protect, addOrderItems)
router.route('/:id').get(protect, getOrderById)
router.route('/:id/pay').put(protect, updateOrderToPaid)
router.route('/getmyorders').get(protect, getMyOrders)

export default router
