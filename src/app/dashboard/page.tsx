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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecentSales } from "../_components/recent-sales";
import { Overview } from "../_components/overview";
import Image from "next/image";
import { ChevronRight, X } from "lucide-react";
import { useState } from "react";

export default function Page() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-12 flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

          <div className="flex items-center space-x-2">
            <CalendarDateRangePicker />
            <Button>Download</Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Análise</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid h-32 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-[#FDF4FF] group">
                <CardContent className="bg-[#FDF4FF] h-full flex relative flex-row items-center justify-between space-y-0">
                  <Image
                    src={"/image-bannerq.png"}
                    className="absolute right-5 -top-6 "
                    width={132}
                    height={132}
                    alt="Icon"
                  />

                  <div className="">
                    <div className="text-2xl font-semibold tracking-tight text-[#7E2D7A]">
                      Pedidos de açaí
                    </div>
                    <div className="flex mt-2 items-center space-x-1">
                      <p className="text-sm text-muted-foreground text-[#BB9ABA]">
                        Clique para ver detalhes
                      </p>

                      <ChevronRight
                        color="#BB9ABA"
                        size={16}
                        className="transition-transform transform group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#FFE7E7] rounded-sm group">
                <CardContent className="bg-[#FFE7E7] rounded-sm h-full flex relative flex-row items-center justify-between space-y-0">
                  <Image
                    src={"/image-bannerq.png"}
                    className="absolute right-5 -top-6 "
                    width={132}
                    height={132}
                    alt="Icon"
                  />

                  <div className="">
                    <div className="text-2xl font-semibold tracking-tight text-[#A83856]">
                      Pedidos de sorvete
                    </div>
                    <div className="flex mt-2 items-center space-x-1">
                      <p className="text-sm text-muted-foreground text-[#B36177]">
                        Clique para ver detalhes
                      </p>

                      <ChevronRight
                        color="#B36177"
                        size={16}
                        className="transition-transform transform group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="h-44 bg-[#FFFEF8] border-[#FFFCED] relative w-full border-2 rounded-sm flex items-center">
        <Image src="/suport.svg" width={360} height={240} alt="App" />

        <div className="ml-12 flex flex-row h-full items-center justify-center gap-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Acesse nosso canal de suporte
            </h2>
            <p className="text-muted-foreground">
              Acesse nosso canal de suporte para tirar suas duvidas!
            </p>
          </div>

          <button className="btn btn-primary font-semibold mt-4 bg-[#FFBD4F] px-6 py-4 rounded-sm">
            Acessar suporte
          </button>
        </div>

        <Image
          src="/love-emoji.svg"
          width={83}
          height={80}
          alt="App"
          className="absolute right-40 top-24"
        />

        <button className="absolute right-4 top-4 btn btn-primary font-semibold bg-[#FFF4E1] p-4 rounded-md">
          <X color="#FFBD4F" />
        </button>
      </div>
    </div>
  );
}
