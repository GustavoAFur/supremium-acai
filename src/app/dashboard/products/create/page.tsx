"use client";

import { db } from "@/utils/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GridContent from "../../../_components/grid-content";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Create = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [und, setUnd] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  const saveProduct = async () => {
    try {
      if (!name || !price || !und) {
        alert("Campos obrigatórios não preenchidos");
        return;
      }
      setIsSaving(true);
      // Salvando os dados no Firestore
      await addDoc(collection(db, "products"), {
        name,
        price,
        und,
      }).then(() => {
        setIsSaving(false);
        alert("Produto salvo com sucesso!");
      });

      // Resetar o formulário
      setName("");
      setPrice("");
      setUnd("");
    } catch (error) {
      setIsSaving(false);
      alert(error);
    }
  };

  return (
    <GridContent>
      <h1 className="text-3xl font-semibold">Cadastrar produto</h1>

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
      <Button disabled={isSaving} onClick={saveProduct} className="mt-4 w-20">
        {isSaving ? "Salvando..." : "Salvar"}
      </Button>
    </GridContent>
  );
};

export default Create;
/**


const Administrator = () => {


  return (
    
  );
};

export default Administrator;

 */
