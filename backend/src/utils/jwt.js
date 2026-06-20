import jwt from "jsonwebtoken";

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

export const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN || "2h" });
};

export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};
