import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    error: false
}
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInSucess: (state, action) => {
            state.currentUser = action.payload
            state.error = false
        },
        updateUserSucess: (state, action) => {
            state.currentUser = { ...state.currentUser, ...action.payload }
            state.error = false
        },
        deleteUserSucess: (state, action) => {
            state.currentUser = null
            state.error = false
        },
        signOutSucess: (state, action) => {
            state.currentUser = null
            state.error = false
        }
    }
})
export const { signInSucess, updateUserSucess, deleteUserSucess, signOutSucess } = userSlice.actions
export default userSlice.reducer