import { PrismaClient } from "@prisma/client";

// Uma única conexão com o banco, reaproveitada por todos os repositories.
export const prisma = new PrismaClient();
