import React, { useContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import CheckoutSteps from '../Components/CheckoutSteps'
import { Store } from '../Store'
const ShippingScreen = () => {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {userInfo,cart : {
        shippingAddress
    }} = state
    const [fullName, setFullName] = useState(shippingAddress.fullName || "")
    const [address, setAddress] = useState(shippingAddress.address || "")
    const [city, setCity] = useState(shippingAddress.city || "")
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || "")
    const [country, setCountry] = useState(shippingAddress.country || "")
    const navigate = useNavigate()
    useEffect(()=>{
        if(!userInfo){
            navigate("/signin")
        }
    },[userInfo,navigate])
    const submitHandler = (e) => {
        e.preventDefault()
        ctxDispatch({type:'SAVE_SHIPPING_ADDRESS',payload:{
            fullName,
            address,
            city,
            postalCode,
            country
        }})
        localStorage.setItem("shippingAddress",
        JSON.stringify({
            fullName,
            address,
            city,
            postalCode,
            country
        }))
        navigate("/payment")
    }
  return (
    <div>
        <Helmet>
            <title>Shipping Address</title>
        </Helmet>
        <CheckoutSteps step1 step2 />
        <div className='container small-container '>
        <h1 className='my-2'>Shipping Address</h1>
        <Form  onSubmit={submitHandler}>
            <Form.Group className='mb-2' controlId='fullname'>
                <Form.Label>Full Name</Form.Label>
                <Form.Control value={fullName} onChange={(e)=>setFullName(e.target.value)} required/>
            </Form.Group>
            <Form.Group className='mb-2' controlId='address'>
                <Form.Label>Address</Form.Label>
                <Form.Control value={address} onChange={(e)=>setAddress(e.target.value)} required/>
            </Form.Group>
            <Form.Group className='mb-2' controlId='city'>
                <Form.Label> City</Form.Label>
                <Form.Control value={city} onChange={(e)=>setCity(e.target.value)} required/>
            </Form.Group>
            <Form.Group className='mb-2' controlId='postalCode'>
                <Form.Label> Postal Code</Form.Label>
                <Form.Control value={postalCode} onChange={(e)=>setPostalCode(e.target.value)} required/>
            </Form.Group>
            <Form.Group className='mb-2' controlId='country'>
                <Form.Label>Country</Form.Label>
                <Form.Control value={country} onChange={(e)=>setCountry(e.target.value)} required/>
            </Form.Group>
            <div className='mt-3'>
                <Button  type='submit' variant='primary'>Continue</Button>
            </div>
        </Form>
        </div>
    </div>
  )
}

export default ShippingScreen