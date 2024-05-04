import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Validation from './LoginValidation'
import axios from 'axios'

function Login() {
    const backgroundStyle = {
        width: "100%",
        height: "100vh", // Or '100vh' for full viewport height
        backgroundColor: "#81C1FF",
        backgroundSize: 'cover', // Cover the entire space of the element
    };

    const [values, setValues] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate()
    const[errors, setErrors] = useState({})
    const handleInput = (e) =>{
        setValues(prev => ({...prev, [e.target.name]: [e.target.value]}))
    }

    const handleSubmit= (e) => {
        e.preventDefault();
        const err = (Validation(values))
        setErrors(err)
        if(err.email === "" && err.password === ""){
            axios.post('http://localhost:8081/login', values)
            .then(res => {
                if(res.data !== "Fail"){
                    localStorage.setItem("userID",res.data.userID)
                    localStorage.setItem("username",res.data.username)
                    navigate('/home')
                }else{
                    alert("No Record Exists")
                }
            })
            .catch(err => console.log(err))
        }
    }

  return (
    <div style={backgroundStyle}>
        <div className='d-flex justify-content-center align-items-center vh-100'>
            <div className='bg-white p-3 rounded w-25'>
                <h2>Log-In</h2>
                <form action="" onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input type="email" placeholder='Enter Email' name='email'
                            onChange={handleInput} className='form-control rounded-0'/>
                        {errors.email && <p className='text-danger mt-1'> {errors.email}</p>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input type="password" placeholder='Enter Password' name='password'
                            onChange={handleInput} className='form-control rounded-0'/>
                        {errors.password && <span className='text-danger'> {errors.password}</span>}
                    </div>
                    <button type='submit' className='btn btn-success w-100'><strong>Log In</strong></button>
                    <p className='mb-1 mt-1'>You are agreeing to our terms and policies.</p>
                    <a href="/signup" className="float-end mt-2">Create Account</a>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Login
