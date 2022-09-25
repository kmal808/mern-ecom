import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { listProductDetails } from '../actions/productAction'

const ProductEditScreen = () => {
	const { id: productId } = useParams()
	const [name, setName] = useState('')
	const [price, setPrice] = useState(0)
	const [image, setImage] = useState('')
	const [brand, setBrand] = useState('')
	const [category, setCategory] = useState('')
	const [countInStock, setCountInStock] = useState(0)
	const [description, setDescription] = useState('')

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const productDetails = useSelector((state) => state.productDetails)
	const { loading, error, product } = productDetails

	useEffect(() => {
		if (!product.name || product._id !== productId) {
			dispatch(listProductDetails(productId))
		} else {
			setName(product.name)
			setPrice(product.price)
			setImage(product.image)
			setBrand(product.brand)
			setCategory(product.category)
			setCountInStock(product.countInStock)
			setDescription(product.description)
		}
	}, [product, dispatch, navigate, productId])

	const submitHandler = (e) => {
		e.preventDefault()
		//todo update product
	}

	return (
		<>
			<Link to='/admin/productlist' className='btn btn-light my-3'>
				Go Back
			</Link>
			<FormContainer>
				<h1>Edit Product</h1>
				{loading ? (
					<Loader />
				) : error ? (
					<Message variant='danger'>{error}</Message>
				) : (
					<Form onSubmit={submitHandler}>
						<Form.Group controlId='name'>
							<Form.Label>Name</Form.Label>
							<Form.Control
								type='name'
								placeholder='Enter name'
								value={name}
								onChange={(e) => setName(e.target.value)}
							></Form.Control>
						</Form.Group>

						<Form.Group controlId='price'>
							<Form.Label>Price</Form.Label>
							<Form.Control
								type='number'
								placeholder='Enter price'
								value={price}
								onChange={(e) => setPrice(e.target.value)}
							></Form.Control>
						</Form.Group>

						<Form.Group controlId='image'>
							<Form.Check
								type='text'
								placeholder='Enter image url'
								value={image}
								onChange={(e) => setImage(e.target.checked)}
							></Form.Check>
						</Form.Group>

						<Form.Group controlId='brand'>
							<Form.Check
								type='text'
								placeholder='Enter brand'
								value={brand}
								onChange={(e) => setBrand(e.target.checked)}
							></Form.Check>
						</Form.Group>

						<Form.Group controlId='countInStock'>
							<Form.Label>Count In Stock</Form.Label>
							<Form.Control
								type='number'
								placeholder='Enter count in stock'
								value={countInStock}
								onChange={(e) => setCountInStock(e.target.value)}
							></Form.Control>
						</Form.Group>

						<Form.Group controlId='category'>
							<Form.Check
								type='text'
								placeholder='Enter category'
								value={category}
								onChange={(e) => setCategory(e.target.checked)}
							></Form.Check>
						</Form.Group>

						<Form.Group controlId='description'>
							<Form.Check
								type='text'
								placeholder='Enter description'
								value={description}
								onChange={(e) => setDescription(e.target.checked)}
							></Form.Check>
						</Form.Group>

						<Button className='mt-3' type='submit' variant='primary'>
							Update
						</Button>
					</Form>
				)}
			</FormContainer>
		</>
	)
}

export default ProductEditScreen
