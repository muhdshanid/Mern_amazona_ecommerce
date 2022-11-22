import React, { useContext, useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import {Helmet} from 'react-helmet-async'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import axios from 'axios'
import { Store } from '../Store'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { getError } from '../util'
const SignupScreen = () => {
    const {search} = useLocation()
    const redirectUrl = new URLSearchParams(search).get("redirect")
    const redirect = redirectUrl ? redirectUrl : "/"
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const navigate = useNavigate()
    const {state,dispatch:ctxDispatch} = useContext(Store)
    const {userInfo} = state
    useEffect(()=>{
        if(userInfo){
            navigate(redirect)
        }
    },[navigate,redirect,userInfo])
    const submitHandler = async (e) => {
        e.preventDefault()
        if(password !== confirmPassword){
            toast.error("Passwords do not match")
            return;
        }
        try {
            const {data} = await axios.post(`/api/users/signup`,{
                name,
                email,
                password
            })
            ctxDispatch({type:"USER_SIGNIN",payload:data})
            localStorage.setItem("userInfo",JSON.stringify(data))
            navigate(redirect || "/")
        } catch (error) {
            toast.error(getError(error))
        }
    }
  return (
    <Container className='small-container'>
        <Helmet>
            <title>Sign Up</title>
        </Helmet>
        <h1 className='my-3'>Sign Up</h1>
        <Form onSubmit={submitHandler}>
        <Form.Group onChange={(e)=>setName(e.target.value)} className='mb-3' controlId='name'>
                <Form.Label>Name</Form.Label>
                <Form.Control type='name' required/>
            </Form.Group>
            <Form.Group onChange={(e)=>setEmail(e.target.value)} className='mb-3' controlId='email'>
                <Form.Label>Email</Form.Label>
                <Form.Control type='email' required/>
            </Form.Group>
            <Form.Group onChange={(e)=>setPassword(e.target.value)} className='mb-3' controlId='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control type='password' required/>
            </Form.Group>
            <Form.Group onChange={(e)=>setConfirmPassword(e.target.value)} className='mb-3' controlId='confirm-password'>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type='confirm-password' required/>
            </Form.Group>
            <div className='mb-3'>
                <Button type='submit'>Sign Up</Button>
            </div>
            <div className='mb-3'>
                Already have an account ? {" "}
                <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
            </div>
        </Form>
    </Container>
  )
}

export default SignupScreen