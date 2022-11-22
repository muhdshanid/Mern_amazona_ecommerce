import React, { useContext, useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import {Helmet} from 'react-helmet-async'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import axios from 'axios'
import { Store } from '../Store'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { getError } from '../util'
const SigninScreeen = () => {
    const {search} = useLocation()
    const redirectUrl = new URLSearchParams(search).get("redirect")
    const redirect = redirectUrl ? redirectUrl : "/"
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
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
        try {
            const {data} = await axios.post(`/api/users/signin`,{
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
            <title>Sign In</title>
        </Helmet>
        <h1 className='my-3'>Sign In</h1>
        <Form onSubmit={submitHandler}>
            <Form.Group onChange={(e)=>setEmail(e.target.value)} className='mb-3' controlId='email'>
                <Form.Label>Email</Form.Label>
                <Form.Control type='email' required/>
            </Form.Group>
            <Form.Group onChange={(e)=>setPassword(e.target.value)} className='mb-3' controlId='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control type='password' required/>
            </Form.Group>
            <div className='mb-3'>
                <Button type='submit'>Sign In</Button>
            </div>
            <div className='mb-3'>
                New Customer ? {" "}
                <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
            </div>
        </Form>
    </Container>
  )
}

export default SigninScreeen