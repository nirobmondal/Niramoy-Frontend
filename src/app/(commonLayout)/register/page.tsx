import { RegistrationForm } from "@/components/modules/authentication/register-form"

export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-lime-100/70 px-4 py-8 dark:from-slate-950 dark:via-zinc-900 dark:to-amber-950/40 md:p-10">
      <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-orange-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-lime-300/20 blur-3xl" />
      <div className="relative w-full max-w-md">
        <RegistrationForm />
      </div>
    </div>
  )
}
