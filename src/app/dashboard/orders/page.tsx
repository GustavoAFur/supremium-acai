"use client";
import GridContent from "@/app/_components/grid-content";
import { db } from "@/utils/firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { Suspense, useCallback, useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Payment {
  methodPayment: string;
  value: string;
}

interface PaymentInfo {
  paymentMethod: Payment[];
  transshipment: number;
  totalPayed: number;
}
export interface Product {
  id: string;
  name: string;
  price: string;
  quantity: number;
  total: number;
}

export interface DeliveryInfo {
  address: string;
  complement: string;
  observation: string;
  phone: string;
}

export interface Order {
  id: string;
  createdAt: Date;
  status: string;
  deliveryInfo: DeliveryInfo;
  items: Product[];
  totalPrice: number;
  orderType: string;
  name: string;
  paymentInfo: PaymentInfo;
}

const OrdersContent = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const search = useSearchParams();
  const status = search.get("status");

  // Listener para atualizações em tempo real
  const fetchRealTimeData = useCallback(() => {
    const q = query(
      collection(db, "orders"),
      where("status", "==", status),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData: Order[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        status: doc.data().status,
        createdAt: doc.data().createdAt.toDate(),
        deliveryInfo: doc.data().deliveryInfo,
        items: doc.data().items,
        totalPrice: doc.data().totalPrice,
        orderType: doc.data().orderType,
        name: doc.data().name,
        paymentInfo: doc.data().paymentInfo,
      }));
      setOrders(ordersData);
    });

    return unsubscribe;
  }, [status]);

  useEffect(() => {
    const unsubscribe = fetchRealTimeData();

    // Limpeza: parar o listener quando o componente desmontar
    return () => unsubscribe();
  }, [fetchRealTimeData]);

  return (
    <GridContent>
      <h1 className="text-3xl font-semibold mt-8">Pedidos</h1>

      <div className="mt-8">
        <Table className="bg-white">
          <TableCaption>Lista de pedidos</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  {order.createdAt.toLocaleDateString()}
                </TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.name}</TableCell>
                <TableCell className="text-right">
                  R${order.totalPrice.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Link href={`/dashboard/orders/order-details/${order.id}`}>
                    <ArrowRight />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </GridContent>
  );
};

const Orders = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrdersContent />
    </Suspense>
  );
};

export default Orders;
