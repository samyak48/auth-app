import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { signInSucess } from '../slice/userSlice';
import { useDispatch } from 'react-redux';
import Oauth from '../components/Oauth';
function SignIn() {
    const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
    const [submitting, setSubmitting] = useState(false)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onSubmit = async (data) => {
        setSubmitting(true)
        try {
            if (data) {
                const responce = await fetch("http://localhost:3000/api/auth/login", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                    credentials: 'include'
                })
                // console.log(responce)
                if (responce.ok) {
                    toast.success('Loged in successfully!', {
                        position: 'top-right',
                        autoClose: 1000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    reset()
                    const { currentUser } = await responce.json()
                    dispatch(signInSucess(currentUser))
                    setTimeout(() => {
                        navigate('/')
                    }, 1000)
                }
                if (!responce.ok) {
                    throw new Error('Failed to Loged in user!')
                }
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setTimeout(() => {
                setSubmitting(false)
            }, 1000)
        }
    }
    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <input
                    type='email'
                    placeholder='Email'
                    id='email'
                    className='bg-slate-100 p-3 rounded-lg'
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                            message: 'Invalid email address',
                        },
                    })}
                />
                <input
                    type='password'
                    placeholder='Password'
                    id='password'
                    className='bg-slate-100 p-3 rounded-lg'
                    {...register('password', { required: true })}
                />
                <button
                    type='submit'
                    disabled={isSubmitting}
                    className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
                >
                    {/* {isSubmitting ? 'Loading...' : 'Sign In'}*/}
                    {submitting ? 'Loading...' : 'Sign In'}
                </button>
                <Oauth />
            </form>
            <div className='flex gap-2 mt-5'>
                <p>Don't have an account?</p>
                <Link to='/sign-up'>
                    <span className='text-blue-500'>Sign up</span>
                </Link>
            </div>
            <ToastContainer />
        </div>
    )
}
export default SignIn