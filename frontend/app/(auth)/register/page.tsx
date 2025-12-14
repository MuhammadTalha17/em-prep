import { Button, PasswordInput, TextInput } from "@mantine/core";
export default function RegisterPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        Create Account
      </h1>
      <form className="space-y-4">
        <TextInput label="Full Name" placeholder="John Doe" required />
        <TextInput label="Email" placeholder="your@email.com" required />
        <PasswordInput
          label="Password"
          placeholder="Create a password"
          required
        />
        <Button fullWidth type="submit" className="mt-4">
          Register
        </Button>
      </form>
    </div>
  );
}
