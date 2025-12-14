import { createTheme, ActionIcon, Button, Loader } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "red",
  defaultRadius: "md",
  colors: {
    // Custom "blackish/grey" background logic is handled by CSS variables
    // or by overriding 'dark' array if you want specific shades.
    // For now, Mantine's default dark colors (#2C2E33 etc) work well,
    // but here is a darker override if you strictly want "blackish":
    dark: [
      "#C1C2C5",
      "#A6A7AB",
      "#909296",
      "#5C5F66",
      "#373A40",
      "#2C2E33",
      "#25262B", // 6: Standard background
      "#1A1B1E", // 7: Darker background
      "#141517",
      "#101113",
    ],
  },
  // Optional: Make components default to using these colors
  components: {
    // Simpler way to set defaults without .extend() if it's causing issues
    Button: {
      defaultProps: { color: "red", variant: "filled" },
    },
    ActionIcon: {
      defaultProps: { color: "red", variant: "subtle" },
    },
    Loader: {
      defaultProps: { color: "red" },
    },
  },
});
