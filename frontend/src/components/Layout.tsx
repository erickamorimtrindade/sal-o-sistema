import { AppShell, Avatar, Burger, Button, Group, NavLink, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconCalendarEvent,
  IconHome2,
  IconLogout,
  IconScissors,
  IconUserHeart,
  IconUsers,
  IconSparkles,
} from "@tabler/icons-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { iniciais } from "../utils/formatar";

const itens = [
  { rotulo: "Início", rota: "/", icone: IconHome2, exato: true },
  { rotulo: "Agendamentos", rota: "/agendamentos", icone: IconCalendarEvent },
  { rotulo: "Clientes", rota: "/clientes", icone: IconUsers },
  { rotulo: "Profissionais", rota: "/profissionais", icone: IconUserHeart },
  { rotulo: "Serviços", rota: "/servicos", icone: IconSparkles },
];

function Marca() {
  return (
    <Group gap="sm" wrap="nowrap">
      <Avatar color="pinho" variant="filled" radius="md" size={34}>
        <IconScissors size={19} />
      </Avatar>
      <Text fw={700} fz="md" lh={1.1}>
        Agenda do Salão
      </Text>
    </Group>
  );
}

// Estrutura fixa de todas as telas internas: menu lateral + área de conteúdo.
export default function Layout() {
  const [menuAberto, { toggle, close }] = useDisclosure(false);
  const { usuario, sair } = useAuth();
  const { pathname } = useLocation();
  const navegar = useNavigate();

  const aoSair = () => {
    sair();
    navegar("/login");
  };

  return (
    <AppShell
      header={{ height: { base: 56, sm: 0 } }}
      navbar={{ width: 252, breakpoint: "sm", collapsed: { mobile: !menuAberto } }}
      padding={0}
    >
      {/* Barra superior: só aparece no celular */}
      <AppShell.Header hiddenFrom="sm" px="md">
        <Group h="100%" justify="space-between">
          <Marca />
          <Burger opened={menuAberto} onClick={toggle} size="sm" aria-label="Abrir menu" />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack gap="xs" h="100%">
          <div className="sa-marca-desktop" style={{ padding: "6px 8px 18px" }}>
            <Marca />
          </div>

          <Stack gap={2} style={{ flex: 1 }}>
            {itens.map(({ rotulo, rota, icone: Icone, exato }) => (
              <NavLink
                key={rota}
                component={Link}
                to={rota}
                label={rotulo}
                leftSection={<Icone size={19} stroke={1.7} />}
                active={exato ? pathname === rota : pathname.startsWith(rota)}
                onClick={close}
                variant="light"
                style={{ borderRadius: 8, fontWeight: 500 }}
              />
            ))}
          </Stack>

          {/* Rodapé do menu: quem está logado e botão de sair */}
          <Stack gap="xs" pt="sm" style={{ borderTop: "1px solid var(--sa-borda)" }}>
            <Group gap="sm" wrap="nowrap" px={4}>
              <Avatar color="pinho" radius="xl" size={34}>
                {iniciais(usuario?.nome ?? "?")}
              </Avatar>
              <div style={{ minWidth: 0 }}>
                <Text fz="sm" fw={600} truncate>
                  {usuario?.nome}
                </Text>
                <Text fz="xs" c="dimmed" truncate>
                  {usuario?.email}
                </Text>
              </div>
            </Group>
            <Button
              variant="subtle"
              color="gray"
              fullWidth
              justify="flex-start"
              leftSection={<IconLogout size={18} />}
              onClick={aoSair}
            >
              Sair
            </Button>
          </Stack>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main style={{ background: "var(--sa-fundo)" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 24px 56px" }}>
          <Outlet />
        </div>
      </AppShell.Main>
    </AppShell>
  );
}
