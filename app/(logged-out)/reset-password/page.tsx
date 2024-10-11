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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const resetPasswordSchema = z.object({ email: z.string().email() });

type ResetPasswordType = z.infer<typeof resetPasswordSchema>;

function ResetPassword({}) {
  const searchParams = useSearchParams();
  const form = useForm<ResetPasswordType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: searchParams.get("email") || "",
    },
  });
  return (
    <>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            Enter your email address to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form>
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
    </>
  );
}

export default ResetPassword;
