"use client";

import GridContent from "@/app/_components/grid-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect, useMemo } from "react";
import { Trash2 } from "lucide-react";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebaseConfig";
import { Button } from "@/components/ui/button";

interface OrderProducts {
  id: string;
  name: string;
  price: string;
  quantity: number;
  total: number;
}

interface Products {
  id: string;
  name: string;
  price: string;
  und: string;
}

const CreateOrder = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [qtd, setQtd] = useState("");
  const [products, setProducts] = useState<Products[]>([]);
  const [orderProducts, setOrderProducts] = useState<OrderProducts[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Products | null>(null);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [complement, setComplement] = useState("");
  const [observation, setObservation] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transshipment, setTransshipment] = useState("");

  const handleRemoveProduct = (index: number) => {
    setOrderProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSelectChange = (productId: string) => {
    const product = products.find((item) => item.id === productId);
    if (product) {
      setSelectedProduct(product);
    }
  };

  const handleAddProduct = () => {
    if (!selectedProduct || !qtd || parseFloat(qtd) <= 0) {
      alert("Selecione um produto e insira uma quantidade válida.");
      return;
    }

    const quantity = parseFloat(qtd);
    const total = quantity * parseFloat(selectedProduct.price);

    const productToAdd = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      quantity,
      total,
    };

    setOrderProducts((prev) => [...prev, productToAdd]);
    setQtd(""); // Limpa a quantidade
  };

  const handleCreateOrder = async () => {
    try {
      const orderRef = collection(db, "orders");
      const orderData = {
        status: "aberto",
        createdAt: new Date(),
        items: orderProducts,
        deliveryInfo: { name, address, complement, observation, phone },
        totalPrice,
      };

      await addDoc(orderRef, orderData).then(() => {
        setIsOpen(false);
        setOrderProducts([]);
        alert("Pedido salvo com sucesso!!");
      });
    } catch (error) {}
  };

  const totalPrice = useMemo(() => {
    return orderProducts.reduce((total, product) => total + product.total, 0);
  }, [orderProducts]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRef = collection(db, "products");
        const data = await getDocs(productRef);
        setProducts(
          data.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Products))
        );
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <GridContent>
      <h1>Criar Pedido</h1>
      <div className="flex flex-auto w-full gap-4">
        <Card className="mt-4 min-w-[400px] max-h-[260px]">
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
                    if (/^\d*\.?\d*$/.test(value)) setQtd(value);
                  }}
                  placeholder="Quantidade"
                  className="w-24"
                />
                <Select onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {`${item.name} (R$  ${parseFloat(item.price).toFixed(
                          2
                        )} - ${item.und})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="value">
                  Valor:{" "}
                  {selectedProduct
                    ? (
                        parseFloat(selectedProduct.price) * parseFloat(qtd)
                      ).toFixed(2)
                    : "0.00"}
                </Label>
                <Button onClick={handleAddProduct}>Adicionar</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Table className="min-w-[580px]">
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
            {orderProducts.map((product, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>R$ {product.total?.toFixed(2)}</TableCell>
                <TableCell>
                  <Button
                    variant={"ghost"}
                    onClick={() => handleRemoveProduct(index)}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total: {totalPrice.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <Button
                  onClick={() => {
                    setIsOpen(true);
                  }}
                >
                  Finalizar
                </Button>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicione os dados do cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Nome do Cliente"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <Input
              placeholder="Endreço"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            />
            <Input
              placeholder="Complemento"
              value={complement}
              onChange={(e) => {
                setComplement(e.target.value);
              }}
            />
            <Input
              placeholder="Observaçãp"
              value={observation}
              onChange={(e) => {
                setObservation(e.target.value);
              }}
            />
            <Input
              placeholder="Telefone"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
              }}
            />
            <Button onClick={handleCreateOrder}>Finalizar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </GridContent>
  );
};

export default CreateOrder;
