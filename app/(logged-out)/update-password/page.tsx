import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import db from "@/db/drizzle";
import { passwordResetTokens } from "@/db/passwordResetTokensSchema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import React from "react";
import UpdatePasswordForm from "./update-password-form";

async function UpdatePassword({
  searchParams: { token },
}: {
  searchParams: { token?: string };
}) {
  let isTokenValid = false;
  if (token) {
    const [passwordResetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token));
    if (
      !!passwordResetToken?.expiredAt &&
      passwordResetToken.expiredAt.getTime() > Date.now()
    ) {
      isTokenValid = true;
    }
  }
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          {isTokenValid ? "Update password" : "Reset password link is invalid"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isTokenValid ? (
          <UpdatePasswordForm />
        ) : (
          <div className="text-muted-foreground">
            Reset link is broken or expired, please reset your password{" "}
            <Link href="/reset-password" className="underline">
              Reset password
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default UpdatePassword;
