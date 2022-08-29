import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { FaShippingFast, FaMoneyBillWave, FaListAlt } from 'react-icons/fa'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { Link, useParams } from 'react-router-dom'
import { getOrderDetails, payOrder } from '../actions/orderActions'
import { ORDER_PAY_RESET } from '../constants/orderConstants'

export const OrderScreen = () => {
	const { id } = useParams()
	const [sdkReady, setSdkReady] = useState(false)

	const dispatch = useDispatch()

	const orderDetails = useSelector((state) => state.orderDetails)
	const { order, loading, error } = orderDetails

	const orderPay = useSelector((state) => state.orderPay)
	const { loading: loadingPay, success: successPay } = orderPay

	if (!loading) {
		//* calculate prices
		const addDecimals = (num) => {
			return (Math.round(num * 100) / 100).toFixed(2)
		}

		order.itemsPrice = addDecimals(
			order.orderItems.reduce((a, i) => a + i.price * i.qty, 0)
		)

		//* shipping
		order.shippingPrice = addDecimals(order.itemsPrice > 100 ? 0 : 10)

		//* tax
		order.taxPrice = addDecimals(Number((0.15 * order.itemsPrice).toFixed(2)))

		//* total cost
		order.totalPrice = (
			Number(order.itemsPrice) +
			Number(order.shippingPrice) +
			Number(order.taxPrice)
		).toFixed(2)
	}

	useEffect(() => {
		const addPayPalScript = async () => {
			const { data: clientId } = await axios.get('/api/config/paypal')
			const script = document.createElement('script')
			script.type = 'text/javascript'
			script.src = `https://www.paypal.com/sdk/js?=${clientId}&currency=USD`
			script.async = true
			script.onload = () => {
				setSdkReady(true)
			}
			document.body.appendChild(script)
		}

		if (!order || successPay) {
			dispatch({ type: ORDER_PAY_RESET })
			dispatch(getOrderDetails(id))
		} else if (!order.isPaid) {
			if (!window.paypal) {
				addPayPalScript()
			} else {
				setSdkReady(true)
			}
		}
	}, [dispatch, order, successPay, id])

	const successPaymentHandler = (paymentResult) => {
		console.log(paymentResult)
		dispatch(payOrder(id, paymentResult))
	}

	return loading ? (
		<Loader />
	) : error ? (
		<Message variant='danger'>{error}</Message>
	) : (
		<>
			<h1>Order {order._id}</h1>
			<Row>
				<Col md={8}>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h2>
								Shipping Details <FaShippingFast />
							</h2>
							<br />
							<p>
								<strong>Name: </strong>
								{order.user.name}
							</p>
							<p>
								<strong>Email: </strong>
								<a href={`mailto:${order.user.email}`}> {order.user.email}</a>
							</p>
							<p>
								<strong>Address: </strong>
								{order.shippingAddress.address}
							</p>
							<p>
								<strong>City: </strong>
								{order.shippingAddress.city}
							</p>
							<p>
								<strong>Postal Code: </strong>
								{order.shippingAddress.postalCode}
							</p>
							<p>
								<strong>Country: </strong>
								{order.shippingAddress.country}
							</p>
							{order.isDelivered ? (
								<Message variant='success'>
									Delivered on {order.deliveredAt}
								</Message>
							) : (
								<Message variant='danger'>Not Delivered</Message>
							)}
						</ListGroup.Item>
						<br />

						<ListGroup.Item>
							<h2>
								Payment Method <FaMoneyBillWave />
							</h2>
							<br />
							<p>
								<strong>Method: </strong>
								{order.paymentMethod}
							</p>
							{order.isPaid ? (
								<Message variant='success'>Paid on {order.paidAt}</Message>
							) : (
								<Message variant='danger'>Not Paid</Message>
							)}
						</ListGroup.Item>
						<br />

						<ListGroup.Item>
							<h2>
								Order Items <FaListAlt />
							</h2>
							<br />
							{order.orderItems.length === 0 ? (
								<Message>Order Is Empty</Message>
							) : (
								<ListGroup variant='flush'>
									{order.orderItems.map((item, index) => (
										<ListGroup.Item key={index}>
											<Row className='text-center'>
												<Col md={1}>
													<Image
														src={item.image}
														alt={item.name}
														fluid
														rounded
													/>
												</Col>
												<Col>
													<Link to={`/product/${item.product}`}>
														{item.name}
													</Link>
												</Col>
												<Col md={4}>
													{item.qty} x ${item.price} = ${item.qty * item.price}
												</Col>
											</Row>
										</ListGroup.Item>
									))}
								</ListGroup>
							)}
						</ListGroup.Item>
					</ListGroup>
				</Col>
				<Col md={4}>
					<Card variant=''>
						<ListGroup>
							<ListGroup.Item>
								<h2>Order Summary</h2>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Items:</Col>
									<Col>$ {order.itemsPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Shipping:</Col>
									<Col>$ {order.shippingPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Tax:</Col>
									<Col>$ {order.taxPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Total:</Col>
									<Col>$ {order.totalPrice}</Col>
								</Row>
							</ListGroup.Item>
							{!order.isPaid && (
								<ListGroup.Item>
									{loadingPay && !sdkReady ? (
										<Loader />
									) : (
										<PayPalButton
											amount={order.totalPrice}
											onSuccess={successPaymentHandler}
										/>
									)}
								</ListGroup.Item>
							)}
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default OrderScreen
