import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { errorHandler } from "./middlewares/errorHandler";
import { swaggerSpec } from "./docs/swagger";
import authRoutes from "./routes/auth.routes";
import clienteRoutes from "./routes/cliente.routes";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/auth", authRoutes);
app.use("/clientes", clienteRoutes);

app.use(errorHandler);
