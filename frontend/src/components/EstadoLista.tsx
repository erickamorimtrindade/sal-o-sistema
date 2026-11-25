import { Alert, Button, Center, Skeleton, Stack, Text } from "@mantine/core";
import { IconAlertCircle, IconPlus, IconSearchOff } from "@tabler/icons-react";

interface Props {
  carregando: boolean;
  erro: string | null;
  vazio: boolean; // a tabela ainda não tem nenhum registro
  semResultados: boolean; // há registros, mas a busca não achou nenhum
  mensagemVazio: string;
  rotuloAcao: string;
  aoAdicionar: () => void;
  aoTentarDeNovo: () => void;
}

// Mostra o que fazer enquanto a lista não está pronta: carregando, erro ou vazia.
// Se não houver nenhum desses casos, não mostra nada (a tabela aparece normalmente).
export function EstadoLista(p: Props) {
  if (p.carregando) {
    return (
      <Stack gap="xs" p="md">
        {[0, 1, 2, 3].map((n) => (
          <Skeleton key={n} h={36} radius="sm" />
        ))}
      </Stack>
    );
  }

  if (p.erro) {
    return (
      <Stack p="md" align="flex-start">
        <Alert color="red" icon={<IconAlertCircle size={18} />} title="Não foi possível carregar" w="100%">
          {p.erro}
        </Alert>
        <Button variant="default" onClick={p.aoTentarDeNovo}>
          Tentar de novo
        </Button>
      </Stack>
    );
  }

  if (p.vazio) {
    return (
      <Center py={56}>
        <Stack align="center" gap="xs">
          <Text fw={600}>{p.mensagemVazio}</Text>
          <Button mt={4} leftSection={<IconPlus size={17} />} onClick={p.aoAdicionar}>
            {p.rotuloAcao}
          </Button>
        </Stack>
      </Center>
    );
  }

  if (p.semResultados) {
    return (
      <Center py={48}>
        <Stack align="center" gap={6}>
          <IconSearchOff size={28} stroke={1.5} color="var(--mantine-color-gray-6)" />
          <Text fw={600}>Nenhum resultado para a busca</Text>
          <Text c="dimmed" fz="sm">
            Confira o texto digitado ou limpe o campo de busca.
          </Text>
        </Stack>
      </Center>
    );
  }

  return null;
}
