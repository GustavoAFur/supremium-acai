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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/utils/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Após login bem-sucedido, salve o token no cookie
  const saveTokenToCookies = async (token: string) => {
    setCookie("access_token", token, {
      maxAge: 60 * 60 * 24 * 7, // 7 dias de validade
      path: "/", // Acessível por toda a aplicação
    });
  };

  const hendleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        // Obtenha o token JWT após o login
        const token = await user.getIdToken();

        // Salve o token no cookie
        await saveTokenToCookies(token);

        // Redirecione para o dashboard
        router.push("/dashboard");
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === "auth/wrong-password") {
          alert("Senha incorreta");
        } else if (errorCode === "auth/user-not-found") {
          alert("Usuário não encontrado");
        } else {
          alert(error.message);
        }
      });
  };

  return (
    <div className="flex-1 w-[100vw] h-[100vh] flex items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Faça o login para poder acessar o dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="e-mail">E-mail</Label>
                <Input
                  id="e-mail"
                  placeholder="Seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  placeholder="Senha"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancelar</Button>
          <Button onClick={hendleSignIn}>Entrar</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
