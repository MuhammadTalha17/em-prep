"use client";

import { Button, ButtonProps, ElementProps } from "@mantine/core";

interface AppButtonProps
  extends ButtonProps,
    ElementProps<"button", keyof ButtonProps> {
  appVariant?: "user" | "admin";
}

export function AppButton({
  appVariant = "user",
  className,
  children,
  ...props
}: AppButtonProps) {
  return (
    <Button
      color={appVariant === "admin" ? "dark" : "red"}
      variant="filled"
      radius="md"
      className={className}
      styles={{
        root: {
          transition: "all 0.2s",
          "&:active": {
            transform: "scale(0.95)",
          },
        },
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
