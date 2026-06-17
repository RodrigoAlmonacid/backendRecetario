import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRoutes from './routes/health.routes.js';
import recetaRoutes from './routes/receta.routes.js';
import authRoutes from './routes/auth.routes.js'
import favoritosRoutes from './routes/favoritos.routes.js'

dotenv.config();
const app = express();

const origenesPermitidos = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174'
];

app.use(cors({
  origin: origenesPermitidos
}));

app.use(express.json());

app.use('/api', healthRoutes);
app.use('/api/recetas', recetaRoutes);

app.use('/api/auth', authRoutes)

app.use("/api/favoritos", favoritosRoutes);

export default app;