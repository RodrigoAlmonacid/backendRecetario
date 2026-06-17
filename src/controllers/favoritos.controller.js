import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getFavoritosIds = async (req, res) => {
  try {
    const idUsuario = req.usuario.idUsuario; 

    const favoritos = await prisma.favorites.findMany({
      where: { idUsuario: idUsuario },
      select: { idReceta: true }
    });

    const idsList = favoritos.map(fav => fav.idReceta);

    res.status(200).json({
      status: "ok",
      message: "IDs de favoritos obtenidos",
      data: idsList,
    });
  } catch (error) {
    console.error("Error en getFavoritosIds:", error);
    res.status(500).json({
      status: "error",
      message: "Error inesperado del servidor",
      data: []
    });
  }
};

export const toggleFavorito = async (req, res) => {
  try {
    const idUsuario = req.usuario.idUsuario;
    const { idReceta } = req.body;

    if (!idReceta || Number.isNaN(Number(idReceta))) {
      return res.status(400).json({ 
        status: "error", 
        message: "ID de receta inválido" 
      });
    }

    const parsedIdReceta = Number(idReceta);

    const existeFavorito = await prisma.favorites.findUnique({
      where: {
        idReceta_idUsuario: {
          idReceta: parsedIdReceta,
          idUsuario: idUsuario
        }
      }
    });

    if (existeFavorito) {
      await prisma.favorites.delete({
        where: {
          idReceta_idUsuario: {
            idReceta: parsedIdReceta,
            idUsuario: idUsuario
          }
        }
      });
      return res.status(200).json({ 
        status: "ok", 
        message: "Receta eliminada de favoritos" 
      });
      
    } else {
      await prisma.favorites.create({
        data: {
          idReceta: parsedIdReceta,
          idUsuario: idUsuario
        }
      });
      return res.status(201).json({ 
        status: "ok", 
        message: "Receta agregada a favoritos" 
      });
    }

  } catch (error) {
    console.error("Error en toggleFavorito:", error);
    res.status(500).json({ 
      status: "error", 
      message: "Error inesperado del servidor" 
    });
  }
};

export const getRecetasFavoritas = async (req, res) => {
  try {
    const idUsuario = req.usuario.idUsuario; 
    const { lang, page = 1, limit = 9 } = req.query;
    const idiomaSeleccionado = lang || "es";
    
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const favoritos = await prisma.favorites.findMany({
      where: { idUsuario: idUsuario },
      skip: skip,
      take: take,
      include: {
        receta: {
          include: {
            traducciones: {
              where: {
                lang: idiomaSeleccionado
              }
            }
          }
        }
      }
    });

    const recetasFormateadas = favoritos.map(fav => fav.receta);

    res.status(200).json({
      status: "ok",
      message: "Lista de recetas favoritas obtenida",
      filtrosAplicados: { lang, page, limit },
      data: recetasFormateadas,
    });
  } catch (error) {
    console.error("Error en getRecetasFavoritas:", error);
    res.status(500).json({
      status: "error",
      message: "Error inesperado del servidor",
      data: []
    });
  }
};