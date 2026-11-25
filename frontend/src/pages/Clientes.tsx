import { Alert, Button, Group, Modal, Paper, Stack, Table, Text, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconPlus, IconSearch } from "@tabler/icons-react";
import { clienteSchema, type ClienteInput } from "@salao/shared";
import { useState, type FormEvent } from "react";
import { AcoesLinha } from "../components/AcoesLinha";
import { ConfirmarRemocao } from "../components/ConfirmarRemocao";
import { EstadoLista } from "../components/EstadoLista";
import { PageHeader } from "../components/PageHeader";
import { useFormZod } from "../hooks/useFormZod";
import { useLista } from "../hooks/useLista";
import { clientesApi, lerErroApi } from "../services/api";
import type { Cliente } from "../types";

// ---------- Formulário (o mesmo modal serve para criar e para editar) ----------
function FormularioCliente({
  cliente,
  aoSalvar,
  aoCancelar,
}: {
  cliente: Cliente | null; // null = criando um novo
  aoSalvar: () => void;
  aoCancelar: () => void;
}) {
  const { valores, erros, setErros, mudar, validar } = useFormZod<ClienteInput>(
    clienteSchema,
    cliente ? { nome: cliente.nome, telefone: cliente.telefone, email: cliente.email } : { nome: "", telefone: "", email: "" },
  );
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const aoEnviar = async (e: FormEvent) => {
    e.preventDefault();
    setMensagem(null);

    const dados = validar(); // confere com o schema do shared antes de enviar
    if (!dados) return;

    setSalvando(true);
    try {
      if (cliente) await clientesApi.atualizar(cliente.id, dados); // PUT /clientes/:id
      else await clientesApi.criar(dados); // POST /clientes
      notifications.show({ color: "green", message: cliente ? "Cliente atualizado." : "Cliente cadastrado." });
      aoSalvar();
    } catch (erro) {
      const { mensagem: texto, campos } = lerErroApi(erro);
      setErros(campos); // ex.: e-mail repetido aparece embaixo do campo e-mail
      if (Object.keys(campos).length === 0) setMensagem(texto);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <form onSubmit={aoEnviar} noValidate>
      <Stack gap="md">
        {mensagem && (
          <Alert color="red" icon={<IconAlertCircle size={18} />}>
            {mensagem}
          </Alert>
        )}
        <TextInput
          label="Nome"
          placeholder="Nome completo"
          data-autofocus
          value={valores.nome ?? ""}
          onChange={(e) => mudar("nome", e.currentTarget.value)}
          error={erros.nome}
        />
        <TextInput
          label="Telefone"
          placeholder="(81) 99999-0000"
          value={valores.telefone ?? ""}
          onChange={(e) => mudar("telefone", e.currentTarget.value)}
          error={erros.telefone}
        />
        <TextInput
          label="E-mail"
          placeholder="cliente@exemplo.com"
          type="email"
          value={valores.email ?? ""}
          onChange={(e) => mudar("email", e.currentTarget.value)}
          error={erros.email}
        />
        <Group justify="flex-end" mt="xs">
          <Button variant="default" onClick={aoCancelar}>
            Cancelar
          </Button>
          <Button type="submit" loading={salvando}>
            {cliente ? "Salvar alterações" : "Cadastrar cliente"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

// ---------- Tela ----------
export default function Clientes() {
  const { itens, carregando, erro, recarregar } = useLista(clientesApi.listar);
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<Cliente | null>(null);
  const [aRemover, setARemover] = useState<Cliente | null>(null);

  // Busca por texto com .filter, em nome, telefone e e-mail
  const termo = busca.trim().toLowerCase();
  const filtrados = itens.filter((c) => `${c.nome} ${c.telefone} ${c.email}`.toLowerCase().includes(termo));

  const abrirNovo = () => {
    setEditando(null);
    setModalAberto(true);
  };
  const abrirEdicao = (c: Cliente) => {
    setEditando(c);
    setModalAberto(true);
  };
  const aposSalvar = () => {
    setModalAberto(false);
    void recarregar();
  };

  return (
    <>
      <PageHeader
        titulo="Clientes"
        descricao="Quem você atende. Cadastre uma vez e agende quando quiser."
        acao={
          <Button leftSection={<IconPlus size={18} />} onClick={abrirNovo}>
            Novo cliente
          </Button>
        }
      />

      <Paper withBorder radius="md" bg="white">
        <Group justify="space-between" p="md" gap="sm">
          <TextInput
            placeholder="Buscar por nome, telefone ou e-mail"
            leftSection={<IconSearch size={17} />}
            value={busca}
            onChange={(e) => setBusca(e.currentTarget.value)}
            w={{ base: "100%", sm: 360 }}
            aria-label="Buscar clientes"
          />
          {!carregando && !erro && (
            <Text c="dimmed" fz="sm">
              {filtrados.length} {filtrados.length === 1 ? "cliente" : "clientes"}
            </Text>
          )}
        </Group>

        <EstadoLista
          carregando={carregando}
          erro={erro}
          vazio={!carregando && !erro && itens.length === 0}
          semResultados={!carregando && !erro && itens.length > 0 && filtrados.length === 0}
          mensagemVazio="Você ainda não cadastrou nenhum cliente"
          rotuloAcao="Cadastrar o primeiro cliente"
          aoAdicionar={abrirNovo}
          aoTentarDeNovo={() => void recarregar()}
        />

        {!carregando && !erro && filtrados.length > 0 && (
          <Table.ScrollContainer minWidth={560}>
            <Table verticalSpacing="sm" horizontalSpacing="md" highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Nome</Table.Th>
                  <Table.Th>Telefone</Table.Th>
                  <Table.Th>E-mail</Table.Th>
                  <Table.Th w={90} />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filtrados.map((c) => (
                  <Table.Tr key={c.id}>
                    <Table.Td fw={600}>{c.nome}</Table.Td>
                    <Table.Td>{c.telefone}</Table.Td>
                    <Table.Td c="dimmed">{c.email}</Table.Td>
                    <Table.Td>
                      <AcoesLinha aoEditar={() => abrirEdicao(c)} aoRemover={() => setARemover(c)} />
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        )}
      </Paper>

      <Modal
        opened={modalAberto}
        onClose={() => setModalAberto(false)}
        title={editando ? "Editar cliente" : "Novo cliente"}
        centered
      >
        <FormularioCliente cliente={editando} aoSalvar={aposSalvar} aoCancelar={() => setModalAberto(false)} />
      </Modal>

      <ConfirmarRemocao
        aberto={aRemover !== null}
        nome={aRemover?.nome ?? ""}
        dicaBloqueio="Remova ou altere os agendamentos deste cliente antes."
        remover={() => clientesApi.remover(aRemover!.id)}
        aoFechar={() => setARemover(null)}
        aoRemovido={() => {
          setARemover(null);
          void recarregar();
        }}
      />
    </>
  );
}
