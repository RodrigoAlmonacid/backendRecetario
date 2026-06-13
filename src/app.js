import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRoutes from './routes/health.routes.js';
import recetaRoutes from './routes/receta.routes.js';

dotenv.config();
const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));
app.use(express.json());
app.use('/api', healthRoutes);
app.use('/api/recetas', recetaRoutes);
export default app;