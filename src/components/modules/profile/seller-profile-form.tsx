"use client";

import {
  becomeSellerAction,
  updateSellerProfileAction,
} from "@/actions/profile.actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { becomeSellerSchema, updateSellerSchema } from "./profile.schemas";

type SellerProfileValue = {
  storeName: string;
  storeLogo?: string;
  address: string;
  contactNumber: string;
  openingTime: string;
  closingTime: string;
  offDay: string;
};

type SellerProfileFormProps = {
  mode: "create" | "update";
  title?: string;
  description?: string;
  submitLabel?: string;
  initialValues?: Partial<SellerProfileValue>;
  className?: string;
};

export function SellerProfileForm({
  mode,
  title,
  description,
  submitLabel,
  initialValues,
  className,
}: SellerProfileFormProps) {
  const router = useRouter();

  const sellerForm = useForm({
    defaultValues: {
      storeName: initialValues?.storeName ?? "",
      storeLogo: initialValues?.storeLogo ?? "",
      address: initialValues?.address ?? "",
      contactNumber: initialValues?.contactNumber ?? "",
      openingTime: initialValues?.openingTime ?? "",
      closingTime: initialValues?.closingTime ?? "",
      offDay: initialValues?.offDay ?? "",
    },
    onSubmit: async ({ value }) => {
      const validator =
        mode === "create" ? becomeSellerSchema : updateSellerSchema;
      const parsed = validator.safeParse({
        ...value,
        storeLogo: value.storeLogo?.trim() || undefined,
      });

      if (!parsed.success) {
        toast.error(parsed.error.issues[0]?.message ?? "Invalid seller data");
        return;
      }

      const toastId = toast.loading(
        mode === "create"
          ? "Creating seller profile..."
          : "Updating seller profile...",
      );

      const result =
        mode === "create"
          ? await becomeSellerAction(parsed.data)
          : await updateSellerProfileAction(parsed.data);

      if (!result.success) {
        toast.error(result.message, { id: toastId });
        return;
      }

      toast.success(result.message, { id: toastId });

      if (mode === "create") {
        router.push("/profile");
        return;
      }

      router.refresh();
    },
  });

  return (
    <Card
      className={className ?? "border-emerald-100 dark:border-emerald-900/60"}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="size-5 text-emerald-700" />
          {title ??
            (mode === "create" ? "Create Seller Profile" : "Seller Profile")}
        </CardTitle>
        <CardDescription>
          {description ??
            (mode === "create"
              ? "Provide your store information to become a seller."
              : "Update your store details and business schedule.")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            sellerForm.handleSubmit();
          }}
        >
          <FieldGroup className="grid gap-4 md:grid-cols-2">
            <sellerForm.Field name="storeName">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Store Name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                </Field>
              )}
            </sellerForm.Field>

            <sellerForm.Field name="storeLogo">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Store Logo URL (Optional)
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="https://example.com/store-logo.png"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                </Field>
              )}
            </sellerForm.Field>

            <sellerForm.Field name="contactNumber">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Contact Number</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                </Field>
              )}
            </sellerForm.Field>

            <sellerForm.Field name="openingTime">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Opening Time</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                </Field>
              )}
            </sellerForm.Field>

            <sellerForm.Field name="closingTime">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Closing Time</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                </Field>
              )}
            </sellerForm.Field>

            <sellerForm.Field name="offDay">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Off Day</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                </Field>
              )}
            </sellerForm.Field>

            <sellerForm.Field name="address">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Store Address</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                </Field>
              )}
            </sellerForm.Field>
          </FieldGroup>

          <Button type="submit" className="bg-emerald-700 hover:bg-emerald-800">
            {submitLabel ??
              (mode === "create" ? "Become Seller" : "Save Changes")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
