import jwt from "jsonwebtoken";

export const generarAccessToken = (usuario) => {
    return jwt.sign(
        { id: usuario.idUsuario, email: usuario.email },
        process.env.JWT_ACCESS_TOKEN,
        { expiresIn: "15m" }
    );
};

export const generarRefreshToken = (usuario) => {
    return jwt.sign(
        { id: usuario.idUsuario },
        process.env.JWT_REFRESH_TOKEN,
        { expiresIn: "7d"}
    );
};