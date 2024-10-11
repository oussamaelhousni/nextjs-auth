"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";

import React from "react";
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  useForm,
  UseFormStateReturn,
} from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { changePassword as changePasswordAction } from "@/actions/change-password";
import { useToast } from "@/hooks/use-toast";

const changPasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(5, { message: "Password should at least 5 chars" }),
  password: z.string().min(5, { message: "Password should at least 5 chars" }),
  passwordConfirm: z
    .string()
    .min(5, { message: "Password should at least 5 chars" }),
});

type ChangePasswordType = z.infer<typeof changPasswordSchema>;

const ChangePassword = () => {
  const { toast } = useToast();
  const form = useForm<ChangePasswordType>({
    resolver: zodResolver(changPasswordSchema),
    defaultValues: {
      password: "",
      currentPassword: "",
      passwordConfirm: "",
    },
  });

  const handleSubmit = async ({
    currentPassword,
    password,
    passwordConfirm,
  }: ChangePasswordType) => {
    console.log("data", {
      currentPassword,
      password,
      passwordConfirm,
    });

    const response = await changePasswordAction({
      currentPassword,
      password,
      passwordConfirm,
    });

    if (response?.error) {
      return toast({
        description: response.message,
        variant: "destructive",
      });
    }
    form.reset();
    return toast({
      description: "Password changed successfully",
      className: "bg-green-500 text-white",
    });
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Change password</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <fieldset
              disabled={form.formState.isSubmitting}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>current password</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="current Password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>New password</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="New password" />
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
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Confirm password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <Button>Change</Button>
            </fieldset>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ChangePassword;
