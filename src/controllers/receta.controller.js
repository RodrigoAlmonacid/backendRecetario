import {
  validateRecetaBody,
  isBodyEmpty,
} from "../validations/receta.validation.js";

//Metodo GET

import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export const getRecetas = async (req, res) => {
  try {
    const { search, lang, page = 1, limit = 9, type, tiempo, porciones } = req.query;
    const idiomaSeleccionado = lang || "es";

    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const skip = (pageNumber - 1) * pageSize;

    const whereClause = {
      ...(type ? { type: type } : {}),
      ...(tiempo ? { cookingTime: { lte: Number(tiempo) } } : {}),
      ...(porciones ? { servings: { gte: Number(porciones) } } : {}),
      
      traducciones: {
        some: {
          lang: idiomaSeleccionado,
          ...(search ? {
            title: {
              contains: search,
              mode: "insensitive" 
            }
          } : {})
        }
      }
    };

    const totalRecetas = await prisma.receta.count({ where: whereClause });

    const todasLasRecetas = await prisma.receta.findMany({
      where: whereClause,
      skip: skip,
      take: pageSize,
      include: {
        traducciones: {
          where: { lang: idiomaSeleccionado }
        }
      }
    });

    res.status(200).json({
      status: "ok",
      message: "Lista de recetas obtenida",
      filtrosAplicados: { search, lang, page: pageNumber, limit: pageSize },
      totalItems: totalRecetas,
      totalPages: Math.ceil(totalRecetas / pageSize), // Clave para los botones del front
      data: todasLasRecetas,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error inesperado del servidor",
      data: []
    });
  }
};

export const getRecetaById = async (req, res) => {
  try {
    const { id } = req.params;
    const { lang } = req.query;
    const idiomaSeleccionado = lang || "es";

    const recetaId = await prisma.receta.findUnique({
      where: {
        idReceta: Number(id)
      },
      include: {
        traducciones: {
          where: {
            lang: idiomaSeleccionado
          }
        }
      }
    });
    if (!recetaId) {
      return res.status(404).json({
        status: "error",
        message: `Recurso no encontrado: Receta ${id} no existe`,
      });
    }
    res.status(200).json({
      status: "ok",
      message: "Receta encontrada",
      data: recetaId
    });
  } catch (error) {
    console.error("Error en getRecetaById:", error);
    res.status(500).json({ status: "error", message: "Error inesperado del servidor" });
  }
};

//Metodo POST
export const createReceta = async (req, res) => {
  try {
    const body = req.body;
    if (isBodyEmpty(body)) {
      return res.status(400).json({
        status: "error",
        message: "Body inválido o incompleto",
      });
    }

    const errors = validateRecetaBody(body);

    if (errors.length > 0) {
      return res
        .status(400)
        .json({ status: "error", message: "Validación fallida", errors });
    }
    const { urlImagen, cookingTime, servings, isGlutenFree, type, traducciones } = body;

    const traduccionesAInsertar = traducciones.map((trad) => {
      return {
        lang: trad.lang,
        title: trad.title ? trad.title : "Título no disponible / Title not available",
        description: trad.description ? trad.description : "Traducción no disponible / Translation not available",
        ingredients: Array.isArray(trad.ingredients) && trad.ingredients.length > 0
          ? trad.ingredients
          : ["Sin ingredientes / No ingredients"],
        instruction: Array.isArray(trad.instruction) && trad.instruction.length > 0
          ? trad.instruction
          : ["Sin instrucciones / No instructions"]
      };
    });

    const nuevaReceta = await prisma.receta.create({
      data: {
        urlImagen: urlImagen || "https://img.freepik.com/vector-premium/plato-comida-icono-plano-diseno-vector-ilustracion_100456-1144.jpg",
        cookingTime: Number(cookingTime) || 0,
        servings: Number(servings) || 0,
        isGlutenFree: Boolean(isGlutenFree),
        type: type || "otros",
        traducciones: {
          create: traduccionesAInsertar
        }
      },
      include: {
        traducciones: true
      }
    });
    res.status(201).json({
      status: "ok",
      message: "Receta creada exitosamente",
      data: nuevaReceta,
    });
  } catch (error) {
    console.error("Error en createReceta:", error);
    res.status(500).json({ status: "error", message: "Error inesperado del servidor al crear la receta" });
  }
};

//Metodo PUT
export const updateReceta = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ status: "error", message: "ID inválido" });
    }

    const body = req.body;

    if (isBodyEmpty(body)) {
      return res.status(400).json({ status: "error", message: "Body inválido o incompleto" });
    }

    const errors = validateRecetaBody(body);
    if (errors.length > 0) {
      return res.status(400).json({ status: "error", message: "Validación fallida", errors });
    }

    const { urlImagen, cookingTime, servings, isGlutenFree, type, traducciones } = body;

    const traduccionesAInsertar = traducciones.map((trad) => {
      return {
        lang: trad.lang,
        title: trad.title ? trad.title : "Título no disponible / Title not available",
        description: trad.description ? trad.description : "Traducción no disponible / Translation not available",
        ingredients: Array.isArray(trad.ingredients) && trad.ingredients.length > 0
          ? trad.ingredients
          : ["Sin ingredientes / No ingredients"],
        instruction: Array.isArray(trad.instruction) && trad.instruction.length > 0
          ? trad.instruction
          : ["Sin instrucciones / No instructions"]
      };
    });

    const recetaActualizada = await prisma.receta.update({
      where: {
        idReceta: id
      },
      data: {
        urlImagen,
        cookingTime: Number(cookingTime),
        servings: Number(servings),
        isGlutenFree: Boolean(isGlutenFree),
        type,
        traducciones: {
          deleteMany: {}, //Borra los idiomas viejos de esta receta en particular
          create: traduccionesAInsertar //Inserta los nuevos que nos mandó el body
        }
      },
      include: {
        traducciones: true //Devolvemos la receta con los idiomas actualizados
      }
    });

    res.status(200).json({
      status: "ok",
      message: `Receta ${id} actualizada exitosamente`,
      data: recetaActualizada
    });

  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ status: "error", message: `La receta ${id} no existe para actualizar` });
    }
    console.error("Error en updateReceta:", error);
    res.status(500).json({ status: "error", message: "Error inesperado del servidor" });
  }
};

export const deleteReceta = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ status: "error", message: "ID inválido" });
    }

    await prisma.receta.delete({
      where: { idReceta: id }
    });

    res.status(200).json({ status: "ok", message: `Receta ${id} eliminada exitosamente` });
  } catch (error) {
    // P2025 es el código de error que tira Prisma si intentás borrar algo que no existe
    if (error.code === 'P2025') {
      return res.status(404).json({ status: "error", message: `La receta ${id} no existe` });
    }
    console.error("Error en deleteReceta:", error);
    res.status(500).json({ status: "error", message: "Error inesperado del servidor" });
  }
};