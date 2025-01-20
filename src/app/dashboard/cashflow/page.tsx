"use client";

import { CalendarDateRangePicker } from "@/app/_components/date-range-picker";
import { Button } from "@/components/ui/button";

export default function CashFlow() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Caixa</h2>

        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
          <Button>Download</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"></div>
    </div>
  );
}
