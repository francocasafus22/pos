"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getSalesByDate } from "@/src/api";
import TransactionSummary from "./TransactionSummary";
import { formatCurrency, isValidPage } from "@/src/utils";
import Pagination from "../ui/Pagination";
import { redirect } from "next/navigation";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function TransactionFilter({ page }: { page: string }) {
  const [date, setDate] = useState<Value>(new Date());

  if (!isValidPage(+page)) redirect("/admin/sales?page=1");

  const formattedDate = format(date?.toString() || new Date(), "yyyy-MM-dd");

  const { data, isLoading } = useQuery({
    queryKey: ["sales", formattedDate, page],
    queryFn: () => getSalesByDate(formattedDate, page),
  });

  if (data) if (+page > data.totalPages) redirect("/admin/sales?page=1");

  const total =
    data?.transactions.reduce(
      (total, transaction) => total + +transaction.total,
      0,
    ) ?? 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-10 relative items-start">
      <div className="flex justify-center h-fit lg:sticky lg:top-10">
        <Calendar value={date} onChange={setDate} locale="es" />
      </div>

      <div>
        {isLoading && <p className="text-center">Cargando...</p>}
        {data ? (
          data.transactions.length ? (
            data.transactions.map((transaction) => (
              <TransactionSummary
                key={transaction.id}
                transaction={transaction}
              />
            ))
          ) : (
            <p className="text-lg text-center ">No hay ventas en esta fecha</p>
          )
        ) : null}

        <p className="my-5 text-lg font-bold text-right">
          Total del día: {""}
          <span className="font-normal">{formatCurrency(total)}</span>
        </p>

        {data && (
          <Pagination
            page={+page}
            totalPages={data.totalPages}
            baseURL="/admin/sales"
          />
        )}
      </div>
    </div>
  );
}
