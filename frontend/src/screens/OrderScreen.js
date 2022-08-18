import React, { useEffect } from 'react'
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { FaShippingFast, FaMoneyBillWave, FaListAlt } from 'react-icons/fa'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { Link, useParams } from 'react-router-dom'
import { getOrderDetails } from '../actions/orderActions'

export const OrderScreen = () => {
	const { id } = useParams()
	const dispatch = useDispatch()

	const orderDetails = useSelector((state) => state.orderDetails)
	const { order, loading, error } = orderDetails

	if (!loading) {
		//* calculate prices
		const addDecimals = (num) => {
			return (Math.round(num * 100) / 100).toFixed(2)
		}

		order.itemsPrice = addDecimals(
			order.orderItems.reduce((a, i) => a + i.price * i.qty, 0)
		)
	}

	useEffect(() => {
		dispatch(getOrderDetails(id))
	}, [dispatch, id])

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
						</ListGroup.Item>
						<br />

						<ListGroup.Item>
							<h2>
								Payment Method <FaMoneyBillWave />
							</h2>
							<br />
							<strong>Method: </strong>
							{order.paymentMethod}
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
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	)
}

export default OrderScreen
