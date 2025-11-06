import jwt from 'jsonwebtoken'

//This code is a JWT (JSON Web Token) generator function used in a Node.js/Express backend for authentication purposes.
const generateToken = (id, res) =>{
    const token = jwt.sign({id}, process.env.JWT_SEC,{
        expiresIn : "15d",
    });
    res.cookie("token", token, {
        maxAge: 15*24*60*1000,
        httpOnly: true,
        sameSite: "strict",
    });
};

export default generateToken;