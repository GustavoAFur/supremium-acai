"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Product } from "../page";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "quantity",
    header: "Quantidade",
  },
  {
    accessorKey: "price",
    header: "Preço",
  },
];
