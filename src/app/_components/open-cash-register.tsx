"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/utils/firebaseConfig";
import { setCookie } from "cookies-next/client";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";

type OpenCashRegisterProps = {
  closeDialog: () => void;
};

const OpenCashRegister = ({ closeDialog }: OpenCashRegisterProps) => {
  const [cashFund, setCashFund] = useState("");

  const handleAction = () => {
    // Fecha o diálogo
    closeDialog();
  };

  const hendleOpenCashRegister = async () => {
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
    } catch (error) {
      console.log(error);
      alert("Erro ao abrir o caixa");
    } finally {
      handleAction();
    }
  };

  return (
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
      <Button onClick={hendleOpenCashRegister}>Abrir</Button>
    </div>
  );
};

export default OpenCashRegister;
