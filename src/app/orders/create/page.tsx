"use client";

import GridContent from "@/app/_components/grid-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { ArrowRight, Trash, Trash2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const CreateOrder = () => {
  const [qtd, setQtd] = useState("");
  const [code, setCode] = useState("");

  const [products, setProducts] = useState<Product[]>([
    {
      id: "saysuaysjasjh",
      name: "Açaí fit",
      price: 2,
      quantity: 3,
    },
  ]);

  return (
    <GridContent>
      <h1>Create order</h1>
      <div className="flex flex-auto w-full gap-4">
        <Card className="mt-4 min-w-[400px]">
          <CardHeader>
            <CardTitle>Produto</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="flex gap-4">
                <Input
                  value={qtd}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Permitir apenas números decimais válidos
                    if (/^\d*\.?\d*$/.test(value)) setQtd(value);
                  }}
                  placeholder="Quantidade"
                  className="w-24"
                />
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Código"
                />
              </div>
              <div className="flex gap-4">
                <Label htmlFor="value">Valor:</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Table className="min-w-[500px]">
          <TableCaption>Lista de produtos</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell className="text-center">
                  <Trash2 />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </GridContent>
  );
};

export default CreateOrder;
