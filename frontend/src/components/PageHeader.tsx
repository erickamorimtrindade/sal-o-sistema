import { Group, Text, Title } from "@mantine/core";
import type { ReactNode } from "react";

// Título da página + frase de apoio à esquerda e o botão principal à direita.
export function PageHeader({ titulo, descricao, acao }: { titulo: string; descricao?: string; acao?: ReactNode }) {
  return (
    <Group justify="space-between" align="flex-end" mb="lg" gap="md">
      <div>
        <Title order={2} fz={26}>
          {titulo}
        </Title>
        {descricao && (
          <Text c="dimmed" mt={4}>
            {descricao}
          </Text>
        )}
      </div>
      {acao}
    </Group>
  );
}
