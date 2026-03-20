"use client";

import { placeOrderAction } from "@/actions/orders.actions";
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
import { useRouter } from "next/navigation";
import { BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { checkoutSchema } from "./checkout.schemas";

type CheckoutFormProps = {
  cartTotal: number;
};

export function CheckoutForm({ cartTotal }: CheckoutFormProps) {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      shippingAddress: "",
      shippingCity: "",
      phone: "",
      notes: "",
    },
    validators: {
      onSubmit: checkoutSchema,
    },
    onSubmit: async ({ value }) => {
      const parsed = checkoutSchema.safeParse(value);

      if (!parsed.success) {
        toast.error(parsed.error.issues[0]?.message ?? "Invalid checkout data");
        return;
      }

      const toastId = toast.loading("Placing your order...");
      const result = await placeOrderAction(parsed.data);

      if (!result.success) {
        toast.error(result.message, { id: toastId });
        return;
      }

      toast.success(result.message, { id: toastId });
      router.push("/orders?placed=1");
      router.refresh();
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Details</CardTitle>
        <CardDescription>
          Cash on Delivery only. Total payable: ৳{Number(cartTotal).toFixed(2)}
        </CardDescription>
        <div className="mt-2 inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800 dark:border-emerald-900/70 dark:bg-emerald-900/30 dark:text-emerald-200">
          <BadgeCheck className="size-3.5" />
          Pay on delivery after receiving your order
        </div>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field name="shippingAddress">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Shipping Address</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    placeholder="House, street, area"
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                  {!field.state.meta.isValid && field.state.meta.isTouched ? (
                    <FieldError errors={field.state.meta.errors} />
                  ) : null}
                </Field>
              )}
            </form.Field>

            <form.Field name="shippingCity">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>City</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    placeholder="City"
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                  {!field.state.meta.isValid && field.state.meta.isTouched ? (
                    <FieldError errors={field.state.meta.errors} />
                  ) : null}
                </Field>
              )}
            </form.Field>

            <form.Field name="phone">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="tel"
                    value={field.state.value}
                    placeholder="01XXXXXXXXX"
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                  {!field.state.meta.isValid && field.state.meta.isTouched ? (
                    <FieldError errors={field.state.meta.errors} />
                  ) : null}
                </Field>
              )}
            </form.Field>

            <form.Field name="notes">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Notes (Optional)</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    placeholder="Any delivery instruction"
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                </Field>
              )}
            </form.Field>
          </FieldGroup>

          <form.Subscribe selector={(state) => [state.isSubmitting]}>
            {([isSubmitting]) => (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-700 hover:bg-emerald-800"
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </CardContent>
    </Card>
  );
}
