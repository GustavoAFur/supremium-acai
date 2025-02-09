"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Order } from "../page";
import { formatRelative } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "name",
    header: "Cliente",
  },
  {
    accessorKey: "orderType",
    header: "Tipo",
  },
  {
    accessorKey: "status",
    header: () => <div className="text-right">Status</div>,
    cell: ({ row }) => {
      const currentStatus: string = row.getValue("status");
      return (
        <div className="text-right font-medium">
          <Badge
            className={`text-xs font-normal h-6 capitalize ${
              currentStatus === "aberto"
                ? "text-white"
                : currentStatus === "fechado"
                ? "text-white"
                : "text-gray-600"
            }
          ${
            currentStatus === "aberto"
              ? "bg-emerald-500 hover:bg-emerald-600"
              : currentStatus === "fechado"
              ? "bg-red-400 hover:bg-red-600"
              : "text-gray-300"
          }
          `}
          >
            {currentStatus}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-right">Data</div>,
    cell: ({ row }) => {
      const date: string = row.getValue("createdAt");
      return (
        <div className="text-right font-medium">
          {formatRelative(new Date(date), new Date(), { locale: ptBR })
            .charAt(0)
            .toUpperCase() +
            formatRelative(new Date(date), new Date(), { locale: ptBR }).slice(
              1
            )}
        </div>
      );
    },
  },
  {
    accessorKey: "totalPrice",
    header: () => <div className="text-right">Valor</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalPrice"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
];
