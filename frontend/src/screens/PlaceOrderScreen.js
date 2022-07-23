import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
	Button,
	Row,
	Col,
	ListGroup,
	Image,
	Card,
	Accordian,
	ListGroupItem,
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import CheckoutSteps from '../components/CheckoutSteps'
import Message from '../components/Message'
import { Link } from 'react-router-dom'

export const PlaceOrderScreen = () => {
	const cart = useSelector((state) => state.cart)

	//* calculate prices
	const addDecimals = (num) => {
		return (Math.round(num * 100) / 100).toFixed(2)
	}

	cart.itemsPrice = addDecimals(
		cart.cartItems.reduce((a, i) => a + i.price * i.qty, 0)
	)

	return (
		<>
			<CheckoutSteps step1 step2 step3 step4 />
			<Row>
				<Col md={8}>
					<ListGroup variant='flush'>
						<ListGroupItem>
							<h2>Shipping</h2>
							<p>
								<strong>Address:</strong>
								{cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}
								{cart.shippingAddress.postalCode},{' '}
								{cart.shippingAddress.country}
							</p>
						</ListGroupItem>
					</ListGroup>
				</Col>
			</Row>
		</>
	)
}
