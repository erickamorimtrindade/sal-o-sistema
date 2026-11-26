# Agenda do Salão

Projeto final de **Desenvolvimento Web A2**.

- **Aluno:** Erick Amorim Trindade
- **RGM:** 42930715
- **Trabalho feito individualmente**

## Tema

Sistema de agendamento para um salão de beleza. A recepção cadastra clientes, profissionais e serviços e marca os atendimentos na agenda.

## Tabelas e relações

| Tabela | Campos principais | Relações |
|---|---|---|
| `usuarios` | nome, email (**único**), senha (hash bcrypt) | usada só para login |
| `clientes` | nome, email (**único**), telefone | tem vários agendamentos |
| `profissionais` | nome, especialidade | tem vários agendamentos |
| `servicos` | nome, preco, duracaoMin | tem vários agendamentos |
| `agendamentos` | dataHora, status, observacoes | **FK para clientes, profissionais e servicos** |

`agendamentos` é a tabela ligada a três outras. A listagem dela usa `include` do Prisma e devolve nome do cliente, do profissional e do serviço.

## Tecnologias

- **Banco:** PostgreSQL 16 (Docker) + Prisma
- **API:** Node, Express, TypeScript, em camadas (routes → controllers → services → repositories)
- **Validação:** Zod, em um pacote `shared` usado pela API e pelo frontend
- **Documentação:** Swagger em `/docs`
- **Frontend:** React, Vite, TypeScript, Mantine e Axios
- **Senha:** bcrypt

Estrutura: monorepo com npm workspaces (`shared`, `api`, `frontend`).

## Como rodar do zero

Pré-requisitos: Node.js 22 ou mais novo, Docker Desktop aberto e Git.

```bash
# 1. baixar o projeto
git clone https://github.com/erickamorimtrindade/sal-o-sistema.git
cd sal-o-sistema

# 2. subir o banco (PostgreSQL no Docker)
docker compose up -d

# 3. criar o arquivo de ambiente da API
#    Windows PowerShell:  Copy-Item api/.env.example api/.env
#    Linux/Mac:           cp api/.env.example api/.env

# 4. instalar as dependências
npm install

# 5. criar as tabelas e popular o banco
cd api
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
cd ..

# 6. rodar a API (terminal 1)
npm run dev:api

# 7. rodar o frontend (terminal 2)
npm run dev:front
```

- API: http://localhost:3333
- Swagger: http://localhost:3333/docs
- Frontend: http://localhost:5173

### Build

```bash
npm run build -w api
npm run build -w frontend
```

## Usuário para o professor

| E-mail | Senha |
|---|---|
| `professor@salao.com` | `professor123` |

Criado pelo seed (`api/prisma/seed.ts`). A senha fica salva com hash bcrypt.

## Rotas da API

| Recurso | Rotas |
|---|---|
| Auth | `POST /auth/cadastro`, `POST /auth/login` |
| Clientes | `GET/POST /clientes`, `GET/PUT/DELETE /clientes/:id` |
| Profissionais | `GET/POST /profissionais`, `GET/PUT/DELETE /profissionais/:id` |
| Serviços | `GET/POST /servicos`, `GET/PUT/DELETE /servicos/:id` |
| Agendamentos | `GET/POST /agendamentos`, `GET/PUT/DELETE /agendamentos/:id` |

Respostas: `201` ao criar, `204` ao excluir, `404` quando não existe, `400` para dados inválidos e `409` para e-mail já cadastrado.
