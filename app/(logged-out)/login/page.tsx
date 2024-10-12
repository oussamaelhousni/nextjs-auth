"use client";
import { login } from "@/actions/login";
import { preLoginCheck } from "@/actions/pre-login-check";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
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
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const form = useForm<LoginSchemaType>({ resolver: zodResolver(loginSchema) });

  const router = useRouter();

  const handleSubmit = async ({ email, password }: LoginSchemaType) => {
    const preLoginCheckResponse = await preLoginCheck({ email, password });

    if (preLoginCheckResponse?.error) {
      form.setError("email", { message: preLoginCheckResponse?.message });
      form.setError("password", { message: preLoginCheckResponse?.message });

      return;
    }

    if (!preLoginCheckResponse.twoFactorActivated) {
      const response = await login({ email, password });

      if (response?.error) {
        form.setError("email", { message: response?.message });
        form.setError("password", { message: response?.message });
        return;
      }
      router.push("/my-account");
      return;
    }
    setStep(2);
  };

  const handleOtpSubmit = async (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    const response = await login({
      email: form.getValues("email"),
      password: form.getValues("password"),
      token: otp,
    });

    if (response?.error) {
      toast({ title: "Ivalid Otp", variant: "destructive" });
      return;
    }
    router.push("/my-account");
  };
  return (
    <>
      {step === 1 && (
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Login to your account</CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <fieldset
                  className="flex flex-col gap-3"
                  disabled={form.formState.isSubmitting}
                >
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
              <Link
                href={`/reset-password?email=${form.getValues("email") || ""}`}
                className="underline"
              >
                Reset my password
              </Link>
            </div>
          </CardFooter>
        </Card>
      )}

      {step === 2 && (
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>One-time passcode</CardTitle>
            <CardDescription>
              Enter your one time pass code in order to login
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="flex flex-col gap-4" onSubmit={handleOtpSubmit}>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  className="mx-auto w-full"
                  value={otp}
                  onChange={setOtp}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button>Verify otp</Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
}

export default Login;
