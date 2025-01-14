"use client"; // Adicione essa linha no topo do arquivo para garantir que ele seja um Client Component.

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/utils/firebaseConfig";
import { deleteCookie } from "cookies-next";
import { Button } from "@/components/ui/button"; // Importe o botão

export default function SignOutButton() {
  const router = useRouter(); // hook que só funciona em Client Component

  const handleSignOut = async () => {
    // Desconecta o usuário do Firebase
    await signOut(auth);

    // Remove o token do cookie
    deleteCookie("access_token");

    // Redireciona para a página de login
    router.push("/login");
  };

  return <Button onClick={handleSignOut}>Sair</Button>;
}
