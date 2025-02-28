import jwt from "jsonwebtoken";

type UserPayload = {
    id: number;
}

export const generateJWT = (payload: UserPayload) => {
    // Crear el JWT
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "180d"
    });

    return token;
}