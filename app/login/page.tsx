"use client";
import { login } from "@/actions/login";
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
  FormLabel,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(5, { message: "Password should at least 5 characters" }),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

function Login() {
  const form = useForm<LoginSchemaType>({ resolver: zodResolver(loginSchema) });

  const router = useRouter();

  const handleSubmit = async ({ email, password }: LoginSchemaType) => {
    const response = await login({ email, password });

    if (response?.error) {
      form.setError("email", { message: response?.message });
      form.setError("password", { message: response?.message });
      return;
    }

    router.push("/my-account");
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Login to your account</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <fieldset className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Email" />
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
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <Button>Login</Button>
              </fieldset>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <div className="text-muted-foreground text-sm">
            Don't have an account{" "}
            <Link href="/register" className="underline">
              Register
            </Link>
          </div>

          <div className="text-muted-foreground text-sm">
            Forgot password{" "}
            <Link href="/reset-password" className="underline">
              Reset my password
            </Link>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}

export default Login;
