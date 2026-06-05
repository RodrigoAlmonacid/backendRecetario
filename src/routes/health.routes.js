import { Router } from 'express';

const router = Router();
router.get('/health', (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API del Recetario funcionando correctamente"
  });
});
export default router;