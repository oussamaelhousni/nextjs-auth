"use client";
import { logout } from "@/actions/logout";
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";

function LogoutBtn() {
  return (
    <Button
      onClick={async () => {
        await logout();
      }}
    >
      logout
    </Button>
  );
}

export default LogoutBtn;
