import {
  validateRecetaBody,
  isBodyEmpty,
} from "../validations/receta.validation.js";

//Metodo GET

import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export const getRecetas = async (req, res) => {
  try {
    const { search, lang } = req.query;
    const idiomaSeleccionado = lang || "es";

    const todasLasRecetas = await prisma.receta.findMany({
      include: {
        traducciones: {
          where: {
            lang: idiomaSeleccionado
          }
        }
      }
    });
    res.status(200).json({
      status: "ok",
      message: "Lista de recetas obtenida",
      filtrosAplicados: { search, lang },
      data: todasLasRecetas,
    });
  } catch (error) {
    res.status(500)
      .json({
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
        urlImagen: urlImagen || "https://ruta-por-defecto.png",
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
      return res.status(400).json({
        status: "error",
        message: "ID inválido",
      });
    }

    const body = req.body;

    if (isBodyEmpty(body)) {
      return res.status(400).json({
        status: "error",
        message: "Body inválido o incompleto",
      });
    }

    const errors = validateRecetaBody(body);

    if (errors.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "Validación fallida",
        errors,
      });
    }

    res.status(200).json({
      status: "ok",
      message: `Receta ${id} actualizada exitosamente`,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error inesperado del servidor",
    });
  }
};

export const deleteReceta = async (req, res) => {
  try {
    const { id } = req.params;
    res.status(200).json({ status: "ok", message: `Receta ${id} eliminada exitosamente (Mock)` });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error inesperado del servidor" });
  }
};
