"use client";

import { HomeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <main className="flex bg-white">
      <div className="w-28 py-9 bg-white h-screen flex flex-col border-r-[1px] border-gray-100">
        <div className="w-28 flex items-center justify-center">
          <Image src="/logo.png" width={60} height={60} alt="App" />
        </div>

        <nav className="flex-1 flex items-center justify-center">
          <ul className="flex flex-col items-center gap-4">
            <Link href="/dashboard">
              <li
                className={`flex items-center justify-center  w-[55px] h-[54px] rounded-[10px] hover:opacity-50 transition duration-300 ease-in-out ${
                  pathname === "/dashboard" ? "bg-[#FDF4FF]" : ""
                }`}
              >
                <Image
                  src={`${
                    pathname === "/dashboard"
                      ? "/dashboard-bold.svg"
                      : "/dashboard.svg"
                  }`}
                  width={22}
                  height={22}
                  alt="Icon"
                />
              </li>
            </Link>

            <Link href="/dashboard/orders?status=aberto">
              <li
                className={`flex items-center justify-center w-[55px] h-[54px] rounded-[10px] hover:opacity-50 transition duration-300 ease-in-out ${
                  pathname === "/dashboard/orders" ? "bg-[#FDF4FF]" : ""
                }`}
              >
                <Image
                  src={`${
                    pathname === "/dashboard/orders"
                      ? "/orders-bold.svg"
                      : "/orders.svg"
                  }`}
                  width={22}
                  height={22}
                  alt="Logo App"
                />
              </li>
            </Link>

            <Link href="/dashboard/products">
              <li
                className={`flex items-center justify-center w-[55px] h-[54px] rounded-[10px] hover:opacity-50 transition duration-300 ease-in-out ${
                  pathname === "/dashboard/products" ? "bg-[#FDF4FF]" : ""
                }`}
              >
                <Image
                  src={`${
                    pathname === "/dashboard/products"
                      ? "/products-bold.svg"
                      : "/products.svg"
                  }`}
                  width={22}
                  height={22}
                  alt="Logo App"
                />
              </li>
            </Link>

            <Link href="/dashboard/cashflow">
              <li
                className={`flex relative items-center justify-center w-[55px] h-[54px] rounded-[10px] hover:opacity-50 transition duration-300 ease-in-out ${
                  pathname === "/dashboard/cashflow" ? "bg-[#FDF4FF]" : ""
                }`}
              >
                <Image
                  src={`${
                    pathname === "/dashboard/cashflow"
                      ? "/money-bold.svg"
                      : "/money.svg"
                  }`}
                  width={22}
                  height={22}
                  alt="Logo App"
                />

                <span className="absolute top-2 right-2 translate-x-1/2 -translate-y-1/2 mb-6 w-5 h-5 bg-primary text-white text-[8px] font-medium rounded-full flex items-center justify-center">
                  +9
                </span>
              </li>
            </Link>
          </ul>
        </nav>

        <div className="w-full flex items-center justify-center">
          <button
            className={`flex items-center justify-center w-[55px] rounded-[10px] hover:opacity-50 transition duration-300 ease-in-out`}
          >
            <Image src="/logout.svg" width={22} height={22} alt="Logo App" />
          </button>
        </div>
      </div>

      <div className="flex-1">{children}</div>
    </main>
  );
}
