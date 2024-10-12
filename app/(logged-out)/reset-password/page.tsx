"use client";
import { resetPassword } from "@/actions/reset-password";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const resetPasswordSchema = z.object({ email: z.string().email() });

type ResetPasswordType = z.infer<typeof resetPasswordSchema>;

function ResetPassword() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const form = useForm<ResetPasswordType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: searchParams.get("email") || "",
    },
  });

  const handleSubmit = async (data: ResetPasswordType) => {
    const response = await resetPassword(data);
    if (response?.error) {
      form.setError("root", { message: response.message });
      return toast({
        title: "Can't reset password",
        description: response.message,
        variant: "destructive",
      });
    }
  };
  return (
    <>
      {form.formState.isSubmitSuccessful ? (
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Email sent</CardTitle>
          </CardHeader>
          <CardContent>
            If you have an account with us you will recieve an email at :{" "}
            <span className="text-muted-foreground">
              {form.getValues("email")}
            </span>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription>
              Enter your email address to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <fieldset
                  disabled={form.formState.isSubmitting}
                  className="flex flex-col gap-4"
                >
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <Button>Reset password</Button>
                </fieldset>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <div className="text-muted-foreground text-sm">
              Remember your password{"  "}
              <Link href="/login" className="underline">
                Login
              </Link>
            </div>

            <div className="text-muted-foreground text-sm">
              You don't have an account{"  "}
              <Link href="/register" className="underline">
                Register
              </Link>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
}

export default ResetPassword;
