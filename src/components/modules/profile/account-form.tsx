"use client";

import { updateProfileAction } from "@/actions/profile.actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { useForm } from "@tanstack/react-form";
import { UserCog } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateProfileSchema } from "./profile.schemas";

type AccountFormProps = {
  profile: {
    name: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    image?: string | null;
  };
};

export function AccountForm({ profile }: AccountFormProps) {
  const router = useRouter();

  const profileForm = useForm({
    defaultValues: {
      name: profile.name ?? "",
      phone: profile.phone ?? "",
      address: profile.address ?? "",
      image: profile.image ?? "",
    },
    onSubmit: async ({ value }) => {
      const parsed = updateProfileSchema.safeParse({
        name: value.name,
        phone: value.phone?.trim() || undefined,
        address: value.address?.trim() || undefined,
        image: value.image?.trim() || undefined,
      });

      if (!parsed.success) {
        toast.error(parsed.error.issues[0]?.message ?? "Invalid profile data");
        return;
      }

      const toastId = toast.loading("Updating profile...");
      const result = await updateProfileAction(parsed.data);

      if (!result.success) {
        toast.error(result.message, { id: toastId });
        return;
      }

      toast.success(result.message, { id: toastId });
      router.refresh();
    },
  });

  return (
    <Card className="border-emerald-100 dark:border-emerald-900/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCog className="size-5 text-emerald-700" />
          Account Information
        </CardTitle>
        <CardDescription>
          Keep your account details updated. Use Save Changes after editing.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            profileForm.handleSubmit();
          }}
        >
          <FieldGroup className="grid gap-4 md:grid-cols-2">
            <profileForm.Field name="name">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                  {!field.state.meta.isValid && field.state.meta.isTouched ? (
                    <FieldError errors={field.state.meta.errors} />
                  ) : null}
                </Field>
              )}
            </profileForm.Field>

            <profileForm.Field name="phone">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="017xxxxxxxx"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                </Field>
              )}
            </profileForm.Field>

            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input value={profile.email} disabled />
            </Field>

            <profileForm.Field name="address">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="Your full address"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                </Field>
              )}
            </profileForm.Field>

            <profileForm.Field name="image">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Profile Image URL (Optional)
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="https://example.com/profile.jpg"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                </Field>
              )}
            </profileForm.Field>
          </FieldGroup>

          <Button type="submit" className="bg-emerald-700 hover:bg-emerald-800">
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
