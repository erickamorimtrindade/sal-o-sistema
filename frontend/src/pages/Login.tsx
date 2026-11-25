import { Alert, Anchor, Button, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { loginSchema, type LoginInput } from "@salao/shared";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { AuthLayout } from "../components/AuthLayout";
import { useFormZod } from "../hooks/useFormZod";
import { authApi, lerErroApi } from "../services/api";

export default function Login() {
  const { valores, erros, setErros, mudar, validar } = useFormZod<LoginInput>(loginSchema, { email: "", senha: "" });
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const { entrar } = useAuth();
  const navegar = useNavigate();

  const aoEnviar = async (e: FormEvent) => {
    e.preventDefault();
    setMensagem(null);

    const dados = validar(); // 1) confere os campos com o schema do shared, antes de chamar a API
    if (!dados) return;

    setEnviando(true);
    try {
      const usuario = await authApi.login(dados); // 2) envia para a API (Axios)
      entrar(usuario);
      navegar("/");
    } catch (erro) {
      const { mensagem: texto, campos } = lerErroApi(erro); // 3) mostra o que a API respondeu
      setErros(campos);
      setMensagem(texto);
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
              Entrar
            </Title>
            <Text c="dimmed" mt={6}>
              Use seu e-mail e sua senha para abrir a agenda.
            </Text>
          </div>

          {mensagem && (
            <Alert color="red" icon={<IconAlertCircle size={18} />}>
              {mensagem}
            </Alert>
          )}

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
            placeholder="Sua senha"
            autoComplete="current-password"
            size="md"
            value={valores.senha ?? ""}
            onChange={(e) => mudar("senha", e.currentTarget.value)}
            error={erros.senha}
          />

          <Button type="submit" size="md" loading={enviando} fullWidth>
            Entrar
          </Button>

          <Text ta="center" c="dimmed" fz="sm">
            Ainda não tem conta?{" "}
            <Anchor component={Link} to="/cadastro" fw={600}>
              Criar conta
            </Anchor>
          </Text>
        </Stack>
      </form>
    </AuthLayout>
  );
}
