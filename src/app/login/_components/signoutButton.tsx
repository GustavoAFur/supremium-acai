"use client"; // Adicione essa linha no topo do arquivo para garantir que ele seja um Client Component.

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/utils/firebaseConfig";
import { deleteCookie } from "cookies-next/client";
import { Button } from "@/components/ui/button"; // Importe o botão
import { useState } from "react";
import { LogOutIcon } from "lucide-react";

export default function SignOutButton() {
  const router = useRouter(); // hook que só funciona em Client Component

  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      const userConfirmed = window.confirm("Tem certeza de que deseja sair?");

      if (!userConfirmed) {
        return;
      }

      await signOut(auth);
      deleteCookie("access_token");
      router.push("/login");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant={"ghost"} disabled={isLoading} onClick={handleSignOut}>
      {isLoading ? "Saindo" : "Sair"}
      <LogOutIcon />
    </Button>
  );
}
