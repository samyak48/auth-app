import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'
import { updateUserSucess, deleteUserSucess, signOutSucess } from '../slice/userSlice'
function Profile() {
    const { currentUser } = useSelector(state => state.user)
    console.log(currentUser)
    const [countries, setCountries] = useState([]);
    const [ProfilePicturePercent, setProfilePicturePercent] = useState(0)
    const [ProfilePictureError, setProfilePictureError] = useState(false)
    const dispatch = useDispatch()
    useEffect(() => {
        fetch('https://restcountries.com/v3.1/all')
            .then(response => response.json())
            .then(data => {
                const countryData = data.map(country => ({
                    name: country.name.common,
                    isd_code: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ''),
                })).sort((a, b) => a.name.localeCompare(b.name));
                setCountries(countryData);
            })
            .catch(error => console.error('Error fetching country data:', error));
    }, []);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            email: currentUser.email,
            userName: currentUser.userName,
            profilePicture: currentUser.profilePicture || 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg'
        }
    });

    const fileRef = useRef(null)
    const profilePicture = watch('profilePicture');

    const handleFileChange = async (file) => {
        if (file) {
            const storage = getStorage(app)
            const fileName = new Date().getTime() + file.name
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    setProfilePicturePercent(Math.round(progress))
                },
                (error) => {
                    console.error('An error occurred: ', error)
                    setProfilePictureError(true)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
                        setValue('profilePicture', downloadURL)
                    )
                }
            )
        }
    }

    useEffect(() => {
        if (profilePicture && profilePicture instanceof File) {
            handleFileChange(profilePicture);
        }
    }, [profilePicture]);

    const onSubmit = async (data) => {
        try {
            const responce = await fetch(`http://localhost:3000/api/users/update/${currentUser.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            })
            if (responce.ok) {
                toast.success('Update user successfully!', {
                    position: 'top-right',
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                const { user } = await responce.json()
                dispatch(updateUserSucess(user))
            }
            if (!responce.ok) {
                throw new Error('Failed to Loged in user!')
            }
        } catch (err) {
            toast.error(err.message);
        }
    };
    const handleDeleteAccount = async () => {
        try {
            const responce = await fetch(`http://localhost:3000/api/users/delete/${currentUser.id}`, {
                method: 'DELETE',
                credentials: 'include',
            })
            if (responce.ok) {
                toast.success('Delete user successfully!', {
                    position: 'top-right',
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setTimeout(() => {
                    dispatch(deleteUserSucess())
                }, 1000);
            }
            if (!responce.ok) {
                throw new Error('Failed to delete user!')
            }
        } catch (err) {
            toast.error(err.message);
        }
    }
    const handleSignOut = async () => {
        try {
            const responce = await fetch('http://localhost:3000/api/auth/signout', {
                method: 'GET',
                credentials: 'include',
            })
            if (responce.ok) {
                toast.success('Sign out successfully!', {
                    position: 'top-right',
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setTimeout(() => {
                    dispatch(signOutSucess())
                }, 1000);
            }
            if (!responce.ok) {
                throw new Error('Failed to logout user!')
            }
        } catch (err) {
            toast.error(err.message);
        }
    }
    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <input
                    type='file'
                    ref={fileRef}
                    hidden
                    accept='image/*'
                    onChange={(e) => setValue('profilePicture', e.target.files[0])}
                />
                {ProfilePictureError && <span>An error occurred while uploading the picture.</span>}
                <img
                    src={typeof profilePicture === 'string' ? profilePicture : URL.createObjectURL(profilePicture)}
                    alt="Profile"
                    onError={(e) => e.target.src = 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg'}
                    className='h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2'
                    onClick={() => fileRef.current.click()}
                />
                <p className='text-sm self-center'>
                    {ProfilePictureError ? (
                        <span className='text-red-700'>
                            Error uploading image (file size must be less than 4 MB)
                        </span>
                    ) : ProfilePicturePercent > 0 && ProfilePicturePercent < 100 ? (
                        <span className='text-slate-700'>{`Uploading: ${ProfilePicturePercent} %`}</span>
                    ) : ProfilePicturePercent === 100 ? (
                        <span className='text-green-700'>Image uploaded successfully</span>
                    ) : (
                        ''
                    )}
                </p>
                <label className="font-sans font-bold text-gray-700 px-3 rounded">User Name</label>
                <input
                    {...register('userName')}
                    type='text'
                    id='userName'
                    placeholder='userName'
                    className='bg-slate-100 rounded-lg p-3 text-gray-500'
                    disabled
                />

                <label className="font-sans font-bold text-gray-700 px-3 rounded">Email</label>
                <input
                    {...register('email')}
                    type='email'
                    id='email'
                    placeholder='Email'
                    className='bg-slate-100 rounded-lg p-3 text-gray-500'
                    disabled
                />

                <div>
                    <span className='font-sans font-bold text-gray-700'>Sex:</span>
                    <div className='flex items-center space-x-4 px-2'>
                        <label className='inline-flex items-center'>
                            <input
                                {...register('sex', { required: 'Sex is required' })}
                                type='radio'
                                value='MALE'
                                className='form-radio text-blue-500'
                            />
                            <span className='ml-2'>Male</span>
                        </label>
                        <label className='inline-flex items-center'>
                            <input
                                {...register('sex')}
                                type='radio'
                                value='FEMALE'
                                className='form-radio text-blue-500'
                            />
                            <span className='ml-2'>Female</span>
                        </label>
                    </div>
                    {errors.sex && <span className='text-red-500'>{errors.sex.message}</span>}
                </div>

                <div>
                    <label htmlFor='country' className='font-sans font-bold text-gray-700 rounded'>Country ISD Code</label>
                    <select
                        {...register('isd_code', { required: 'Country ISD code is required' })}
                        id='country'
                        className='block w-1/3 mt-1 bg-slate-100 rounded-lg p-3'
                    >
                        <option value=''>Select a country</option>
                        {countries.map((country, index) => (
                            <option key={index} value={country.isd_code}>
                                {country.name} ({country.isd_code})
                            </option>
                        ))}
                    </select>
                    {errors.isd_code && <span className='text-red-500'>{errors.isd_code.message}</span>}
                </div>

                <div>
                    <label htmlFor='phone' className='font-sans font-bold text-gray-700 rounded'>Phone Number</label>
                    <input
                        {...register('phone_number', {
                            required: 'Phone number is required',
                            minLength: {
                                value: 10,
                                message: 'Phone number must be at least 10 digits',
                            },
                            maxLength: {
                                value: 15,
                                message: 'Phone number must be at most 15 digits',
                            },
                            pattern: {
                                value: /^[0-9]+$/,
                                message: 'Phone number must contain only digits',
                            },
                        })}
                        type='tel'
                        id='phone'
                        placeholder='Phone Number'
                        className='block w-full mt-1 bg-slate-100 rounded-lg p-3'
                    />
                    {errors.phone_number && <span className='text-red-500'>{errors.phone_number.message}</span>}
                </div>

                <button type='submit' className='mt-4 px-4 py-2 bg-blue-500 text-white rounded'>Submit</button>
            </form>
            <div className='flex justify-between mt-5'>
                <span
                    onClick={handleDeleteAccount}
                    className='text-red-700 cursor-pointer'
                >
                    Delete Account
                </span>
                <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
                    Sign out
                </span>
            </div>
            <ToastContainer />
        </div>
    )
}
export default Profile
// //firebase storage rools
// //       allow read;
// //       allow write: if
// //       request.resource.size <2 *1024 *1024 &&
// //       request.resource.contentType.matches('image/.*')

// import React from 'react'
// import { useSelector } from 'react-redux'
// import { useForm } from 'react-hook-form';
// import { useEffect, useState, useRef } from 'react';
// import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
// import { app } from '../firebase';
// function Profile() {
//     const { currentUser } = useSelector(state => state.user)
//     const [countries, setCountries] = useState([]);
//     const [ProfilePicture, setProfilePicture] = useState(undefined)
//     const [ProfilePicturePercent, setProfilePicturePercent] = useState(0)
//     const [ProfilePictureError, setProfilePictureError] = useState(false)
//     const [formData, setFormData] = useState({});
//     console.log(formData)

//     useEffect(() => {
//         fetch('https://restcountries.com/v3.1/all')
//             .then(response => response.json())
//             .then(data => {
//                 const countryData = data.map(country => ({
//                     name: country.name.common,
//                     isd_code: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ''),
//                 })).sort((a, b) => a.name.localeCompare(b.name));;
//                 setCountries(countryData);
//             })
//             .catch(error => console.error('Error fetching country data:', error));
//     }, []);
//     const fileRef = useRef(null)

//     //upload image o firebase
//     useEffect(() => {
//         if (ProfilePicture) {
//             handelFileUpload(ProfilePicture)
//         }
//     }, [ProfilePicture])
//     async function handelFileUpload(profilePicture) {
//         const storage = getStorage(app)
//         const fileName = new Date().getTime() + profilePicture.name
//         const storageRef = ref(storage, fileName)
//         const uploadTask = uploadBytesResumable(storageRef, ProfilePicture)
//         uploadTask.on('state_changed',
//             (snapshot) => {
//                 const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
//                 console.log('upload is ' + progress + '% done')
//                 setProfilePicturePercent(Math.round(progress))
//             },
//             (error) => {
//                 console.error('An error occurred: ', error);
//                 setProfilePictureError(true)
//             },
//             () => {
//                 getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
//                     setFormData({ ...formData, profilePicture: downloadURL })
//                 );
//             }
//         )

//     }
//     const { register, handleSubmit, formState: { errors } } = useForm({
//         defaultValues: {
//             email: currentUser.email,
//             userName: currentUser.userName
//         }
//     });
//     const onSubmit = data => {
//         console.log(data);
//     };

//     return (
//         <div className='p-3 max-w-lg mx-auto'>
//             <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
//             <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
//                 <input type='file' ref={fileRef} hidden accept='image/*' onChange={(e) => setProfilePicture(e.target.files[0])} />
//                 {/* <input
//                     type="file"
//                     {...register('profilePicture')}
//                     ref={fileRef}
//                     style={{ display: 'none' }}
//                 /> */}
//                 {errors.file && <span>This field is required</span>}

//                 <img
//                     src={currentUser.profilePicture}
//                     alt="https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg"
//                     onError={(e) => e.target.src = 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg'}
//                     className='h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2'
//                     onClick={() => fileRef.current.click()}
//                 />
//                 <label className="font-sans font-bold text-gray-700 px-3 rounded">User Name</label>
//                 <input
//                     {...register('userName')}
//                     type='text'
//                     id='userName'
//                     placeholder='userName'
//                     className='bg-slate-100 rounded-lg p-3 text-gray-500'
//                     disabled={true}
//                 />
//                 <label className="font-sans font-bold text-gray-700 px-3 rounded">Email</label>
//                 <input
//                     {...register('email')}
//                     type='email'
//                     id='email'
//                     placeholder='Email'
//                     className='bg-slate-100 rounded-lg p-3 text-gray-500'
//                     disabled={true}
//                 />
//                 <div>
//                     <span className='font-sans font-bold text-gray-700'>Sex:</span>
//                     <div className='flex items-center space-x-4 px-2'>
//                         <label className='inline-flex items-center'>
//                             <input
//                                 {...register('sex', { required: 'Sex is required' })}
//                                 type='radio'
//                                 value='male'
//                                 className='form-radio text-blue-500'
//                             />
//                             <span className='ml-2'>Male</span>
//                         </label>
//                         <label className='inline-flex items-center'>
//                             <input
//                                 {...register('sex')}
//                                 type='radio'
//                                 value='female'
//                                 className='form-radio text-blue-500'
//                             />
//                             <span className='ml-2'>Female</span>
//                         </label>
//                         <label className='inline-flex items-center'>
//                             <input
//                                 {...register('sex')}
//                                 type='radio'
//                                 value='other'
//                                 className='form-radio text-blue-500'
//                             />
//                             <span className='ml-2'>Other</span>
//                         </label>
//                     </div>
//                     {errors.sex && <span className='text-red-500'>{errors.sex.message}</span>}
//                 </div>

//                 <div>
//                     <label htmlFor='country' className='font-sans font-bold text-gray-700 rounded'>Country ISD Code</label>
//                     <select
//                         {...register('isd_code', { required: 'Country ISD code is required' })}
//                         id='country'
//                         className='block w-1/3 mt-1 bg-slate-100 rounded-lg p-3'
//                     >
//                         <option value=''>Select a country</option>
//                         {countries.map((country, index) => (
//                             <option key={index} value={country.isd_code}>
//                                 {country.name} ({country.isd_code})
//                             </option>
//                         ))}
//                     </select>
//                     {errors.isd_code && <span className='text-red-500'>{errors.isd_code.message}</span>}
//                 </div>
//                 <div>
//                     <label htmlFor='country' className='font-sans font-bold text-gray-700 rounded'>Phone Number</label>
//                     <input
//                         {...register('phone_number', {
//                             required: 'Phone number is required',
//                             minLength: {
//                                 value: 10,
//                                 message: 'Phone number must be at least 10 digits',
//                             },
//                             maxLength: {
//                                 value: 15,
//                                 message: 'Phone number must be at most 15 digits',
//                             },
//                             pattern: {
//                                 value: /^[0-9]+$/,
//                                 message: 'Phone number must contain only digits',
//                             },
//                         })}
//                         type='tel'
//                         id='phone'
//                         placeholder='Phone Number'
//                         className='block w-full mt-1 bg-slate-100 rounded-lg p-3'
//                     />
//                     {errors.phone_number && <span className='text-red-500'>{errors.phone_number.message}</span>}
//                 </div>
//                 <button type='submit' className='mt-4 px-4 py-2 bg-blue-500 text-white rounded'>Submit</button>
//             </form>
//         </div>
//     )
// }
// export default Profile
