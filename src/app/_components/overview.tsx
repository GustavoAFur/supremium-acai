"use client";
import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/utils/firebaseConfig";

export function Overview() {
  const [chartData, setChartData] = useState([
    { name: "Jan", total: 0 },
    { name: "Fev", total: 0 },
    { name: "Mar", total: 0 },
    { name: "Abr", total: 0 },
    { name: "Mai", total: 0 },
    { name: "Jun", total: 0 },
    { name: "Jul", total: 0 },
    { name: "Ago", total: 0 },
    { name: "Set", total: 0 },
    { name: "Out", total: 0 },
    { name: "Nov", total: 0 },
    { name: "Dez", total: 0 },
  ]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const q = query(
          collection(db, "orders"),
          where("status", "!=", "cancelado")
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          console.log("Nenhum pedido encontrado.");
          return;
        }

        const monthlyTotals = Array(12).fill(0);

        snapshot.forEach((doc) => {
          const data = doc.data();
          const createdAt = data.createdAt?.toDate();

          if (createdAt) {
            const monthIndex = createdAt.getMonth();
            monthlyTotals[monthIndex] += data.totalPrice || 0;
          }
        });

        const updatedData = chartData.map((item, index) => ({
          ...item,
          total: monthlyTotals[index],
        }));

        setChartData(updatedData);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      }
    }

    fetchOrders();
  }, [chartData]);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `R$${value}`}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
