import {
  Alert,
  Button,
  Group,
  Modal,
  Paper,
  SegmentedControl,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconPlus, IconSearch } from "@tabler/icons-react";
import { agendamentoSchema, STATUS_AGENDAMENTO, type AgendamentoInput } from "@salao/shared";
import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { AcoesLinha } from "../components/AcoesLinha";
import { ConfirmarRemocao } from "../components/ConfirmarRemocao";
import { EstadoLista } from "../components/EstadoLista";
import { PageHeader } from "../components/PageHeader";
import { STATUS_INFO, StatusBadge } from "../components/StatusBadge";
import { useFormZod } from "../hooks/useFormZod";
import { useLista } from "../hooks/useLista";
import { agendamentosApi, clientesApi, lerErroApi, profissionaisApi, servicosApi } from "../services/api";
import type { Agendamento, Cliente, Profissional, Servico } from "../types";
import { formatarDataHora, formatarMoeda, paraInputLocal, proximaHoraCheia } from "../utils/formatar";

// ---------- Formulário (criar e editar no mesmo modal) ----------
function FormularioAgendamento({
  agendamento,
  clientes,
  profissionais,
  servicos,
  aoSalvar,
  aoCancelar,
}: {
  agendamento: Agendamento | null;
  clientes: Cliente[];
  profissionais: Profissional[];
  servicos: Servico[];
  aoSalvar: () => void;
  aoCancelar: () => void;
}) {
  const { valores, erros, setErros, mudar, validar } = useFormZod<AgendamentoInput>(
    agendamentoSchema,
    agendamento
      ? {
          dataHora: paraInputLocal(agendamento.dataHora),
          status: agendamento.status,
          observacoes: agendamento.observacoes ?? "",
          clienteId: agendamento.clienteId,
          profissionalId: agendamento.profissionalId,
          servicoId: agendamento.servicoId,
        }
      : { dataHora: proximaHoraCheia(), status: "AGENDADO", observacoes: "" },
  );
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  // Os selects mostram o NOME, mas guardam o id (a pessoa nunca digita um id).
  const opcoesClientes = clientes.map((c) => ({ value: String(c.id), label: c.nome }));
  const opcoesProfissionais = profissionais.map((p) => ({ value: String(p.id), label: `${p.nome} (${p.especialidade})` }));
  const opcoesServicos = servicos.map((s) => ({
    value: String(s.id),
    label: `${s.nome} (${s.duracaoMin} min, ${formatarMoeda(s.preco)})`,
  }));

  const aoEnviar = async (e: FormEvent) => {
    e.preventDefault();
    setMensagem(null);

    const dados = validar();
    if (!dados) return;

    setSalvando(true);
    try {
      if (agendamento) await agendamentosApi.atualizar(agendamento.id, dados);
      else await agendamentosApi.criar(dados);
      notifications.show({ color: "green", message: agendamento ? "Agendamento atualizado." : "Atendimento agendado." });
      aoSalvar();
    } catch (erro) {
      const { mensagem: texto, campos } = lerErroApi(erro);
      setErros(campos);
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

        <Select
          label="Cliente"
          placeholder="Escolha o cliente"
          data={opcoesClientes}
          searchable
          nothingFoundMessage="Nenhum cliente encontrado"
          value={valores.clienteId ? String(valores.clienteId) : null}
          onChange={(v) => mudar("clienteId", v ? Number(v) : undefined)}
          error={erros.clienteId}
        />
        <Select
          label="Serviço"
          placeholder="Escolha o serviço"
          data={opcoesServicos}
          searchable
          nothingFoundMessage="Nenhum serviço encontrado"
          value={valores.servicoId ? String(valores.servicoId) : null}
          onChange={(v) => mudar("servicoId", v ? Number(v) : undefined)}
          error={erros.servicoId}
        />
        <Select
          label="Profissional"
          placeholder="Escolha o profissional"
          data={opcoesProfissionais}
          searchable
          nothingFoundMessage="Nenhum profissional encontrado"
          value={valores.profissionalId ? String(valores.profissionalId) : null}
          onChange={(v) => mudar("profissionalId", v ? Number(v) : undefined)}
          error={erros.profissionalId}
        />

        <Group grow align="flex-start">
          <TextInput
            label="Data e hora"
            type="datetime-local"
            value={valores.dataHora ?? ""}
            onChange={(e) => mudar("dataHora", e.currentTarget.value)}
            error={erros.dataHora}
          />
          <Select
            label="Situação"
            allowDeselect={false}
            data={STATUS_AGENDAMENTO.map((s) => ({ value: s, label: STATUS_INFO[s].rotulo }))}
            value={valores.status ?? "AGENDADO"}
            onChange={(v) => v && mudar("status", v as AgendamentoInput["status"])}
            error={erros.status}
          />
        </Group>

        <Textarea
          label="Observações"
          placeholder="Opcional. Ex.: prefere atendimento pela manhã"
          autosize
          minRows={2}
          value={valores.observacoes ?? ""}
          onChange={(e) => mudar("observacoes", e.currentTarget.value)}
          error={erros.observacoes}
        />

        <Group justify="flex-end" mt="xs">
          <Button variant="default" onClick={aoCancelar}>
            Cancelar
          </Button>
          <Button type="submit" loading={salvando}>
            {agendamento ? "Salvar alterações" : "Agendar"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

// ---------- Tela ----------
type Filtro = "TODOS" | Agendamento["status"];

export default function Agendamentos() {
  const ag = useLista(agendamentosApi.listar);
  const clientes = useLista(clientesApi.listar);
  const profissionais = useLista(profissionaisApi.listar);
  const servicos = useLista(servicosApi.listar);

  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("TODOS");
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<Agendamento | null>(null);
  const [aRemover, setARemover] = useState<Agendamento | null>(null);

  // A Home leva para cá com ?novo=1 para já abrir o formulário.
  const [params, setParams] = useSearchParams();
  useEffect(() => {
    if (params.get("novo") === "1") {
      setEditando(null);
      setModalAberto(true);
      setParams({}, { replace: true });
    }
  }, [params, setParams]);

  // Filtro por situação + busca por texto (.filter) em cliente, serviço e profissional
  const termo = busca.trim().toLowerCase();
  const filtrados = ag.itens
    .filter((a) => filtro === "TODOS" || a.status === filtro)
    .filter((a) => `${a.cliente.nome} ${a.servico.nome} ${a.profissional.nome}`.toLowerCase().includes(termo));

  const abrirNovo = () => {
    setEditando(null);
    setModalAberto(true);
  };
  const abrirEdicao = (a: Agendamento) => {
    setEditando(a);
    setModalAberto(true);
  };
  const aposSalvar = () => {
    setModalAberto(false);
    void ag.recarregar();
  };

  const filtrando = termo !== "" || filtro !== "TODOS";

  return (
    <>
      <PageHeader
        titulo="Agendamentos"
        descricao="Todos os atendimentos, em ordem de data."
        acao={
          <Button leftSection={<IconPlus size={18} />} onClick={abrirNovo}>
            Novo agendamento
          </Button>
        }
      />

      <Paper withBorder radius="md" bg="white">
        <Stack gap="sm" p="md">
          <Group justify="space-between" gap="sm">
            <TextInput
              placeholder="Buscar por cliente, serviço ou profissional"
              leftSection={<IconSearch size={17} />}
              value={busca}
              onChange={(e) => setBusca(e.currentTarget.value)}
              w={{ base: "100%", sm: 360 }}
              aria-label="Buscar agendamentos"
            />
            {!ag.carregando && !ag.erro && (
              <Text c="dimmed" fz="sm">
                {filtrados.length} {filtrados.length === 1 ? "atendimento" : "atendimentos"}
              </Text>
            )}
          </Group>
          <SegmentedControl
            value={filtro}
            onChange={(v) => setFiltro(v as Filtro)}
            data={[
              { value: "TODOS", label: "Todos" },
              { value: "AGENDADO", label: "Agendados" },
              { value: "CONCLUIDO", label: "Concluídos" },
              { value: "CANCELADO", label: "Cancelados" },
            ]}
            w="fit-content"
            maw="100%"
            style={{ overflowX: "auto" }}
          />
        </Stack>

        <EstadoLista
          carregando={ag.carregando}
          erro={ag.erro}
          vazio={!ag.carregando && !ag.erro && ag.itens.length === 0}
          semResultados={!ag.carregando && !ag.erro && ag.itens.length > 0 && filtrados.length === 0 && filtrando}
          mensagemVazio="Nenhum atendimento agendado ainda"
          rotuloAcao="Agendar o primeiro atendimento"
          aoAdicionar={abrirNovo}
          aoTentarDeNovo={() => void ag.recarregar()}
        />

        {!ag.carregando && !ag.erro && filtrados.length > 0 && (
          <Table.ScrollContainer minWidth={760}>
            <Table verticalSpacing="sm" horizontalSpacing="md" highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Data e hora</Table.Th>
                  <Table.Th>Cliente</Table.Th>
                  <Table.Th>Serviço</Table.Th>
                  <Table.Th>Profissional</Table.Th>
                  <Table.Th>Situação</Table.Th>
                  <Table.Th w={90} />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filtrados.map((a) => (
                  <Table.Tr key={a.id}>
                    <Table.Td style={{ whiteSpace: "nowrap" }} fw={600}>
                      {formatarDataHora(a.dataHora)}
                    </Table.Td>
                    <Table.Td>{a.cliente.nome}</Table.Td>
                    <Table.Td>
                      {a.servico.nome}
                      <Text c="dimmed" fz="xs">
                        {a.servico.duracaoMin} min
                      </Text>
                    </Table.Td>
                    <Table.Td>{a.profissional.nome}</Table.Td>
                    <Table.Td>
                      <StatusBadge status={a.status} />
                    </Table.Td>
                    <Table.Td>
                      <AcoesLinha aoEditar={() => abrirEdicao(a)} aoRemover={() => setARemover(a)} />
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
        title={editando ? "Editar agendamento" : "Novo agendamento"}
        centered
        size="lg"
      >
        <FormularioAgendamento
          agendamento={editando}
          clientes={clientes.itens}
          profissionais={profissionais.itens}
          servicos={servicos.itens}
          aoSalvar={aposSalvar}
          aoCancelar={() => setModalAberto(false)}
        />
      </Modal>

      <ConfirmarRemocao
        aberto={aRemover !== null}
        nome={aRemover ? `o agendamento de ${aRemover.cliente.nome}` : ""}
        dicaBloqueio="Tente novamente em instantes."
        remover={() => agendamentosApi.remover(aRemover!.id)}
        aoFechar={() => setARemover(null)}
        aoRemovido={() => {
          setARemover(null);
          void ag.recarregar();
        }}
      />
    </>
  );
}
