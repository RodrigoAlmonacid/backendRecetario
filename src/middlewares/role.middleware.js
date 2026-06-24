import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const requireRole = (rolesPermitidos) => {
  return async (req, res, next) => {
    try {
      if (!req.usuario || !req.usuario.idUsuario) {
        return res.status(401).json({ status: "error", message: "Usuario no autenticado" });
      }

      const usuarioDb = await prisma.usuario.findUnique({
        where: { idUsuario: req.usuario.idUsuario },
        select: { rol: true } // Solo la columna rol
      });

      if (!usuarioDb) {
        return res.status(403).json({ status: "error", message: "Usuario no encontrado en el sistema" });
      }

      if (!rolesPermitidos.includes(usuarioDb.rol)) {
        return res.status(403).json({ status: "error", message: "No tienes los privilegios necesarios para esta acción" });
      }

      req.usuario.rol = usuarioDb.rol;
      next();
      
    } catch (error) {
      console.error("Error en requireRole:", error);
      return res.status(500).json({ status: "error", message: "Error interno al verificar permisos" });
    }
  };
};