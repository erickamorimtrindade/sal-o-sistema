import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { errorHandler } from "./middlewares/errorHandler";
import { swaggerSpec } from "./docs/swagger";
import authRoutes from "./routes/auth.routes";
import clienteRoutes from "./routes/cliente.routes";
import profissionalRoutes from "./routes/profissional.routes";
import servicoRoutes from "./routes/servico.routes";
import agendamentoRoutes from "./routes/agendamento.routes";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/auth", authRoutes);
app.use("/clientes", clienteRoutes);
app.use("/profissionais", profissionalRoutes);
app.use("/servicos", servicoRoutes);
app.use("/agendamentos", agendamentoRoutes);

app.use(errorHandler);
