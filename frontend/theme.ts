import { createTheme, ActionIcon, Button, Loader, Progress, Badge } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "crimson",
  defaultRadius: "md",
  colors: {
    crimson: [
      "#FCE4E8", // 0 - lightest
      "#F9CDD5", // 1
      "#F4ABB5", // 2
      "#EE8694", // 3
      "#E86575", // 4
      "#D94B5F", // 5
      "#C43850", // 6
      "#BA0C2F", // 7 - primary (#BA0C2F)
      "#9E0A27", // 8
      "#7A081F", // 9 - darkest
    ],
    dark: [
      "#C1C2C5",
      "#A6A7AB",
      "#909296",
      "#5C5F66",
      "#373A40",
      "#2C2E33",
      "#25262B",
      "#1A1B1E",
      "#141517",
      "#101113",
    ],
  },
  components: {
    Button: {
      defaultProps: { color: "crimson", variant: "filled" },
    },
    ActionIcon: {
      defaultProps: { color: "crimson", variant: "subtle" },
    },
    Loader: {
      defaultProps: { color: "crimson" },
    },
    Progress: {
      defaultProps: { color: "crimson" },
    },
    Badge: {
      defaultProps: { color: "crimson", variant: "light" },
    },
  },
});
