const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');
const User = require('../models/User');


const protectRoutes = asyncHandler(async (req, res, next) => {
    // 1) Check token is exists or not 
    let token = req.headers.authorization;
    if (!token || !token.startsWith("Bearer"))
        throw new UnauthenticatedError('No Bearer Token Provided')
    token = req.headers.authorization.split(" ")[1];
    // 2) Verify token (no change happens , expire data)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3 ) Check user if exists or not by given token
    const user = await User.findById(decoded.userId);
    if (!user)
        throw new UnauthenticatedError('The user that belong to this token does no longer exist')

    req.user = user;
    next()
});

module.exports = protectRoutes;