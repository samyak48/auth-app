const express = require('express')
const app = express()
app.use(express.json())
require('dotenv').config({ path: `${process.cwd()}/.env` })
const userRouter = require('./router/userRouter')
const authRout = require("./router/authRouter")
const cors = require('cors')
const cookieparser = require('cookie-parser')

app.use(cookieparser({
    httpOnly: true,
}))
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use('/api/users', userRouter)
// app.use('/api/auth', authRout)
app.use('/api/auth', authRout)
app.listen(process.env.APP_PORT, () => {
    console.log(`Server is running on ${process.env.APP_PORT}`)
})