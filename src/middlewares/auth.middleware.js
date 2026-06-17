import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ status: "error", message: "No hay token" });
    }

    const token = authHeader.split(" ")[1];

    const JWT_SECRET = process.env.JWT_SECRET || 'json-web-token-prueba-local';
    const decoded = jwt.verify(token, JWT_SECRET);

    req.usuario = {
      idUsuario: decoded.id,
      email: decoded.email
    }; 
    
    next();
  } catch (error) {
    return res.status(401).json({ status: "error", message: "Token inválido o expirado" });
  }
};