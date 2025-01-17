"use client";
import GridContent from "@/app/_components/grid-content";
import { useEffect, useState } from "react";
import { Products } from "../../orders/create/page";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebaseConfig";

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
import { PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Edit = () => {
  const [products, setProducts] = useState<Products[]>([]);

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
      <h1 className="text-3xl font-semibold">Editar</h1>
      <Table className="bg-white">
        <TableCaption>Lista de produtos</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Unidade</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium capitalize">
                {product.name}
              </TableCell>
              <TableCell className="capitalize">{product.und}</TableCell>
              <TableCell className="capitalize">
                R$ {parseFloat(product.price).toFixed(2)}
              </TableCell>
              <TableCell>
                <Link href={`/dashboard/products/edit/${product.id}`}>
                  <PencilIcon />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </GridContent>
  );
};

export default Edit;
