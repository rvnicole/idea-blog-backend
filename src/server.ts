// Cargar variables de entorno
import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import { corsConfig } from "./config/cors";
import { connectDB } from "./config/db";
import './cron/tokenCleaner';
import setupAssociations from "./models/associations";
import postRouter from "./routes/postRoutes";
import authRouter from "./routes/authRoutes";
import commentRouter from "./routes/commentRoutes";
import userRouter from "./routes/userRoute";

// Conexión a la BD
connectDB();
setupAssociations();

const app = express();

// Configuración de CORS
app.use( cors(corsConfig) );

// Aceptar formato JSON en las peticiones a la API
app.use( express.json() );

// Routes
app.use("/api/posts", postRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/comments", commentRouter);

export default app;
