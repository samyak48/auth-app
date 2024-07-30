const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
exports.signup = async (req, res, next) => {
    try {
        await User.create({
            userName: req.body.userName,
            email: req.body.email,
            password: req.body.password,
        })
        return res.status(201).json({ message: 'User created successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } })
        if (!user) {
            throw new Error('Invalid email or password');
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const currentUser = {
            id: user.id,
            userName: user.userName,
            email: user.email,
            profilePicture: user.profilePicture,
            role: user.role,
            isd_code: user.isd_code,
            sex: user.sex,
            phone_number: user.phone_number
        }
        return res.cookie('access_token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
            secure: true,
        }).status(200).json({ message: 'Logged in successfully', token, currentUser })
    } catch (error) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
}
exports.google = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } })
        if (user) {
            console.log("In finding")
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const currentUser = {
                id: user.id,
                userName: user.userName,
                email: user.email,
                profilePicture: user.profilePicture,
                role: user.role,
                isd_code: user.isd_code,
                sex: user.sex,
                phone_number: user.phone_number
            }
            return res.cookie('access_token', token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24,
                secure: true,
            }).status(200).json({ message: 'Logged in successfully', token, currentUser })
        } else {
            console.log("in create")
            const generatedPassword =
                Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
            // const currentUser = new User({
            //     userName: req.body.userName,
            //     email: req.body.email,
            //     password: hashedPassword,
            //     profilePicture: req.body.profilePicture
            // })
            // await currentUser.save()
            const currentUser = await User.create({
                userName: req.body.userName,
                email: req.body.email,
                password: hashedPassword,
                profilePicture: req.body.profilePicture
            })
            const token = jwt.sign({ userId: currentUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.cookie('access_token', token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24,
                secure: true,
            }).status(201).json({ message: 'User created successfully', token, currentUser })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

exports.signOut = async (req, res, next) => {
    res.clearCookie('access_token', {
        httpOnly: true,
        secure: true,
    }).status(201).json({ message: 'Sign out successfully' })
}