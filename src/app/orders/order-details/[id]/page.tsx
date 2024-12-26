"use client";
import GridContent from "@/app/_components/grid-content";
import { db } from "@/utils/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Order } from "../../page";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Image from "next/image";

const OrderDetails = () => {
  const params = useParams();
  const router = useRouter();

  const [order, setOrder] = useState<Order>();

  const Details = ({ title, content }: { title: string; content: string }) => {
    return (
      <div className="flex justify-between items-center">
        <p className="font-semibold">{title}</p>
        <p>{content}</p>
      </div>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

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
          console.log(docSnap.data());
        } else {
          router.push("/404");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [params]);

  return (
    <GridContent>
      <div className="space-y-4 w-[800px]">
        <h1 className="text-3xl font-semibold mt-8">Detalhes do pedido</h1>
        <div className="flex justify-between items-center w-full font-semibold">
          <h3>ID do pedido: {params.id}</h3>
          <p className="capitalize">{order?.status}</p>
        </div>

        <div className="flex justify-between items-center w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Imagem</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead className="text-right">Preço</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order?.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="relative max-w-[50px] max-h-[50px] min-w-[50px] min-h-[50px] rounded-md overflow-hidden">
                      <Image
                        src={item.imageUrl || "/image-not-found.png"}
                        alt={item.name}
                        className="object-cover"
                        fill
                      />
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="text-right">R${item.price}</TableCell>
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
              <div className="space-y-4">
                <Details
                  title="Nome:"
                  content={order?.deliveryInfo.name || ""}
                />

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
                <Details title="Status:" content={order?.status || ""} />
                <Details
                  title="Data do pedido:"
                  content={order?.createdAt.toLocaleDateString("pt-BR") || ""}
                />
                <Details
                  title="Total:"
                  content={`R$ ${order?.totalPrice.toFixed(2)}`}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </GridContent>
  );
};

export default OrderDetails;
