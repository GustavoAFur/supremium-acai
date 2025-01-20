"use client";
import GridContent from "@/app/_components/grid-content";
import { db } from "@/utils/firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  getDocs,
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
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  ListFilter,
  MoreVertical,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { CalendarDateRangePicker } from "@/app/_components/date-range-picker";
import {
  endOfMonth,
  endOfWeek,
  format,
  formatRelative,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { is, ptBR } from "date-fns/locale";

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
  const [order, setOrder] = useState<Order>({} as Order);
  const [currentWeek, setCurrentWeek] = useState<number>(0);
  const [currentMonth, setCurrentMonth] = useState<number>(0);
  const search = useSearchParams();
  const status = search.get("status");
  const params = useParams();
  const router = useRouter();

  // Listener para atualizações em tempo real
  const fetchRealTimeData = useCallback(() => {
    const q = query(
      collection(db, "orders"),
      where("status", "==", status),
      orderBy("createdAt", "desc")
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

  // Listener para atualizações em tempo real
  const fetchRealTimeWeekData = useCallback(() => {
    const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    const endOfCurrentWeek = endOfWeek(new Date(), { weekStartsOn: 1 });

    const ordersQuery = query(
      collection(db, "orders"),
      where("createdAt", ">=", startOfCurrentWeek),
      where("createdAt", "<=", endOfCurrentWeek),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => doc.data());
      const totalWeekValue = ordersData.reduce(
        (acc, order) => acc + parseFloat(order.totalPrice),
        0
      );

      setCurrentWeek(totalWeekValue); // Atualiza o valor total da semana
    });

    return unsubscribe;
  }, []);

  const fetchRealTimeMonthData = useCallback(() => {
    const startOfCurrentMonth = startOfMonth(new Date());
    const endOfCurrentMonth = endOfMonth(new Date());

    const ordersQuery = query(
      collection(db, "orders"),
      where("createdAt", ">=", startOfCurrentMonth),
      where("createdAt", "<=", endOfCurrentMonth),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => doc.data());
      const totalMonthValue = ordersData.reduce(
        (acc, order) => acc + parseFloat(order.totalPrice),
        0
      );

      setCurrentMonth(totalMonthValue); // Atualiza o valor total do mês
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = fetchRealTimeData();

    // Limpeza: parar o listener quando o componente desmontar
    return () => unsubscribe();
  }, [fetchRealTimeData]);

  useEffect(() => {
    const unsubscribe = fetchRealTimeWeekData();

    // Limpeza: parar o listener quando o componente desmontar
    return () => unsubscribe();
  }, [fetchRealTimeWeekData]);

  useEffect(() => {
    const unsubscribe = fetchRealTimeMonthData();

    // Limpeza: parar o listener quando o componente desmontar
    return () => unsubscribe();
  }, [fetchRealTimeMonthData]);

  return (
    <div className="flex-1 space-y-4 p-8 pt-12">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Seus pedidos</h2>

        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
          <Button>Download</Button>
        </div>
      </div>

      <div
        className={`${
          Object.keys(order).length === 0 ? "" : "grid"
        } flex-1 items-start gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-3`}
      >
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
              <CardHeader className="pb-3">
                <CardTitle>Pedidos</CardTitle>
                <CardDescription className="max-w-lg text-balance leading-relaxed">
                  Crie um novo pedido, ou acesse os pedidos anteriores, e
                  acompanhe o status do seu pedido.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button onClick={() => router.push("/dashboard/orders/create")}>
                  Criar pedido
                </Button>
              </CardFooter>
            </Card>

            <Card x-chunk="dashboard-05-chunk-1">
              <CardHeader className="pb-2">
                <CardDescription>Essa semana</CardDescription>
                <CardTitle className="text-4xl">
                  {currentWeek === 0
                    ? "R$0,00"
                    : Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      }).format(currentWeek)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  {/* +25% da semana passada */}
                  Não há dados suficientes para calcular
                </div>
              </CardContent>
              <CardFooter>
                <Progress
                  style={{
                    height: 5,
                  }}
                  value={25}
                  aria-label="25% de aumento"
                />
              </CardFooter>
            </Card>

            <Card x-chunk="dashboard-05-chunk-2">
              <CardHeader className="pb-2">
                <CardDescription>Este mês</CardDescription>
                <CardTitle className="text-4xl">
                  {currentMonth === 0
                    ? "R$0,00"
                    : Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      }).format(currentMonth)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  {/* +10% do mês passado */}
                  Não há dados suficientes para calcular
                </div>
              </CardContent>
              <CardFooter>
                <Progress
                  style={{
                    height: 5,
                  }}
                  value={12}
                  aria-label="12% de aumento"
                />
              </CardFooter>
            </Card>
          </div>

          <Tabs defaultValue="month">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="day">Hoje</TabsTrigger>
                <TabsTrigger value="week">Semana</TabsTrigger>
                <TabsTrigger value="month">Mês</TabsTrigger>
              </TabsList>

              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 gap-1 text-sm"
                    >
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only">Filtros</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={status === "aberto"}
                      onClick={() => {
                        router.push(`/dashboard/orders?status=aberto`);
                      }}
                    >
                      Abertos
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={status === "fechado"}
                      onClick={() => {
                        router.push(`/dashboard/orders?status=fechado`);
                      }}
                    >
                      Fechados
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      Cancelados
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  size="sm"
                  variant="outline"
                  className="h-10 gap-1 text-sm"
                >
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only">Exportar</span>
                </Button>
              </div>
            </div>

            <TabsContent value="month">
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="px-7">
                  <CardTitle>Pedidos</CardTitle>
                  <CardDescription>
                    Pedidos recentes de sua loja.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Tipo
                        </TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Status
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Data
                        </TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {orders.map((item, index) => {
                        return (
                          <TableRow
                            key={index}
                            onClick={() => {
                              setOrder(item);
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            <TableCell>{(item as any).name}</TableCell>
                            <TableCell className="hidden sm:table-cell capitalize">
                              {item.orderType}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <Badge
                                className={`text-xs font-normal h-6 capitalize ${
                                  item.status === "aberto"
                                    ? "text-white"
                                    : item.status === "fechado"
                                    ? "text-white"
                                    : "text-gray-600"
                                }
                              ${
                                item.status === "aberto"
                                  ? "bg-emerald-500 hover:bg-emerald-600"
                                  : item.status === "fechado"
                                  ? "bg-red-400 hover:bg-red-600"
                                  : "text-gray-300"
                              }
                              `}
                              >
                                {item.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {formatRelative(
                                new Date(item.createdAt),
                                new Date(),
                                { locale: ptBR }
                              )
                                .charAt(0)
                                .toUpperCase() +
                                formatRelative(
                                  new Date(item.createdAt),
                                  new Date(),
                                  { locale: ptBR }
                                ).slice(1)}
                            </TableCell>
                            <TableCell className="text-right">
                              R$ {(item as any).totalPrice.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {Object.keys(order).length > 0 && (
          <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
            <CardHeader className="flex flex-row items-start bg-muted/50">
              <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-lg">
                  Pedido {order.id}
                </CardTitle>

                <CardDescription>
                  Data:{" "}
                  {format(new Date(order.createdAt), "dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </CardDescription>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="outline" className="h-8 gap-1">
                      <MoreVertical className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Editar</DropdownMenuItem>
                    <DropdownMenuItem>Exportar</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Apagar</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  onClick={() => {
                    setOrder({} as Order);
                  }}
                  size="icon"
                  variant="ghost"
                  className="h-8 gap-1 ml-auto"
                >
                  <XIcon className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6 text-sm">
              <div className="grid gap-3">
                <div className="font-semibold">Detalhes do pedido</div>

                <ul className="grid gap-3">
                  {order.items.map((item, index) => {
                    return (
                      <li
                        className="flex items-center justify-between"
                        key={index}
                      >
                        <span className="text-muted-foreground">
                          {item.name} x <span>{item.quantity}</span>
                        </span>
                        <span>
                          {Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(parseFloat(item.price) * item.quantity)}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <Separator className="my-2" />

                <ul className="grid gap-3">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>
                      {Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(
                        order.items.reduce(
                          (sum, item) =>
                            sum + parseFloat(item.price) * item.quantity,
                          0
                        )
                      )}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Envio</span>
                    <span>R$0.00</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Taxa</span>
                    <span>R$0.00</span>
                  </li>
                  <li className="flex items-center justify-between font-semibold">
                    <span className="text-muted-foreground">Total</span>
                    <span>
                      {Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(
                        order.items.reduce(
                          (sum, item) =>
                            sum + parseFloat(item.price) * item.quantity,
                          0
                        )
                      )}
                    </span>
                  </li>
                </ul>
              </div>

              {order?.deliveryInfo !== null && (
                <div>
                  {order?.deliveryInfo?.address && (
                    <div>
                      <Separator className="my-4" />
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-3">
                          <div className="font-semibold">
                            Informação de envio
                          </div>
                          <address className="grid gap-0.5 not-italic text-muted-foreground">
                            <span>{order.deliveryInfo.address}</span>
                            <span>{order.deliveryInfo.complement}</span>
                          </address>
                        </div>
                      </div>
                    </div>
                  )}

                  <Separator className="my-4" />

                  <div className="grid auto-rows-max gap-3">
                    <div className="font-semibold">
                      Informações de pagamento
                    </div>

                    <div className="text-muted-foreground">
                      <ul className="grid gap-3">
                        {order.paymentInfo?.paymentMethod.map((item, index) => {
                          return (
                            <li
                              className="flex items-center justify-between"
                              key={index}
                            >
                              <span className="text-muted-foreground">
                                {item.methodPayment.charAt(0).toUpperCase() +
                                  item.methodPayment.slice(1)}
                              </span>
                              <span>
                                {Intl.NumberFormat("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                }).format(parseFloat(item.value))}
                              </span>
                            </li>
                          );
                        })}

                        <li className="flex items-center justify-between font-semibold">
                          <span className="text-muted-foreground">Total</span>
                          <span>
                            {Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(order.paymentInfo?.totalPayed)}
                          </span>
                        </li>

                        <li className="flex items-center justify-between">
                          <span className="text-muted-foreground">Troco</span>
                          <span>
                            {Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(order.paymentInfo?.transshipment)}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <Separator className="my-4" />

              <div className="grid gap-3">
                <div className="font-semibold">Informações do cliente</div>
                <dl className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Cliente</dt>
                    <dd>{order.name}</dd>
                  </div>

                  {order.deliveryInfo !== null && (
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Telefone</dt>
                      <dd>
                        {order.deliveryInfo.phone.replace(
                          /(\d{2})(\d{1})(\d{4})(\d{4})/,
                          "($1) $2 $3-$4"
                        )}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </CardContent>

            <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
              <div className="text-xs text-muted-foreground">
                Atualizado às{" "}
                <span className="font-medium">
                  {format(
                    new Date(order.createdAt),
                    "HH:mm ',' dd 'de' MMMM 'de' yyyy",
                    { locale: ptBR }
                  )}
                </span>
              </div>
              <Pagination className="ml-auto mr-0 w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <Button size="icon" variant="outline" className="h-6 w-6">
                      <ChevronLeft className="h-3.5 w-3.5" />
                      <span className="sr-only">Ordem anterior</span>
                    </Button>
                  </PaginationItem>
                  <PaginationItem>
                    <Button size="icon" variant="outline" className="h-6 w-6">
                      <ChevronRight className="h-3.5 w-3.5" />
                      <span className="sr-only">Próximo pedido</span>
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
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
