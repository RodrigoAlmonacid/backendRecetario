import { PrismaClient } from '@prisma/client';
import { generarAccessToken, generarRefreshToken } from './../helpers/jwt.js';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.usuario.findUnique({
      where: { email: email }
    });
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const contrasenaValida = await bcrypt.compare(password, user.pass);
    if (!contrasenaValida) {
      return res.status(401).json({ error: `Credenciales inválidas` });
    };

    const accessToken = generarAccessToken(user);
    const refreshToken = generarRefreshToken(user);

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

export const registerUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "El email y la contraseña son obligatorios" });
    }

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email: email }
    });

    if (usuarioExistente) {
      return res.status(409).json({ message: "El email ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        email: email,
        pass: hashedPassword,
        rol: 'usuario'
      }
    });

    const accessToken = generarAccessToken(nuevoUsuario);
    const refreshToken = generarRefreshToken(nuevoUsuario);

    delete nuevoUsuario.pass;

    res.status(201).json({
      user: nuevoUsuario,
      accessToken,
      refreshToken
    });

  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};