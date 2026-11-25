import { Alert, Anchor, Button, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle } from "@tabler/icons-react";
import { cadastroSchema, type CadastroInput } from "@salao/shared";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { useFormZod } from "../hooks/useFormZod";
import { authApi, lerErroApi } from "../services/api";

export default function Cadastro() {
  const { valores, erros, setErros, mudar, validar } = useFormZod<CadastroInput>(cadastroSchema, {
    nome: "",
    email: "",
    senha: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const navegar = useNavigate();

  const aoEnviar = async (e: FormEvent) => {
    e.preventDefault();
    setMensagem(null);

    const dados = validar();
    if (!dados) return;

    setEnviando(true);
    try {
      await authApi.cadastro(dados);
      notifications.show({ color: "green", title: "Conta criada", message: "Agora é só entrar com seu e-mail e senha." });
      navegar("/login");
    } catch (erro) {
      const { mensagem: texto, campos } = lerErroApi(erro);
      setErros(campos);
      // Erro de campo (ex.: e-mail repetido) aparece junto do campo; os demais, no aviso.
      if (Object.keys(campos).length === 0) setMensagem(texto);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={aoEnviar} noValidate>
        <Stack gap="lg">
          <div>
            <Title order={2} fz={28}>
              Criar conta
            </Title>
            <Text c="dimmed" mt={6}>
              Leva menos de um minuto.
            </Text>
          </div>

          {mensagem && (
            <Alert color="red" icon={<IconAlertCircle size={18} />}>
              {mensagem}
            </Alert>
          )}

          <TextInput
            label="Nome"
            placeholder="Seu nome completo"
            autoComplete="name"
            size="md"
            value={valores.nome ?? ""}
            onChange={(e) => mudar("nome", e.currentTarget.value)}
            error={erros.nome}
          />
          <TextInput
            label="E-mail"
            placeholder="voce@exemplo.com"
            type="email"
            autoComplete="email"
            size="md"
            value={valores.email ?? ""}
            onChange={(e) => mudar("email", e.currentTarget.value)}
            error={erros.email}
          />
          <PasswordInput
            label="Senha"
            placeholder="Mínimo de 6 caracteres"
            autoComplete="new-password"
            size="md"
            value={valores.senha ?? ""}
            onChange={(e) => mudar("senha", e.currentTarget.value)}
            error={erros.senha}
          />

          <Button type="submit" size="md" loading={enviando} fullWidth>
            Criar conta
          </Button>

          <Text ta="center" c="dimmed" fz="sm">
            Já tem conta?{" "}
            <Anchor component={Link} to="/login" fw={600}>
              Entrar
            </Anchor>
          </Text>
        </Stack>
      </form>
    </AuthLayout>
  );
}
