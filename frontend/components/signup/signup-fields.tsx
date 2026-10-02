import { Input } from "@/components/auth/input";
import { PasswordInput } from "@/components/auth/password-input";

export function SignupFields() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Input
        id="username"
        label="Username"
        placeholder="user_example"
        autoComplete="username"
        icon="user"
      />
      <Input
        id="signup-email"
        label="Email"
        type="email"
        placeholder="email@example.com"
        autoComplete="email"
        icon="mail"
      />
      <PasswordInput id="signup-password" placeholder="Minimum 8 characters" />
    </div>
  );
}
