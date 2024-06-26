import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Validation from './SignupValidation'
import axios from 'axios'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Signup() {

    const backgroundStyle = {
        width: "100%",
        height: "100vh", // Or '100vh' for full viewport height
        backgroundColor: "#81C1FF",
        backgroundSize: 'cover', // Cover the entire space of the element
    };

    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        birthday: null
    })

    const navigate = useNavigate()
    const[errors, setErrors] = useState({})
    const handleInput = (e) =>{
        setValues(prev => ({...prev, [e.target.name]: [e.target.value]}))
    }

    const handleDateChange = (date) => {
        setValues(prev => ({ ...prev, birthday: date }));
    };

    const handleSubmit= (e) => {
        e.preventDefault();
        const err = (Validation(values))
        setErrors(err)
        if(err.name === "" && err.email === "" && err.password === "" && err.birthday === ""){
            axios.post('http://localhost:8081/signup', values)
            .then(res => {
                navigate('/');
            })
            .catch(err => console.log(err))
        }
    }

    return (
    <div style={backgroundStyle}>
        <div className='d-flex justify-content-center align-items-center vh-100'>
            <div className='bg-white p-3 rounded w-25'>
                <h2>Sign-Up</h2>
                <form action="" onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="name"><strong>Name</strong></label>
                        <input type="text" placeholder='Enter Name' name='name'
                            onChange={handleInput} className='form-control rounded-0'/>
                        {errors.name && <p className='text-danger mt-1'> {errors.name}</p>}
                    </div>
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
                        {errors.password && <span className='text-danger mt-1'> {errors.password}</span>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="birthday" className='d-block'><strong>Birthday</strong></label>
                        <DatePicker
                            selected={values.birthday}
                            onChange={handleDateChange}
                            dateFormat="yyyy-MM-dd"
                            className="form-control rounded-0"
                            name="birthday"
                            placeholderText={'Enter Birthday'}
                        />
                        {errors.birthday && <span className='text-danger mt-1 d-block'> {errors.birthday}</span>}
                    </div>
                    <button type='submit' className='btn btn-danger w-100'><strong>Create Account</strong></button>
                    <p className='mb-1 mt-1'>You are agreeing to our terms and policies.</p>
                    <a href="/" className="float-end mt-2">Log In</a>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Signup
