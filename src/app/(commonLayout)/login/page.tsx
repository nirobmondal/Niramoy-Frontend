import { LoginForm } from "@/components/modules/authentication/login-form"

export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-gradient-to-br from-sky-50 via-cyan-50 to-emerald-100/70 px-4 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-teal-950/40 md:p-10">
      <div className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="relative w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}
