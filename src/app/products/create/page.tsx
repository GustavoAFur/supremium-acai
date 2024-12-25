"use client";

import { db, storage } from "@/utils/firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "../../_data/categories";
import Image from "next/image";
import GridContent from "../../_components/grid-content";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";

const Create = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progressFile, setProgressFile] = useState(0);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [und, setUnd] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const generateTokens = (text: string): string[] => {
    if (!text) return [];
    return text
      .toLowerCase() // Converte para minúsculas
      .normalize("NFD") // Remove acentos e diacríticos
      .replace(/[\u0300-\u036f]/g, "") // Remove marcas restantes de acentos
      .split(/\s+/) // Divide o texto por espaços
      .filter((token) => token.trim() !== ""); // Remove strings vazias
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Gerar a pré-visualização usando FileReader
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const uploadFile = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject("Nenhum arquivo selecionado.");
        return;
      }

      const storageRef = ref(storage, `/ProductsImages/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgressFile(progress);
        },
        (error) => {
          console.error("Erro no upload:", error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            console.error("Erro ao obter a URL do arquivo:", error);
            reject(error);
          }
        }
      );
    });
  };

  const saveProduct = async () => {
    try {
      if (!file || !name || !price || !description || !category || !und) {
        alert("Campos obrigatórios não preenchidos");
        return;
      }
      setIsSaving(true);
      // Upload da imagem e obtenção da URL
      const imageUrl = await uploadFile();
      const nameTokens = generateTokens(name);
      // Salvando os dados no Firestore
      await addDoc(collection(db, "products"), {
        name,
        price,
        description,
        category,
        isAvailable,
        und,
        imageUrl,
        tokens: nameTokens,
        relevance: 1,
      }).then(() => {
        setIsSaving(false);
        alert("Produto salvo com sucesso!");
      });

      // Resetar o formulário
      setFile(null);
      setPreview(null);
      setName("");
      setPrice(0);
      setDescription("");
      setCategory("");
      setUnd("");
      setProgressFile(0);
    } catch (error) {
      setIsSaving(false);
      alert("Erro ao salvar o produto");
    }
  };

  return (
    <GridContent>
      <h1 className="text-3xl font-semibold mt-8">Cadastrar produto</h1>

      <div className="flex gap-4">
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Imagem do produto</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <Label htmlFor="picture">Pré-visualização da imagem</Label>
            <div className="relative my-4 w-full h-52 rounded-sm overflow-hidden">
              <Image
                src={preview || "/image-not-found.png"}
                alt={"Pré-visualização da imagem"}
                className="object-cover "
                fill
              />
            </div>
            <Input id="picture" type="file" onChange={handleFileChange} />
          </CardContent>
        </Card>

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
                onChange={(e) => setPrice(Number(e.target.value))}
              />

              <Input
                id="und"
                placeholder="unidade"
                value={und}
                onChange={(e) => setUnd(e.target.value)}
              />
            </div>
            <Select onValueChange={setCategory} value={category}>
              <SelectTrigger>
                <SelectValue placeholder="categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Textarea
              placeholder="Faça uma descrição do produto"
              className="resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </CardContent>
        </Card>
      </div>
      <Button disabled={isSaving} onClick={saveProduct} className="mt-4">
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
