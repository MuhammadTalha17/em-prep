import { Button, PasswordInput, TextInput, Paper, Title } from "@mantine/core";

export default function LoginPage() {
  return (
    <Paper className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-8 rounded-xl shadow-lg">
      <Title
        order={2}
        className="text-center mb-6 text-gray-900 dark:text-white"
      >
        Login to EM Prep
      </Title>

      <form className="space-y-4">
        {/* Mantine inputs handle themselves mostly, but we can style them */}
        <TextInput
          label="Email"
          placeholder="your@email.com"
          required
          classNames={{
            input: "dark:bg-zinc-800 dark:border-zinc-700 dark:text-white",
          }}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          classNames={{
            input: "dark:bg-zinc-800 dark:border-zinc-700 dark:text-white",
          }}
        />

        <Button fullWidth type="submit" color="red" className="mt-4">
          Sign In
        </Button>
      </form>
    </Paper>
  );
}
