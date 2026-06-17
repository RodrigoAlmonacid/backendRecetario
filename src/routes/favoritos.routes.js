import { Router } from "express";
import { 
  getFavoritosIds, 
  toggleFavorito, 
  getRecetasFavoritas 
} from "../controllers/favoritos.controller.js";

import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/ids", verificarToken, getFavoritosIds);
router.get("/", verificarToken, getRecetasFavoritas);
router.post("/toggle", verificarToken, toggleFavorito);

export default router;