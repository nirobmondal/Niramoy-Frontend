import { LoginForm } from "@/components/modules/authentication/login-form";

export default function Page() {
  return (
    <div className="flex w-full items-center justify-center bg-background px-5 py-5 md:p-10">
      <div className="w-full max-w-lg">
        <LoginForm />
      </div>
    </div>
  );
}
