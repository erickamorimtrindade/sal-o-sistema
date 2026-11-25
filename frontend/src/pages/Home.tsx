import { Alert, Anchor, Button, Group, Paper, Skeleton, Stack, Text, Title } from "@mantine/core";
import { IconAlertCircle, IconCalendarPlus, IconUsers } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { useLista } from "../hooks/useLista";
import { agendamentosApi, clientesApi, profissionaisApi } from "../services/api";
import type { Agendamento } from "../types";
import { formatarData, formatarHora, mesmoDia } from "../utils/formatar";

const COR_PONTO = { AGENDADO: "#228be6", CONCLUIDO: "#2f9e44", CANCELADO: "#adb5bd" } as const;

function Indicador({ valor, rotulo, carregando }: { valor: number; rotulo: string; carregando: boolean }) {
  return (
    <div className="sa-indicador">
      {carregando ? (
        <Skeleton h={30} w={40} />
      ) : (
        <Text fz={28} fw={650} lh={1.1}>
          {valor}
        </Text>
      )}
      <Text c="dimmed" fz="sm" mt={4}>
        {rotulo}
      </Text>
    </div>
  );
}

function ItemAgenda({ a }: { a: Agendamento }) {
  const cancelado = a.status === "CANCELADO";
  return (
    <div className="sa-agenda-item" style={{ opacity: cancelado ? 0.6 : 1 }}>
      <span className="sa-agenda-hora">{formatarHora(a.dataHora)}</span>
      <span className="sa-agenda-ponto" style={{ color: COR_PONTO[a.status] }} />
      <div style={{ minWidth: 0 }}>
        <Text fw={600} td={cancelado ? "line-through" : undefined}>
          {a.servico.nome}
        </Text>
        <Text c="dimmed" fz="sm">
          {a.cliente.nome}, com {a.profissional.nome}
        </Text>
      </div>
      <StatusBadge status={a.status} />
    </div>
  );
}

export default function Home() {
  const { usuario } = useAuth();
  const ag = useLista(agendamentosApi.listar);
  const cl = useLista(clientesApi.listar);
  const pr = useLista(profissionaisApi.listar);

  const agora = new Date();
  const hoje = ag.itens.filter((a) => mesmoDia(new Date(a.dataHora), agora));
  const proximos = ag.itens
    .filter((a) => a.status === "AGENDADO" && new Date(a.dataHora) > agora && !mesmoDia(new Date(a.dataHora), agora))
    .slice(0, 5);
  const aAgendar = ag.itens.filter((a) => a.status === "AGENDADO" && new Date(a.dataHora) >= agora).length;

  const dataExtenso = agora.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
  const primeiroNome = usuario?.nome.split(" ")[0];

  return (
    <>
      <PageHeader
        titulo={`Olá, ${primeiroNome}`}
        descricao={dataExtenso.charAt(0).toUpperCase() + dataExtenso.slice(1)}
        acao={
          <Button component={Link} to="/agendamentos?novo=1" leftSection={<IconCalendarPlus size={18} />}>
            Novo agendamento
          </Button>
        }
      />

      <div className="sa-indicadores">
        <Indicador valor={hoje.length} rotulo="atendimentos hoje" carregando={ag.carregando} />
        <Indicador valor={aAgendar} rotulo="ainda por vir" carregando={ag.carregando} />
        <Indicador valor={cl.itens.length} rotulo="clientes" carregando={cl.carregando} />
        <Indicador valor={pr.itens.length} rotulo="profissionais" carregando={pr.carregando} />
      </div>

      {ag.erro && (
        <Alert mt="lg" color="red" icon={<IconAlertCircle size={18} />} title="Não foi possível carregar a agenda">
          {ag.erro}
        </Alert>
      )}

      <Group align="flex-start" wrap="wrap" gap="xl" mt="xl" grow preventGrowOverflow={false}>
        {/* Agenda de hoje: o destaque da tela */}
        <Paper withBorder radius="md" p="lg" bg="white" style={{ flex: "2 1 420px" }}>
          <Group justify="space-between" mb={6}>
            <Title order={3} fz={19}>
              Agenda de hoje
            </Title>
            <Anchor component={Link} to="/agendamentos" fz="sm" fw={600}>
              Ver todos
            </Anchor>
          </Group>

          {ag.carregando ? (
            <Stack gap="sm" mt="md">
              {[0, 1, 2].map((n) => (
                <Skeleton key={n} h={46} />
              ))}
            </Stack>
          ) : hoje.length === 0 ? (
            <Stack align="flex-start" gap="xs" py="lg">
              <Text fw={600}>Nenhum atendimento marcado para hoje</Text>
              <Text c="dimmed" fz="sm">
                Quando houver um agendamento neste dia, ele aparece aqui, por horário.
              </Text>
              <Button component={Link} to="/agendamentos?novo=1" variant="light" mt={4}>
                Agendar um atendimento
              </Button>
            </Stack>
          ) : (
            <div>
              {hoje.map((a) => (
                <ItemAgenda key={a.id} a={a} />
              ))}
            </div>
          )}
        </Paper>

        {/* Próximos dias + atalho */}
        <Stack gap="lg" style={{ flex: "1 1 280px" }}>
          <div>
            <Title order={3} fz={19} mb="xs">
              Próximos dias
            </Title>
            {ag.carregando ? (
              <Skeleton h={90} />
            ) : proximos.length === 0 ? (
              <Text c="dimmed" fz="sm">
                Nenhum atendimento agendado para os próximos dias.
              </Text>
            ) : (
              <Stack gap={0}>
                {proximos.map((a) => (
                  <Group
                    key={a.id}
                    justify="space-between"
                    wrap="nowrap"
                    py={10}
                    style={{ borderBottom: "1px solid var(--sa-borda)" }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <Text fw={600} fz="sm" truncate>
                        {a.cliente.nome}
                      </Text>
                      <Text c="dimmed" fz="xs" truncate>
                        {a.servico.nome}
                      </Text>
                    </div>
                    <Text fz="sm" ta="right" style={{ whiteSpace: "nowrap" }}>
                      {formatarData(a.dataHora).slice(0, 5)} às {formatarHora(a.dataHora)}
                    </Text>
                  </Group>
                ))}
              </Stack>
            )}
          </div>

          <Button component={Link} to="/clientes" variant="default" leftSection={<IconUsers size={18} />} justify="flex-start">
            Cadastrar um cliente
          </Button>
        </Stack>
      </Group>
    </>
  );
}
