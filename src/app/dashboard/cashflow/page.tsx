"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import OpenCashRegister from "@/app/_components/open-cash-register";
import { deleteCookie, getCookie } from "cookies-next/client";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebaseConfig";

export interface CashRegister {
  id: string;
  status: string;
  openingDate: string;
  closingDate: string | null;
  totalCash: number;
  totalCard: number;
  totalPix: number;
  cashFund: number;
  totalTransshipment: number;
  totalSales: number;
}

export default function CashFlow() {
  const [isOpen, setIsOpen] = useState(false);
  const [registerToken, setRegisterToken] = useState<string | undefined>(
    undefined
  );

  const [cashRegister, setCashRegister] = useState<CashRegister>();

  /**
   * const chartData = [
    { month: "Janeiro", desktop: 186, mobile: 80 },
    { month: "Fervereiro", desktop: 305, mobile: 200 },
    { month: "Março", desktop: 237, mobile: 120 },
    { month: "Abril", desktop: 73, mobile: 190 },
    { month: "Maio", desktop: 209, mobile: 130 },
    { month: "Junho", desktop: 214, mobile: 140 },
    { month: "Julho", desktop: 186, mobile: 80 },
    { month: "Agosto", desktop: 305, mobile: 200 },
    { month: "Setembro", desktop: 237, mobile: 120 },
    { month: "Outubro", desktop: 73, mobile: 190 },
    { month: "Novembro", desktop: 209, mobile: 130 },
    { month: "Dezembro", desktop: 214, mobile: 140 },
  ];
      const chartConfig = {
    desktop: {
      label: "Açaí",
      color: "#89159E",
    },
    mobile: {
      label: "Soverte",
      color: "#EDD7F1",
    },
  } satisfies ChartConfig;
   * 
   * 
   */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokenCashRegister = getCookie("idCashRegister") as string | null;
        setRegisterToken(tokenCashRegister as string);

        if (tokenCashRegister) {
          const registerRef = doc(db, "cashRegister", tokenCashRegister);

          // Listener em tempo real
          const unsubscribe = onSnapshot(registerRef, (registerDoc) => {
            if (registerDoc.exists()) {
              setCashRegister({
                id: registerDoc.id,
                ...registerDoc.data(),
              } as CashRegister);
              setRegisterToken(registerDoc.id);
            } else {
              console.error("Documento do caixa não encontrado!");
              deleteCookie("idCashRegister");
              setRegisterToken(undefined);
            }
          });

          // Limpeza do listener quando o componente desmonta
          return () => unsubscribe();
        } else {
          console.warn("Token de caixa não encontrado nos cookies.");
        }
      } catch (error) {
        console.error("Erro ao buscar os dados do caixa:", error);
      }
    };

    fetchData();
  }, [isOpen]);

  function calculateTotal() {
    if (cashRegister) {
      const {
        totalCash = 0,
        totalCard = 0,
        totalPix = 0,
        cashFund = 0,
      } = cashRegister;

      const total =
        Number(totalCash) +
        Number(totalCard) +
        Number(totalPix) +
        Number(cashFund);

      return total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    }
    return "R$00,00";
  }

  const handleOpenCloseCashRegister = async () => {
    try {
      if (registerToken) {
        const docRef = doc(db, "cashRegister", registerToken);
        await updateDoc(docRef, {
          status: "fechado",
          closingDate: new Date(),
        });
        deleteCookie("idCashRegister");
        setRegisterToken(undefined);
      } else {
        setIsOpen(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-12">
      <div className="flex h-12 items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Caixa</h2>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vendas</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-primary"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  +{cashRegister?.totalSales}
                </div>
                <p className="text-xs text-muted-foreground">
                  +100% do mês passado (sem dados para calcular)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dinheiro</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-primary"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(
                    parseFloat(cashRegister?.totalCash?.toString() ?? "0")
                  )}
                </div>
                <p className="text-xs mt-2 text-muted-foreground">
                  +100% do mês passado (sem dados para calcular)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cartao</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-primary"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(
                    parseFloat(cashRegister?.totalCard?.toString() ?? "0")
                  )}
                </div>
                <p className="text-xs mt-2 text-muted-foreground">
                  +100% do mês passado (sem dados para calcular)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pix</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-primary"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(
                    parseFloat(cashRegister?.totalPix?.toString() ?? "0")
                  )}
                </div>
                <p className="text-xs mt-2 text-muted-foreground">
                  +100% do mês passado (sem dados para calcular)
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="h-48 bg-[#FFFEF8] border-[#FFFCED] relative col-span-4 border-2 rounded-sm flex items-center">
              <Image src="/suport.svg" width={360} height={240} alt="App" />

              <div className="ml-4 flex flex-row h-full items-center justify-center gap-12">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight leading-7">
                    Clique nos cards abaixo.
                  </h2>
                  <p className="text-muted-foreground font-normal mt-2 text-sm w-[80%]">
                    Visualize o fluxo de caixa, vendas e muito mais. Para ter
                    mais informações, clique nos cards abaixo.
                  </p>
                </div>
              </div>

              <Image
                src="/love-emoji.svg"
                width={83}
                height={80}
                alt="App"
                className="absolute right-20 bottom-0"
              />
            </div>

            <Card
              className={`${
                registerToken
                  ? "border-[#0ECF93] bg-[#F7FFFD] hover:bg-[#F1FFFB]"
                  : "border-[#FF8282] bg-[#FFEFEF] hover:bg-[#FFE7E7]"
              }  rounded-sm col-span-2 group  bg-cover bg-center bg-no-repeat  transition duration-300 ease-in-out transform cursor-pointer`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle
                  className="text-[#007C56]
                  text-sm  font-medium"
                >
                  <Badge
                    variant="secondary"
                    className={`${
                      registerToken
                        ? "bg-[#00A874] hover:bg-[#00A874]"
                        : "bg-[#DF3030] hover:bg-[#DF3030]"
                    } text-white font-regular  hover:text-white`}
                  >
                    {registerToken ? "Caixa aberto" : "Caixa fechado"}
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
                {registerToken ? (
                  <div className="text-3xl text-[#007C56] font-bold">
                    {calculateTotal()}
                  </div>
                ) : (
                  <div className="text-3xl text-[#DF3030] font-bold">
                    R$00,00
                  </div>
                )}

                <p className="text-sm mt-2 text-[#396e5f]">
                  Clique para saber mais, visualize a lista de vendas.
                </p>
              </CardContent>
            </Card>

            {/* <Card className="border-[#0ECF93]  rounded-sm col-span-1 group bg-[#F7FFFD] bg-cover bg-center bg-no-repeat hover:bg-[#F1FFFB] transition duration-300 ease-in-out transform cursor-pointer">
              <CardContent className="flex p-8 flex-col items-center justify-between">
                <div className="text-3xl text-[#007C56] font-bold">
                  Fechar Caixa
                </div>
                <p className="text-xs mt-3 text-[#396e5f]">
                  Clique para abrir o caixa.
                </p>
              </CardContent>
            </Card> */}

            <Card
              onClick={handleOpenCloseCashRegister}
              className={`${
                registerToken
                  ? "border-[#FF8282] bg-[#FFEFEF] hover:bg-[#FFE7E7]"
                  : "border-[#0ECF93] bg-[#F7FFFD] hover:bg-[#F1FFFB]"
              }  rounded-sm col-span-1 group  bg-cover bg-center bg-no-repeat  transition duration-300 ease-in-out transform cursor-pointer`}
            >
              {registerToken ? (
                <CardContent className="flex p-8 flex-col items-center justify-between text-[#DF3030]">
                  <div className="text-3xl  font-bold">Fechar Caixa</div>
                  <p className="text-xs mt-3">Clique para fechar o caixa.</p>
                </CardContent>
              ) : (
                <CardContent className="flex p-8 flex-col items-center justify-between text-[#007C56]">
                  <div className="text-3xl font-bold">Abrir Caixa</div>
                  <p className="text-xs mt-3">Clique para abrir o caixa.</p>
                </CardContent>
              )}
            </Card>
          </div>
          {/*
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Bar Chart - Stacked + Legend</CardTitle>
                  <CardDescription>January - June 2024</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                      />
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar
                        dataKey="desktop"
                        stackId="a"
                        fill="var(--color-desktop)"
                        radius={[0, 0, 4, 4]}
                      />
                      <Bar
                        dataKey="mobile"
                        stackId="a"
                        fill="var(--color-mobile)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                  <div className="flex gap-2 font-medium leading-none">
                    Trending up by 5.2% this month{" "}
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="leading-none text-muted-foreground">
                    Showing total visitors for the last 6 months
                  </div>
                </CardFooter>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Vendas recentes</CardTitle>
                  <CardDescription>Você fez 265 vendas este mês.</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div>
            
            
            */}
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
  );
}
