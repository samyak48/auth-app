import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import Oauth from '../components/Oauth';
function SignUp() {
    const navigate = useNavigate()
    const [submitting, setSubmitting] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm();
    const onSubmit = async (data) => {
        setSubmitting(true)
        try {
            if (data) {
                const responce = await fetch("http://localhost:3000/api/auth/signup", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                })
                if (responce.ok) {
                    toast.success('User registered successfully!', {
                        position: 'top-right',
                        autoClose: 1000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    reset()
                    setTimeout(() => {
                        navigate('/sign-in')
                    }, 1000)
                }
            }
        } catch (err) {
            toast.error('Failed to register user!');
        } finally {
            setTimeout(() => {
                setSubmitting(false)
            }, 1000)
        }
    };
    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <input
                    type='text'
                    placeholder='UserName'
                    id='userName'
                    className='bg-slate-100 p-3 rounded-lg'
                    {...register('userName', { required: 'Username is required' })}
                />
                {errors.userName && <p className='text-red-700'>{errors.userName.message}</p>}

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
                {errors.email && <p className='text-red-700'>{errors.email.message}</p>}

                <input
                    type='password'
                    placeholder='Password'
                    id='password'
                    className='bg-slate-100 p-3 rounded-lg'
                    {...register('password', {
                        required: 'Password is required',
                        minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters',
                        },
                    })}
                />
                {errors.password && <p className='text-red-700'>{errors.password.message}</p>}

                <button
                    type='submit'
                    disabled={isSubmitting}
                    className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
                >
                    {/* {isSubmitting ? 'Loading...' : 'Sign Up'} */}
                    {submitting ? 'Loading...' : 'Sign Up'}
                </button>
                <Oauth />
            </form>
            <div className='flex gap-2 mt-5'>
                <p>Have an account?</p>
                <Link to='/sign-in'>
                    <span className='text-blue-500'>Sign in</span>
                </Link>
            </div>
            <ToastContainer />
        </div>
    );
}
export default SignUp;
