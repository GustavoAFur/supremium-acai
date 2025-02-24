"use client";

import { CalendarDateRangePicker } from "@/app/_components/date-range-picker";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { RecentSales } from "../_components/recent-sales";
import { Overview } from "../_components/overview";
import Image from "next/image";
import { ChevronRight, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteCookie, setCookie } from "cookies-next/client";

import { useEffect, useState } from "react";
import { db } from "@/utils/firebaseConfig";
import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import Link from "next/link";
import OpenCashRegister from "../_components/open-cash-register";

import { CashRegister } from "./cashflow/page";

export default function Page() {
  const [registerToken, setRegisterToken] = useState<string | undefined>(
    undefined
  );
  const [isOpen, setIsOpen] = useState(false);
  const [cash, setCash] = useState(0);

  // Verifica se há um caixa aberto no Firestore e atualiza o token
  useEffect(() => {
    if (registerToken) return;

    const q = query(
      collection(db, "cashRegister"),
      where("status", "==", "aberto"),
      limit(1)
    );

    // Listener em tempo real
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          const data = doc.data() as CashRegister;
          const id = doc.id;

          setCash(data.cashFund); // Atualiza o caixa atual
          setCookie("idCashRegister", id); // Define o ID no cookie
          setRegisterToken(id); // Atualiza o estado local
        } else {
          // Caso nenhum caixa esteja aberto
          deleteCookie("idCashRegister");
          setRegisterToken(undefined);
          setIsOpen(true); // Abre o modal para criar um novo caixa
        }
      },
      (error) => {
        console.error("Erro ao monitorar o caixa aberto:", error);
      }
    );

    // Limpeza do listener quando o componente é desmontado
    return () => unsubscribe();
  }, [registerToken]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 space-y-4 p-8 pt-12 flex flex-col h-full justify-between">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

          <div className="flex items-center space-x-2">
            <CalendarDateRangePicker />
            <Button>
              <Search className="size-4" />
              Buscar
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsContent value="overview" className="space-y-4">
            <div className="grid h-32 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-[#FDF4FF] group hover: cursor-pointer">
                <CardContent className="bg-[#FDF4FF] h-full flex relative flex-row items-center justify-between space-y-0">
                  <Image
                    src={"/image-bannerq.png"}
                    className="absolute right-5 -top-6 "
                    width={132}
                    height={132}
                    alt="Icon"
                  />

                  <Link href="/dashboard/products/edit/JYgF5Jz1OfEMwHluoNrl">
                    <div className="text-2xl font-semibold tracking-tight text-[#7E2D7A]">
                      Dados de açaí
                    </div>
                    <div className="flex mt-2 items-center space-x-1">
                      <p className="text-sm text-[#BB9ABA]">
                        Alterar valores de açaí
                      </p>

                      <ChevronRight
                        color="#BB9ABA"
                        size={16}
                        className="transition-transform transform group-hover:translate-x-1"
                      />
                    </div>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-[#FFF0F0] rounded-sm group hover: cursor-pointer">
                <CardContent className="bg-[#FFF0F0] rounded-sm h-full flex relative flex-row items-center justify-between space-y-0">
                  <Image
                    src={"/image-sorvete.png"}
                    className="absolute right-5 -top-6 "
                    width={132}
                    height={132}
                    alt="Icon"
                  />

                  <Link href="/dashboard/products/edit/8bkNaGQ37bmIMvJyji6V">
                    <div className="text-2xl font-semibold tracking-tight text-[#A83856]">
                      Dados de sorvete
                    </div>
                    <div className="flex mt-2 items-center space-x-1">
                      <p className="text-sm text-[#B36177]">
                        Alterar valores de sorvete
                      </p>

                      <ChevronRight
                        color="#B36177"
                        size={16}
                        className="transition-transform transform group-hover:translate-x-1"
                      />
                    </div>
                  </Link>
                </CardContent>
              </Card>
              <Card
                onClick={() => {
                  if (registerToken === undefined) {
                    setIsOpen(true);
                  }
                }}
                className={` ${
                  registerToken === undefined
                    ? " border-[#FF8282] bg-[#FFEFEF]"
                    : "border-[#0ECF93] bg-[#F7FFFD] hover:bg-[#F1FFFB]"
                } rounded-sm group h-32 transition
               duration-300 ease-in-out transform cursor-pointer`}
              >
                {registerToken === undefined ? (
                  <div>
                    <CardContent className="flex p-8 flex-col items-center justify-between">
                      <div className="text-3xl text-[#DF3030] font-bold">
                        Caixa fechado
                      </div>
                      <p className="text-sm mt-3 text-[#DF3030]">
                        Clique para abrir o caixa.
                      </p>
                    </CardContent>
                  </div>
                ) : (
                  <div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm text-[#007C56] font-medium">
                        <Badge
                          variant="secondary"
                          className="bg-[#00A874] text-white font-regular hover:bg-[#00A874] hover:text-white"
                        >
                          Caixa aberto
                        </Badge>
                      </CardTitle>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-[#007C56]"
                      >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl text-[#007C56] font-bold">
                        {Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(cash)}
                        <span className="text-xs">(Fundo de caixa)</span>
                      </div>
                    </CardContent>
                  </div>
                )}
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                  <CardDescription>
                    Todo o seu faturamento do ano
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Vendas recentes</CardTitle>
                  <CardDescription>
                    Veja os ultimos pedidos finalizados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div>

            <div className="h-44 bg-[#FFFEF8] border-[#FFFCED] relative w-full border-2 rounded-sm flex items-center">
              <Image src="/suport.svg" width={360} height={240} alt="App" />

              <div className="ml-12 flex flex-row h-full items-center justify-center gap-12">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    Acesse nosso canal de suporte
                  </h2>
                  <p className="text-muted-foreground">
                    Acesse nosso canal de suporte para tirar suas duvidas!
                  </p>
                </div>

                <Button
                  size={"lg"}
                  className="btn btn-primary font-semibold mt-4 bg-[#FFBD4F] px-6 py-7 rounded-sm"
                >
                  Acessar suporte
                </Button>
              </div>

              <Image
                src="/love-emoji.svg"
                width={83}
                height={80}
                alt="App"
                className="absolute right-40 top-24"
              />

              <Button className="absolute right-4 top-4 btn btn-primary font-semibold bg-[#FFF4E1] p-4 rounded-md">
                <X color="#FFBD4F" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Abrir Caixa</DialogTitle>
              <DialogDescription>
                Abra um caixa para criar pedidos!
              </DialogDescription>
            </DialogHeader>

            <OpenCashRegister
              closeDialog={() => {
                setIsOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-row mt-3 justify-between p-8  border-t border-[#f1f3f5]">
        <div>
          <p className="font-medium text-xs tracking-tight text-[#8b90a0]">
            {process.env.NEXT_PUBLIC_VERSION}
          </p>
        </div>
        <div>
          <p className="font-regular text-xs tracking-tight text-[#8b90a0]">
            Desenvolvido por
          </p>

          <Image
            src="/logo-witag.png"
            width={92}
            height={32}
            alt="Logo Witag"
            className="opacity-50"
          />
        </div>
      </div>
    </div>
  );
}
