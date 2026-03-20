import { RegistrationForm } from "@/components/modules/authentication/register-form";

export default function Page() {
  return (
    <div className="flex w-full items-center justify-center bg-background px-4 py-8 md:p-10">
      <div className="w-full max-w-lg">
        <RegistrationForm />
      </div>
    </div>
  );
}
