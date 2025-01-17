"use client";
import GridContent from "@/app/_components/grid-content";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebaseConfig";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const EditProduct = () => {
  const params = useParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [und, setUnd] = useState("");

  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  if (!id) {
    router.push("/404"); // Redireciona se o ID não for válido
    return;
  }

  const docRef = doc(db, "products", id);

  const updateProduct = async () => {
    setIsUpdating(true);
    try {
      await updateDoc(docRef, {
        name,
        price,
        und,
      });
      alert("Produto atualizado com sucesso!");
      router.back();
    } catch (error) {
      alert("Erro ao atualizar o produto!");
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteProduct = async () => {
    setIsDeleting(true);
    try {
      const confirm = window.confirm("Deseja mesmo excluir o produto?");
      if (!confirm) return;
      await deleteDoc(docRef);
      alert("Produto excluído com sucesso!!");
      router.back();
    } catch (error) {
      console.log(error);
      alert("Erro ao excluir o produto");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setName(docSnap.data().name);
          setPrice(docSnap.data().price);
          setUnd(docSnap.data().und);
        } else {
          router.push("/404");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [params, router]);

  return (
    <GridContent>
      <h1 className="text-3xl font-semibold">Editar Produto</h1>
      <div className="flex gap-4">
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Informações gerais do produto</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-4 pt-4">
            <Input
              id="name"
              placeholder="nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="flex justify-between gap-4">
              <Input
                id="price"
                placeholder="preço"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <Input
                id="und"
                placeholder="unidade"
                value={und}
                onChange={(e) => setUnd(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex items-center gap-4">
        <Button
          disabled={isUpdating}
          onClick={updateProduct}
          className="mt-4 w-20"
        >
          {isUpdating ? "Atualizando" : "Atualizar"}
        </Button>

        <Button
          disabled={isDeleting}
          variant={"destructive"}
          onClick={deleteProduct}
          className="mt-4 w-20"
        >
          {isDeleting ? "Excluindo" : "Excluír"}
        </Button>
      </div>
    </GridContent>
  );
};

export default EditProduct;
