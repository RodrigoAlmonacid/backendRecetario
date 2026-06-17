import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'json-web-token-prueba-local'; 

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.usuario.findUnique({
      where: { email: email }
    });

    // Si no existe el usuario, cortamos acá
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas (correo)" });
    }

    //comparo contraseña cruda (cambiar si usamos algún hasheo)
    if (user.pass !== password) {
      return res.status(401).json({ error: "Credenciales inválidas (pass)" });
    }
    //se genera acces token
    const accessToken = jwt.sign(
      { id: user.id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    //texto dummy para el frint
    const refreshToken = "dummy-refresh-token-prueba-local";

    //limipo la contra
    delete user.pass;

    return res.json({
      user,
      accessToken,
      refreshToken
    });

  } catch (error) {
    console.error("Error en el login backend:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};