import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import React from "react";

async function MyAccount() {
  const session = await auth();
  return (
    <div className="flex-1 flex items-center justify-center">
      <Card className="w-[300px]">
        <CardHeader>
          <CardTitle>My account</CardTitle>
        </CardHeader>
        <CardContent>
          <span>Email :</span>
          <span className="text-muted-foreground">{session?.user?.email}</span>
        </CardContent>
      </Card>
    </div>
  );
}

export default MyAccount;
