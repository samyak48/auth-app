import React from 'react'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signInSucess } from '../slice/userSlice'
import { ToastContainer, toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
function Oauth() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result = await signInWithPopup(auth, provider)
            const responce = await fetch('http://localhost:3000/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    userName: result.user.displayName,
                    email: result.user.email,
                    profilePicture: result.user.photoURL
                })
            })

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

                const { currentUser } = await responce.json()
                dispatch(signInSucess(currentUser))
                setTimeout(() => {
                    navigate('/')
                }, 1000)
            }
            if (!responce.ok) {
                throw new Error('Failed to Loged in user!')
            }
        } catch (err) {
            toast.error(err.message);
        }
    }
    return (
        <>
            <button type='button' onClick={handleGoogleClick} className='bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-95'>Continue with google</button>
            <ToastContainer />
        </>
    )
}

export default Oauth