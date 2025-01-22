import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  {
    name: "Jan",
    total: 45,
  },
  {
    name: "Fev",
    total: 0,
  },
  {
    name: "Mar",
    total: 45,
  },
  {
    name: "Abr",
    total: 0,
  },
  {
    name: "Mai",
    total: 0,
  },
  {
    name: "Jun",
    total: 0,
  },
  {
    name: "Jul",
    total: 0,
  },
  {
    name: "Ago",
    total: 0,
  },
  {
    name: "Set",
    total: 0,
  },
  {
    name: "Out",
    total: 0,
  },
  {
    name: "Nov",
    total: 0,
  },
  {
    name: "Dez",
    total: 0,
  },
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
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
