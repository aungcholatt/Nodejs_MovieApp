import jwt from "jsonwebtoken";
//@desc Authenticated user & get token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};

export { generateToken };