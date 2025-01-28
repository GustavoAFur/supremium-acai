import { useState, useEffect } from "react";
import { db } from "@/utils/firebaseConfig";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Order {
  id: string;
  createdAt: Date;
  name: string;
}

export function RecentSales() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const q = query(
          collection(db, "orders"),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const querySnapshot = await getDocs(q);
        const sales: Order[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          createdAt: doc.data().createdAt.toDate(), // Convert Firestore Timestamp to Date
          name: doc.data().name,
        }));
        setOrders(sales);
      } catch (error) {
        console.error("Error fetching sales:", error);
      }
    };

    fetchSales();
  }, []);

  return (
    <div className="space-y-8">
      {orders.map((item) => (
        <div key={item.id} className="flex items-center">
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{item.name}</p>
          </div>
          <div className="ml-auto text-sm font-normal">
            Data:{" "}
            {format(item.createdAt, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </div>
        </div>
      ))}
    </div>
  );
}
