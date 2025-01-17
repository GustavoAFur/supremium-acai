"use client";
import GridContent from "@/app/_components/grid-content";
import { db } from "@/utils/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Order } from "../../page";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { BanIcon, Check, Printer } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

interface Methods {
  methodPayment: string;
  value: string;
}

const OrderDetails = () => {
  const params = useParams();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const [order, setOrder] = useState<Order>();

  const [paymentMethodList, setPaymentMethodList] = useState<Methods[]>([]);
  const [value, setValue] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [transshipment, setTransshipment] = useState(0);

  const currentPaymentMethod = [
    {
      label: "Dinheiro",
      value: "dinheiro",
    },
    {
      label: "Pix",
      value: "pix",
    },
    {
      label: "Cartão",
      value: "cartao",
    },
  ];

  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const Details = ({ title, content }: { title: string; content: string }) => {
    return (
      <div className="flex justify-between items-center">
        <p className="font-semibold">{title}</p>
        <p className="capitalize">{content}</p>
      </div>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          router.push("/404"); // Redireciona se o ID não for válido
          return;
        }
        const docRef = doc(db, "orders", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setOrder({
            ...docSnap.data(),
            id: docSnap.id,
            createdAt: docSnap.data().createdAt?.toDate(),
          } as Order);
        } else {
          router.push("/404");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [params, router]);

  const finishOrder = async () => {
    try {
      if (!id) {
        router.push("/404"); // Redireciona se o ID não for válido
        return;
      }
      const docRef = doc(db, "orders", id);
      await updateDoc(docRef, {
        status: "fechado",
        paymentInfo: {
          paymentMethod: paymentMethodList,
          transshipment,
          totalPayed,
        },
      }).then(() => {
        setIsOpen(false);
        router.push("/dashboard/orders?status=aberto");
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = async () => {
    try {
      if (!id) {
        router.push("/404"); // Redireciona se o ID não for válido
        return;
      }
      const docRef = doc(db, "orders", id);
      // Exibe uma mensagem de confirmação
      const userConfirmed = window.confirm(
        "Tem certeza de que deseja cancelar este pedido?"
      );

      if (!userConfirmed) {
        return; // Se o usuário cancelar, interrompe a execução
      }

      await updateDoc(docRef, {
        status: "cancelado",
      });

      // Redireciona após atualizar o documento
      router.push("/dashboard/orders?status=aberto");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectChange = (value: string) => {
    setSelectedMethod(value); // Atualiza o método de pagamento selecionado
  };

  const handleAddMethodsPayment = () => {
    const addedValue = parseFloat(value);
    const orderTotalPrice = order?.totalPrice || 0;

    if (
      selectedMethod === "dinheiro" &&
      addedValue + totalPayed > orderTotalPrice
    ) {
      setTransshipment(totalPayed + addedValue - orderTotalPrice);
      setPaymentMethodList([
        ...paymentMethodList,
        { methodPayment: selectedMethod, value: value },
      ]);
    }

    if (
      selectedMethod !== "dinheiro" &&
      addedValue + totalPayed > orderTotalPrice
    ) {
      alert("Finalizadora não permite troco!\nTente outra forma de pagamento");
    }

    if (addedValue + totalPayed <= orderTotalPrice) {
      setPaymentMethodList([
        ...paymentMethodList,
        { methodPayment: selectedMethod, value: value },
      ]);
    }
  };

  const totalPayed = useMemo(() => {
    return paymentMethodList.reduce(
      (total, item) => total + parseFloat(item.value),
      0
    );
  }, [paymentMethodList]);

  return (
    <GridContent>
      <h1 className="text-3xl font-semibold mt-8">Detalhes do pedido</h1>
      <div className="flex justify-between items-center w-full font-semibold">
        <h3>ID do pedido: {params.id}</h3>
        <p className="capitalize">{order?.status}</p>
      </div>

      <div className="flex justify-between items-center w-full">
        <Table className="bg-white">
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead className="text-right">Preço</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order?.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="capitalize">{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell className="text-right">
                  R${item.total.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="w-full mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Details title="Nome:" content={order?.name || ""} />
              {order?.orderType === "delivery" && (
                <>
                  <Details
                    title="Telefone:"
                    content={order?.deliveryInfo.phone || ""}
                  />
                  <Details
                    title="Endereço:"
                    content={order?.deliveryInfo.address || ""}
                  />
                  <Details
                    title="Complemento:"
                    content={order?.deliveryInfo.complement || ""}
                  />
                </>
              )}

              <Details title="Status:" content={order?.status || ""} />
              <Details
                title="Data do pedido:"
                content={order?.createdAt.toLocaleDateString("pt-BR") || ""}
              />
              <Separator />
              <Details
                title="Total:"
                content={`R$ ${order?.totalPrice.toFixed(2)}`}
              />
              {order?.status === "fechado" && (
                <div className="w-full flex justify-between">
                  <p className="font-semibold">Formas de pagamento:</p>
                  <div className="w-[200px]">
                    {order?.paymentInfo.paymentMethod.map((item, index) => (
                      <div
                        className="w-full flex items-center justify-between"
                        key={index}
                      >
                        <p className="capitalize">{item.methodPayment}:</p>
                        <p>R$ {parseFloat(item.value).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <div className="mt-4 flex items-center justify-end gap-4">
          <Button variant={"ghost"} className="border">
            Imprimir
            <Printer />
          </Button>

          {order?.status === "aberto" && (
            <div className="flex items-center justify-end gap-4">
              <Button variant={"destructive"} onClick={handleCancel}>
                Cancelar
                <BanIcon />
              </Button>
              <Button
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                Finalizar
                <Check />
              </Button>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Selecione o(s) método(s) de pagamento</DialogTitle>
          </DialogHeader>
          <div className="flex gap-4">
            <Select onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Finalizadora" />
              </SelectTrigger>
              <SelectContent>
                {currentPaymentMethod.map((item, index) => (
                  <SelectItem key={index} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Valor"
              value={value}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value)) setValue(value);
              }}
            />
            <Button onClick={handleAddMethodsPayment}>Adicionar</Button>
          </div>
          <div className="w-full min-h-[300px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Finalizadora</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentMethodList.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="capitalize">
                      {item.methodPayment}
                    </TableCell>
                    <TableCell>{item.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell>Total: {order?.totalPrice.toFixed(2)}</TableCell>
                  <TableCell>Total Pago: {totalPayed.toFixed(2)}</TableCell>
                  <TableCell>Troco: {transshipment.toFixed(2)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
          <Label>
            A pagar:{" "}
            {(order?.totalPrice || 0) - totalPayed > 0
              ? `${(order?.totalPrice || 0) - totalPayed}`
              : "0.00"}
          </Label>

          <Button onClick={finishOrder}>Finalizar</Button>
        </DialogContent>
      </Dialog>
    </GridContent>
  );
};

export default OrderDetails;

/*

async function connectPrinter() {
  try {
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['battery_service'], // Adicione o serviço correto aqui se necessário
    });

    const server = await device.gatt.connect();
    console.log('Connected to the printer!', server);

    // Envie comandos ESC/POS aqui
  } catch (error) {
    console.error('Connection failed:', error);
  }
}


async function printText(server, text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text + '\n');

  const service = await server.getPrimaryService('fda50693-a4e2-4fb1-afcf-c6eb07647825'); // Substitua pelo UUID correto
  const characteristic = await service.getCharacteristic('characteristic-uuid');
  await characteristic.writeValue(data);

  console.log('Text printed!');
}

*/
