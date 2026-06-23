import { Router } from 'express';
import { login } from './../controllers/auth.controller.js';
import { registerUsuario } from './../controllers/auth.controller.js';

const router = Router();

router.post('/login', login);
router.post('/register', registerUsuario);

export default router;