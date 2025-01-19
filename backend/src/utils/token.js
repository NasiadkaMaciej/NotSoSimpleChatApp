import jwt from "jsonwebtoken";

export const generateToken = (userId,  res) => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret)
        throw new Error('JWT_SECRET is not defined in environment variables');
    
    const token = jwt.sign({ userId }, jwtSecret, { expiresIn: '30d' });

    res.cookie('token', token, {
        httpOnly: true, secure: false
    });

    res.cookie("jwt", token, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== 'development'
    });

    return token;
};
