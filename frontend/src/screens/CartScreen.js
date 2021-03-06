import React, { useEffect } from 'react'
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaRegHeart, FaRegTrashAlt } from 'react-icons/fa'
import {
	Row,
	Col,
	ListGroup,
	Image,
	Form,
	Button,
	Card,
	ListGroupItem,
} from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../actions/cartActions'

const CartScreen = () => {
	const { id } = useParams()
	const productId = id

	const location = useLocation()
	const qty = new URLSearchParams(location.search).get('qty')

	const dispatch = useDispatch()

	const cart = useSelector((state) => state.cart)
	const { cartItems } = cart

	const navigate = useNavigate()

	useEffect(() => {
		if (productId) {
			dispatch(addToCart(productId, qty))
			navigate('/cart')
		}
	}, [dispatch, productId, qty, navigate])

	const removeFromCartHandler = (id) => {
		dispatch(removeFromCart(id))
		navigate('/cart')
	}

	const checkoutHandler = () => {
		if (localStorage.getItem('userInfo')) {
			navigate('/shipping')
		} else {
			navigate('/login')
		}
	}

	return (
		<Row>
			<Col md={8}>
				<h1>Shopping Cart</h1>
				{cartItems.length === 0 ? (
					<Message>
						Your cart is empty{' '}
						<Link to='/'>
							Browse For Products <FaRegHeart color='red' />
						</Link>
					</Message>
				) : (
					<ListGroup variant='flush'>
						{cartItems.map((item) => (
							<ListGroupItem key={item.product}>
								<Row>
									<Col md={2}>
										<Image src={item.image} alt={item.name} fluid rounded />
									</Col>
									<Col md={3}>
										<Link to={`/product/${item.product}`}>{item.name}</Link>
									</Col>
									<Col md={2}>${item.price}</Col>
									<Col md={2}>
										<Form.Select
											as='select'
											value={item.qty}
											onChange={(e) =>
												dispatch(
													addToCart(item.product, Number(e.target.value))
												)
											}
										>
											{[...Array(item.countInStock).keys()].map((x) => (
												<option key={x + 1} value={x + 1}>
													{x + 1}
												</option>
											))}
										</Form.Select>
									</Col>
									<Col md={2}>
										<Button
											type='button'
											variant='light'
											onClick={() => removeFromCartHandler(item.product)}
										>
											<FaRegTrashAlt color='red' />
										</Button>
									</Col>
								</Row>
							</ListGroupItem>
						))}
					</ListGroup>
				)}
			</Col>
			<Col md={4}>
				<Card>
					<ListGroup variant='flush'>
						<ListGroupItem>
							<h2>
								Subtotal: (
								{cartItems.reduce(
									(accumulator, item) => accumulator + item.qty,
									0
								)}
								) items
							</h2>
							$
							{cartItems
								.reduce((acc, item) => acc + item.qty * item.price, 0)
								.toFixed(2)}
						</ListGroupItem>
						<ListGroupItem>
							<Button
								type='button'
								className='btn-block'
								disabled={cartItems.length === 0}
								onClick={checkoutHandler}
							>
								Checkout
							</Button>
						</ListGroupItem>
					</ListGroup>
				</Card>
			</Col>
		</Row>
	)
}

export default CartScreen
