import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Usuário para o professor entrar no sistema
  const senhaHash = await bcrypt.hash("professor123", 10);
  await prisma.usuario.upsert({
    where: { email: "professor@salao.com" },
    update: { senha: senhaHash },
    create: { nome: "Professor", email: "professor@salao.com", senha: senhaHash },
  });

  // Limpa as tabelas do negócio (agendamentos primeiro, pois apontam para as outras)
  await prisma.agendamento.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.profissional.deleteMany();
  await prisma.servico.deleteMany();

  const [ana, bruno, carla] = await Promise.all([
    prisma.cliente.create({ data: { nome: "Ana Souza", telefone: "(81) 99999-0001", email: "ana@email.com" } }),
    prisma.cliente.create({ data: { nome: "Bruno Lima", telefone: "(81) 99999-0002", email: "bruno@email.com" } }),
    prisma.cliente.create({ data: { nome: "Carla Mendes", telefone: "(81) 99999-0003", email: "carla@email.com" } }),
  ]);

  const [marina, joao] = await Promise.all([
    prisma.profissional.create({ data: { nome: "Marina Alves", especialidade: "Cabelereira" } }),
    prisma.profissional.create({ data: { nome: "João Ribeiro", especialidade: "Barbeiro" } }),
  ]);

  const [corte, manicure, escova] = await Promise.all([
    prisma.servico.create({ data: { nome: "Corte de cabelo", preco: 50, duracaoMin: 45 } }),
    prisma.servico.create({ data: { nome: "Manicure", preco: 35, duracaoMin: 60 } }),
    prisma.servico.create({ data: { nome: "Escova", preco: 60, duracaoMin: 40 } }),
  ]);

  // datas relativas a hoje, para a Home sempre ter atendimentos
  const agora = new Date();
  const dia = (d: number, h: number) =>
    new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + d, h, 0, 0);

  await prisma.agendamento.createMany({
    data: [
      { dataHora: dia(0, 9), status: "AGENDADO", clienteId: ana.id, profissionalId: marina.id, servicoId: escova.id },
      { dataHora: dia(0, 14), status: "AGENDADO", clienteId: bruno.id, profissionalId: joao.id, servicoId: corte.id, observacoes: "Degradê na régua" },
      { dataHora: dia(0, 11), status: "CONCLUIDO", clienteId: carla.id, profissionalId: marina.id, servicoId: manicure.id },
      { dataHora: dia(1, 16), status: "CANCELADO", clienteId: ana.id, profissionalId: joao.id, servicoId: corte.id },
    ],
  });

  console.log("Seed concluído. Login: professor@salao.com / professor123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
