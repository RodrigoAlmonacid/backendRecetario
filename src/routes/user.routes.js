// src/routes/user.routes.js
import { Router } from 'express';
import { getUsuarios, updateUsuarioRol } from './../controllers/user.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = Router();

router.get('/', verificarToken, requireRole(['superUsuario']), getUsuarios);
router.put('/:id/rol', verificarToken, requireRole(['superUsuario']), updateUsuarioRol);

export default router;