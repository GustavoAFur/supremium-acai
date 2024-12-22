"use client";
import GridContent from "@/app/_components/grid-content";
import { db } from "@/utils/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}
[];

interface deliveryInfo {
  address: string;
  complement: string;
  name: string;
  observation: string;
  phone: string;
}

interface Order {
  id: string;
  createdAt: Date;
  status: string;
  deliveryInfo: deliveryInfo;
  items: Product[];
  totalPrice: number;
}

const OrdersOpen = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const fechData = async () => {
    try {
      const q = query(
        collection(db, "orders"),
        where("status", "==", "aberto")
      );

      const data = await getDocs(q);
      const ordersData: Order[] = data.docs.map((doc) => ({
        id: doc.id,
        status: doc.data().status,
        createdAt: doc.data().createdAt.toDate(),
        deliveryInfo: doc.data().deliveryInfo,
        items: doc.data().items,
        totalPrice: doc.data().totalPrice,
      }));
      setOrders(ordersData);
    } catch (error) {}
  };

  useEffect(() => {
    fechData();
  }, []);

  return (
    <GridContent>
      <h1 className="text-3xl font-semibold mt-8">Pedidos abertos</h1>
      <Button onClick={() => fechData()} className="mt-8 w-32">
        <RefreshCcw />
      </Button>
      <div className="mt-8 w-[800px]">
        <Table>
          <TableCaption>Lista de pedidos abertos</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  {order.createdAt.toLocaleDateString()}
                </TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.deliveryInfo.name}</TableCell>
                <TableCell className="text-right">
                  ${order.totalPrice}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </GridContent>
  );
};

export default OrdersOpen;
