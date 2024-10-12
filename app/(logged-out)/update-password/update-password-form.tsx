"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { passwordMatchSchema } from "@/validation/passwordMatch";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { updatePasswordToken } from "@/actions/update-password-token";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

type PasswordMatchType = z.infer<typeof passwordMatchSchema>;

function UpdatePasswordForm() {
  const searchParams = useSearchParams();
  const form = useForm<PasswordMatchType>({
    resolver: zodResolver(passwordMatchSchema),
  });

  const handleSubmit = async (data: PasswordMatchType) => {
    // TODO : reset password
    const token = searchParams.get("token");

    if (!token) {
      return toast({ title: "No token provided" });
    }

    const response = await updatePasswordToken({ ...data, token });
    if (response?.error) {
      return toast({
        title: "Error in resetting the password",
        description: response.message,
      });
    }
  };

  return (
    <>
      {form.formState.isSubmitSuccessful ? (
        <div className="text-muted-foreground">
          Your password has been updated, you can login to your account via this
          link{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Password :</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Confirm password :</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Confirm password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <Button>Update password</Button>
          </form>
        </Form>
      )}
    </>
  );
}

export default UpdatePasswordForm;
