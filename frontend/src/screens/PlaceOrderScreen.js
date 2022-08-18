import React, { useEffect } from 'react'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { FaShippingFast, FaMoneyBillWave, FaListAlt } from 'react-icons/fa'
import CheckoutSteps from '../components/CheckoutSteps'
import Message from '../components/Message'
import { Link, useNavigate } from 'react-router-dom'
import { createOrder } from '../actions/orderActions'

export const PlaceOrderScreen = () => {
	const cart = useSelector((state) => state.cart)
	const dispatch = useDispatch()
	const navigate = useNavigate()

	//* calculate prices
	const addDecimals = (num) => {
		return (Math.round(num * 100) / 100).toFixed(2)
	}

	cart.itemsPrice = addDecimals(
		cart.cartItems.reduce((a, i) => a + i.price * i.qty, 0)
	)

	//* shipping
	cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 10)

	//* tax
	cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)))

	//* total
	cart.totalPrice = (
		Number(cart.itemsPrice) +
		Number(cart.shippingPrice) +
		Number(cart.taxPrice)
	).toFixed(2)

	const orderCreate = useSelector((state) => state.orderCreate)
	const { order, success, error } = orderCreate

	useEffect(() => {
		if (success) {
			navigate(`/order/${order._id}`)
		}
		// eslint-disble-next-line
	}, [success, navigate])

	const placeOrderHandler = () => {
		dispatch(
			createOrder({
				orderItems: cart.cartItems,
				shippingAddress: cart.shippingAddress,
				paymentMethod: cart.paymentMethod,
				itemsPrice: cart.itemsPrice,
				shippingPrice: cart.shippingPrice,
				taxPrice: cart.taxPrice,
				totalPrice: cart.totalPrice,
			})
		)
	}

	return (
		<>
			<CheckoutSteps step1 step2 step3 step4 />
			<Row>
				<Col md={8}>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h2>
								Shipping Details <FaShippingFast />
							</h2>
							<br />
							<p>
								<strong>Address: </strong>
								{cart.shippingAddress.address}
							</p>
							<p>
								<strong>City: </strong>
								{cart.shippingAddress.city}
							</p>
							<p>
								<strong>Postal Code: </strong>
								{cart.shippingAddress.postalCode}
							</p>
							<p>
								<strong>Country: </strong>
								{cart.shippingAddress.country}
							</p>
						</ListGroup.Item>
						<br />

						<ListGroup.Item>
							<h2>
								Payment Method <FaMoneyBillWave />
							</h2>
							<br />
							<strong>Method: </strong>
							{cart.paymentMethod}
						</ListGroup.Item>
						<br />

						<ListGroup.Item>
							<h2>
								Order Items <FaListAlt />
							</h2>
							<br />
							{cart.cartItems.length === 0 ? (
								<Message>Your Cart Is Empty</Message>
							) : (
								<ListGroup variant='flush'>
									{cart.cartItems.map((item, index) => (
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
									<Col>$ {cart.itemsPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Shipping:</Col>
									<Col>$ {cart.shippingPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Tax:</Col>
									<Col>$ {cart.taxPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Total:</Col>
									<Col>$ {cart.totalPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								{error && <Message variant='danger'>{error}</Message>}
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Button
										className='btn btn-block'
										disabled={cart.cartItems.length === 0}
										onClick={placeOrderHandler}
									>
										Place Order
									</Button>
								</Row>
							</ListGroup.Item>
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	)
}
