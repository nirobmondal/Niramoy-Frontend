"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-clinet";
import { useForm } from "@tanstack/react-form";
import { ArrowRight, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import * as z from "zod";
import { env } from "../../../env";

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Minimum length is 8"),
});

export function LoginForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawNextPath = searchParams.get("next");

  function getSafeNextPath(rawNextPath: string | null) {
    if (!rawNextPath) {
      return null;
    }

    if (!rawNextPath.startsWith("/") || rawNextPath.startsWith("//")) {
      return null;
    }

    return rawNextPath;
  }

  const handleGoogleLogin = async () => {
    toast.loading("Redirecting to Google...");

    await authClient.signIn.social({
      provider: "google",
      callbackURL: env.NEXT_PUBLIC_APP_URL,
    });
  };

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Logging in...");
      try {
        const { error } = await authClient.signIn.email(value);

        if (error) {
          toast.error(error.message, { id: toastId });
          return;
        }

        toast.success("User Logged in Successfully", { id: toastId });
        const nextPath = getSafeNextPath(rawNextPath);
        router.push(nextPath ?? "/dashboard");
        router.refresh();
      } catch {
        toast.error("Something went wrong, please try again.", { id: toastId });
      }
    },
  });

  return (
    <Card
      {...props}
      className="border border-border rounded-none rounded-sm bg-card shadow-lg pt-10"
    >
      <CardHeader className="space-y-2 pb-3">
        <CardTitle className="text-3xl font-bold text-center">
          Login to your account
        </CardTitle>
        <CardDescription className="text-lg text-center">
          Enter your credentials to continue to your dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="login-form"
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field name="email">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="email"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        className="h-10 pl-9"
                        autoComplete="email"
                        placeholder="you@example.com"
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="password">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="password"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        className="h-10 pl-9"
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col justify-end gap-3 border-t bg-muted/30">
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              form="login-form"
              type="submit"
              className="h-10 w-full bg-primary text-primary-foreground hover:opacity-95"
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
              {!isSubmitting && <ArrowRight className="size-4" />}
            </Button>
          )}
        </form.Subscribe>
        <Button
          onClick={() => handleGoogleLogin()}
          variant="outline"
          type="button"
          className="h-10 w-full"
        >
          Continue with Google
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href={
              rawNextPath
                ? `/register?next=${encodeURIComponent(rawNextPath)}`
                : "/register"
            }
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
