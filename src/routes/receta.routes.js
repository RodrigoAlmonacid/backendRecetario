import { Router } from 'express';
import {
  getRecetas,
  getRecetaById,
  createReceta,
  updateReceta,
  deleteReceta
} from '../controllers/receta.controller.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { verificarToken } from '../middlewares/auth.middleware.js'

const router = Router();
//rutas públicas
router.get('/', getRecetas);
router.get('/:id', getRecetaById);

//rutas privadas
router.post('/', verificarToken, requireRole(['administrador', 'superUsuario']), createReceta);
router.put('/:id', verificarToken, requireRole(['administrador', 'superUsuario']), updateReceta);
router.delete('/:id', verificarToken, requireRole(['administrador', 'superUsuario']), deleteReceta);

export default router;