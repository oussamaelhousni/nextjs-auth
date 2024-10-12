import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import React from "react";
import TwoFactorAuthForm from "./two-factor-auth-form";
import { users } from "@/db/usersSchema";
import { eq } from "drizzle-orm";
import db from "@/db/drizzle";

async function MyAccount() {
  const session = await auth();

  const [user] = await db
    .select({ twoFactorActivated: users.twofactorActivated })
    .from(users)
    .where(eq(users.id, parseInt(session?.user?.id!)));

  return (
    <div className="flex-1 flex items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>My account</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <span>Email :</span>
            <span className="text-muted-foreground">
              {session?.user?.email}
            </span>
          </div>

          <TwoFactorAuthForm twoFactorActivated={!!user.twoFactorActivated} />
        </CardContent>
      </Card>
    </div>
  );
}

export default MyAccount;
