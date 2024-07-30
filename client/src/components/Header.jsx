import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
function Header() {
    const { currentUser } = useSelector(state => state.user)
    return (
        <div className='bg-slate-200'>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
                <Link to='/'>
                    <h1 className='font-bold'>Auth App</h1>
                </Link>
                <ul className='flex gap-4'>
                    <Link to='/'>
                        <li>Home</li>
                    </Link>
                    <Link to='/about'>
                        <li>About</li>
                    </Link>
                    {/* <Link to='/sign-in'> */}
                    {/* <Link to='/profile'>
                        {
                            currentUser ? (<>
                                <img
                                    src={currentUser.profilePicture}
                                    alt="https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg"
                                    onError={(e) => e.target.src = 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg'}
                                    className='w-7 h-7 rounded-full object-cover'
                                />
                            </>) : (<>Sign In</>)
                        }
                    </Link> */}
                    {
                        currentUser ? (<Link to="/profile">
                            <img
                                src={currentUser.profilePicture}
                                alt="https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg"
                                onError={(e) => e.target.src = 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg'}
                                className='w-7 h-7 rounded-full object-cover'
                            />
                        </Link>) : (<Link to="/sign-in">
                            <>Sign In</>
                        </Link>)
                    }
                </ul>
            </div>
        </div>)
}

export default Header