import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        idUsuario: true,
        email: true,
        rol: true
      }
    });
    return res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return res.status(500).json({ error: 'Error al obtener la lista de usuarios' });
  }
};

//para modificar el rol
export const updateUsuarioRol = async (req, res) => {
  const { id } = req.params;
  const { nuevoRol } = req.body;

  const rolesValidos = ['usuario', 'administrador', 'superUsuario'];
  if (!rolesValidos.includes(nuevoRol)) {
    return res.status(400).json({ error: 'El rol proporcionado no es válido' });
  }

  try {
    const usuarioActualizado = await prisma.usuario.update({
      where: { idUsuario: Number(id) },
      data: { rol: nuevoRol },
      select: { idUsuario: true, email: true, rol: true }
    });

    return res.json({ 
      message: 'Rol actualizado con éxito', 
      usuario: usuarioActualizado 
    });
  } catch (error) {
    console.error("Error al actualizar rol:", error);
    return res.status(500).json({ error: 'Error interno al intentar actualizar el rol' });
  }
};