import { Router } from 'express';
import { login, registerUsuario, renovarToken } from './../controllers/auth.controller.js';

const router = Router();

router.post('/login', login);
router.post('/register', registerUsuario);
router.post('/refresh', renovarToken);

export default router;