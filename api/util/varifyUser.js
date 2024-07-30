const jwt = require('jsonwebtoken');
const varifyToken = (req, res, next) => {
    const token = req.cookies.access_token
    if (!token) {
        return res.status(401).json({ message: 'You need to login' })
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'token is not valid' })
        req.user = user
        next()
    })
}
module.exports = varifyToken