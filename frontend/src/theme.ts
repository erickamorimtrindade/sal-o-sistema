import { createTheme, type MantineColorsTuple } from "@mantine/core";

// Verde-azulado "pinho": cor principal do sistema (botões, links, item ativo do menu).
const pinho: MantineColorsTuple = [
  "#eef7f6",
  "#d9ecea",
  "#b3d8d4",
  "#89c2bc",
  "#64afa7",
  "#4a9f96",
  "#2f857c",
  "#1f6f68",
  "#195a55",
  "#134642",
];

const fonte = "Figtree, system-ui, -apple-system, 'Segoe UI', sans-serif";

export const tema = createTheme({
  primaryColor: "pinho",
  primaryShade: 7,
  colors: { pinho },
  fontFamily: fonte,
  headings: { fontFamily: fonte, fontWeight: "650" },
  defaultRadius: "md",
  components: {
    Button: { defaultProps: { fw: 600 } },
    Modal: { styles: { title: { fontWeight: 650, fontSize: 18 } } },
  },
});
