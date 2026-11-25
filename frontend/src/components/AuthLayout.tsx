import { Avatar, Group, Stack, Text, Title } from "@mantine/core";
import { IconCalendarCheck, IconScissors, IconUsers, IconChecks } from "@tabler/icons-react";
import type { ReactNode } from "react";

const vantagens = [
  { icone: IconCalendarCheck, texto: "Veja os atendimentos do dia assim que entrar" },
  { icone: IconUsers, texto: "Mantenha clientes, profissionais e serviços organizados" },
  { icone: IconChecks, texto: "Acompanhe cada atendimento até a conclusão" },
];

// Tela dividida usada no login e no cadastro: painel da marca à esquerda, formulário à direita.
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="sa-auth">
      <aside className="sa-auth-marca">
        <Group gap="sm">
          <Avatar color="white" variant="white" radius="md" size={38}>
            <IconScissors size={21} color="#134642" />
          </Avatar>
          <Text fw={700} fz="lg">
            Agenda do Salão
          </Text>
        </Group>

        <Stack gap="xl" maw={420}>
          <Title order={1} fz={38} lh={1.15} fw={650}>
            A agenda do salão, sem caderno e sem confusão.
          </Title>
          <Stack gap="md">
            {vantagens.map(({ icone: Icone, texto }) => (
              <Group key={texto} gap="sm" wrap="nowrap" align="flex-start">
                <Icone size={22} stroke={1.6} style={{ flexShrink: 0, marginTop: 1 }} />
                <Text c="rgba(255,255,255,0.86)">{texto}</Text>
              </Group>
            ))}
          </Stack>
        </Stack>

        <Text fz="sm" c="rgba(255,255,255,0.6)">
          Projeto de Desenvolvimento Web
        </Text>
      </aside>

      <main className="sa-auth-form">
        <div style={{ width: "100%", maxWidth: 400 }}>{children}</div>
      </main>
    </div>
  );
}
