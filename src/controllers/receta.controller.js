import {
  validateRecetaBody,
  isBodyEmpty,
} from "../validators/receta.validator.js";

//Metodo GET

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const getRecetas = async (req, res) => {
  try {
    const { search, lang } = req.query;
    const todasLasRecetas = await prisma.receta.findMany();
    res.status(200).json({
      status: "ok",
      message: "Lista de recetas obtenida",
      filtrosAplicados: { search, lang },
      data: [],
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error inesperado del servidor" });
      data: todasLasRecetas
    });
  } catch (error) {
    console.error("Error al obtener recetas:", error); 
    res.status(500).json({ status: "error", message: "Error inesperado del servidor" });
  }
};

export const getRecetaById = async (req, res) => {
  try {
    const { id } = req.params;
    res.status(404).json({
      status: "error",
      message: `Recurso no encontrado: Receta ${id} no existe`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error inesperado del servidor" });
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

    res.status(201).json({
      status: "ok",
      message: "Receta creada exitosamente",
      data: body,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error inesperado del servidor" });
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
