"use client";

import { PDFViewer } from "@react-pdf/renderer";
import { PdfTicket } from "./_components/pdfTicket";
import { db } from "@/utils/firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  getDocs,
  doc,
  getDoc,
  runTransaction,
  updateDoc,
} from "firebase/firestore";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";

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
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  ListFilter,
  MoreVertical,
  ReceiptText,
  Search,
  X,
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
import { getCookie } from "cookies-next/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

interface Methods {
  methodPayment: string;
  value: string;
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

  const [isOpen, setIsOpen] = useState(false);
  const [isTicketOpen, setIsTicketOpen] = useState(false);

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

  const Details = ({ title, content }: { title: string; content: string }) => {
    return (
      <div className="flex justify-between items-center">
        <p className="font-semibold">{title}</p>
        <p className="capitalize">{content}</p>
      </div>
    );
  };

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

  const incrementValuesToCashRegister = async () => {
    try {
      const idRegister = getCookie("idCashRegister");

      if (!idRegister || idRegister === "") {
        return;
      }

      const registerRef = doc(db, "cashRegister", idRegister);

      let totalCashOrder = 0;
      let totalCardOrder = 0;
      let totalPixOrder = 0;

      paymentMethodList.forEach((methodList) => {
        if (methodList.methodPayment === "dinheiro") {
          totalCashOrder += parseFloat(methodList.value);
        }
        if (methodList.methodPayment === "cartao") {
          totalCardOrder += parseFloat(methodList.value);
        }
        if (methodList.methodPayment === "pix") {
          totalPixOrder += parseFloat(methodList.value);
        }
      });

      await runTransaction(db, async (transaction) => {
        const crDoc = await transaction.get(registerRef);
        if (!crDoc.exists()) {
          throw "Document does not exist!";
        }

        const newValueCach = crDoc.data().totalCash + totalCashOrder;
        const newValueCard = crDoc.data().totalCard + totalCardOrder;
        const newValuePix = crDoc.data().totalPix + totalPixOrder;
        const newValueTransshipment =
          crDoc.data().totalTransshipment + transshipment;
        const newTotalSales = crDoc.data().totalSales + 1;
        transaction.update(registerRef, {
          totalCash: newValueCach,
          totalCard: newValueCard,
          totalPix: newValuePix,
          totalTransshipment: newValueTransshipment,
          totalSales: newTotalSales,
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const finishOrder = async () => {
    try {
      if (!order?.id) {
        router.push("/404"); // Redireciona se o ID não for válido
        return;
      }

      await incrementValuesToCashRegister();

      const docRef = doc(db, "orders", order?.id);
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
      if (!order?.id) {
        router.push("/404"); // Redireciona se o ID não for válido
        return;
      }
      const docRef = doc(db, "orders", order?.id);
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
    <div className="flex-1 space-y-4 p-8 pt-12">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Seus pedidos</h2>

        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
          <Button>
            <Search className="size-4" />
            Buscar
          </Button>
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
              <div className="flex p-4 border rounded-md justify-between">
                <Button
                  onClick={() => {
                    setIsTicketOpen(true);
                  }}
                  variant="ghost"
                  className="h-8 gap-1 tracking-tight text-sm"
                >
                  <ReceiptText className="h-5 w-5" />
                  Imprimir
                </Button>

                <Button
                  onClick={() => {
                    handleCancel();
                  }}
                  variant="ghost"
                  disabled={order.status !== "aberto"}
                  className={`${
                    order.status !== "aberto" && "cursor-not-allowed"
                  } h-8 gap-1 tracking-tight text-sm text-red-500 hover:bg-[#FFEDED] hover:text-red-500`}
                >
                  <X className="h-5 w-5" />
                  Cancelar
                </Button>
                <Button
                  disabled={order.status !== "aberto"}
                  onClick={() => {
                    finishOrder();
                  }}
                  variant="ghost"
                  className={`${
                    order.status !== "aberto" && "cursor-not-allowed"
                  } h-8 gap-1 tracking-tight text-sm text-emerald-600 hover:bg-[#E2F6F0] hover:text-emerald-600`}
                >
                  <Check className="h-5 w-5" />
                  Finalizar
                </Button>
              </div>

              <div className="grid gap-3 mt-6">
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

                  {order?.status === "fechado" && (
                    <div>
                      <Separator className="my-4" />

                      <div className="grid auto-rows-max gap-3">
                        <div className="font-semibold">
                          Informações de pagamentos
                        </div>

                        <div className="text-muted-foreground">
                          <ul className="grid gap-3">
                            {order.paymentInfo?.paymentMethod.map(
                              (item, index) => {
                                return (
                                  <li
                                    className="flex items-center justify-between"
                                    key={index}
                                  >
                                    <span className="text-muted-foreground">
                                      {item.methodPayment
                                        .charAt(0)
                                        .toUpperCase() +
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
                              }
                            )}

                            <li className="flex items-center justify-between font-semibold">
                              <span className="text-muted-foreground">
                                Total
                              </span>
                              <span>
                                {Intl.NumberFormat("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                }).format(order.paymentInfo?.totalPayed)}
                              </span>
                            </li>

                            <li className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                Troco
                              </span>
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
                  <TableCell>Total: {order?.totalPrice?.toFixed(2)}</TableCell>
                  <TableCell>Total Pago: {totalPayed?.toFixed(2)}</TableCell>
                  <TableCell>Troco: {transshipment?.toFixed(2)}</TableCell>
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

      <Dialog open={isTicketOpen} onOpenChange={setIsTicketOpen}>
        <DialogContent className="w-[1200px] h-auto">
          <DialogHeader>
            <DialogTitle>Pre-view</DialogTitle>
            <DialogDescription>
              Tenha uma pre-visualização da nota
            </DialogDescription>
          </DialogHeader>
          <PDFViewer width="100%" height="400">
            <PdfTicket order={order as Order} />
          </PDFViewer>
        </DialogContent>
      </Dialog>
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
