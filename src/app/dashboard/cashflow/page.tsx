"use client";

import { CalendarDateRangePicker } from "@/app/_components/date-range-picker";
import { Overview } from "@/app/_components/overview";
import { RecentSales } from "@/app/_components/recent-sales";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  XAxis,
} from "recharts";
import { TrendingUp, X } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function CashFlow() {
  const chartData = [
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

  const data = [
    {
      goal: 400,
    },
    {
      goal: 300,
    },
    {
      goal: 200,
    },
    {
      goal: 300,
    },
    {
      goal: 200,
    },
    {
      goal: 278,
    },
    {
      goal: 189,
    },
    {
      goal: 239,
    },
    {
      goal: 300,
    },
    {
      goal: 200,
    },
    {
      goal: 278,
    },
    {
      goal: 189,
    },
    {
      goal: 349,
    },
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

  return (
    <div className="flex-1 space-y-4 p-8 pt-12">
      <div className="flex h-12 items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Caixa</h2>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Rendimento total
                </CardTitle>
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
                  R$45,231.89
                </div>
                <p className="text-xs mt-2 text-muted-foreground">
                  +20.1% do mês passado
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clientes</CardTitle>
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
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">+20</div>
                <p className="text-xs text-muted-foreground">
                  +180.1% do mês passado
                </p>
              </CardContent>
            </Card>

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
                <div className="text-2xl font-bold text-primary">+12</div>
                <p className="text-xs text-muted-foreground">
                  +19% do mês passado
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

            <Card className="border-[#0ECF93]  rounded-sm col-span-2 group bg-[#F7FFFD] bg-cover bg-center bg-no-repeat hover:bg-[#F1FFFB] transition duration-300 ease-in-out transform cursor-pointer">
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
                <div className="text-3xl text-[#007C56] font-bold">
                  R$45,231.89
                </div>
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

            <Card className="border-[#FF8282]  rounded-sm col-span-1 group bg-[#FFEFEF] bg-cover bg-center bg-no-repeat hover:bg-[#FFE7E7] transition duration-300 ease-in-out transform cursor-pointer">
              <CardContent className="flex p-8 flex-col items-center justify-between">
                <div className="text-3xl text-[#DF3030] font-bold">
                  Fechar Caixa
                </div>
                <p className="text-xs mt-3 text-[#DF3030]">
                  Clique para abrir o caixa.
                </p>
              </CardContent>
            </Card>
          </div>

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
        </TabsContent>
      </Tabs>
    </div>
  );
}
