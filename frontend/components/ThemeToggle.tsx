"use client";

import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { useEffect } from "react";

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <ActionIcon
      onClick={() => toggleColorScheme()}
      variant="default"
      size="lg"
      aria-label="Toggle color scheme"
      className="bg-transparent border-zinc-800 text-zinc-400 hover:text-white"
    >
      {isDark ? "☀️" : "🌙"}
    </ActionIcon>
  );
}
