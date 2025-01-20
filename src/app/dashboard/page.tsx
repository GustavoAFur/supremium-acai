"use client";
import { Badge } from "@/components/ui/badge";
import { Circle } from "lucide-react";
import Image from "next/image";
import { deleteCookie, getCookie, setCookie } from "cookies-next/client";
import { useEffect, useState } from "react";
import { db } from "@/utils/firebaseConfig";
import {
  collection,
  getDocs,
  limit,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Page() {
  const [registerToken, setRegisterToken] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [cashFund, setCashFund] = useState("");

  // Função para abrir o caixa
  const openCashRegister = async () => {
    try {
      const docRef = collection(db, "cashRegister");
      const document = await addDoc(docRef, {
        status: "aberto",
        openingDate: new Date(),
        closingDate: null,
        totalCash: 0,
        totalCard: 0,
        totalPix: 0,
        cashFund,
        totalTransshipment: 0,
        totalSales: 0,
      });

      setCookie("idCashRegister", document.id);
      setRegisterToken(document.id); // Atualiza o estado local imediatamente
      setIsOpen(false); // Fecha o modal
    } catch (error) {
      alert("Erro ao abrir o caixa");
    }
  };

  // Atualiza o token ao carregar o componente
  useEffect(() => {
    const token = getCookie("idCashRegister");
    setRegisterToken((token as string) || "");
  }, []);

  // Verifica se há um caixa aberto no Firestore e atualiza o token
  useEffect(() => {
    const fetchRegister = async () => {
      if (registerToken) return;

      try {
        const q = query(
          collection(db, "cashRegister"),
          where("status", "==", "aberto"),
          limit(1)
        );
        const registerDoc = await getDocs(q);

        if (!registerDoc.empty) {
          const id = registerDoc.docs[0].id;
          setCookie("idCashRegister", id);
          setRegisterToken(id); // Atualiza o estado local
        } else {
          deleteCookie("idCashRegister");
          setRegisterToken("");
          setIsOpen(true); // Abre o modal para criar um novo caixa
        }
      } catch (error) {
        console.error("Erro ao buscar caixa aberto:", error);
      }
    };

    fetchRegister();
  }, [registerToken]); // Executa quando `registerToken` muda

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <div className="absolute top-4 right-4">
        {registerToken === "" ? (
          <Badge className="relative flex items-center gap-2 bg-red-300 hover:bg-red-300 text-red-700">
            <Circle size={16} className="fill-red-700" />
            <span>Caixa fechado</span>
          </Badge>
        ) : (
          <Badge className="relative flex items-center gap-2 bg-green-300 hover:bg-green-300 text-green-700">
            <Circle size={16} className="fill-green-700" />
            <span>Caixa Aberto</span>
          </Badge>
        )}
      </div>
      <Image
        src={"/logo.png"}
        alt="Logo"
        width={300}
        height={300}
        objectFit="contain"
      />

      {/* Modal para abrir o caixa */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Abrir Caixa</DialogTitle>
            <DialogDescription>
              Abra um caixa para criar pedidos!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="name" className="text-right">
              Fundo de caixa
            </Label>
            <Input
              id="name"
              placeholder="Ex: 30.50"
              value={cashFund}
              className="col-span-3"
              onChange={(e) => {
                const cashFund = e.target.value;
                if (/^\d*\.?\d*$/.test(cashFund)) setCashFund(cashFund);
              }}
            />
          </div>
          <DialogFooter>
            <Button onClick={openCashRegister}>Abrir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
