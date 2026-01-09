"use client";

import { useStore } from "@/src/store";
import ShoopingCartItem from "./ShoopingCartItem";
import Amount from "./amount";
import CouponForm from "./CouponForm";

export default function ShoppingCart() {
  const { contents, total, discount } = useStore((state) => state);
  return (
    contents.length != 0 && (
      <aside className=" md:h-screen md:overflow-y-scroll pt-10 pb-32 px-5 bg-white">
        <h2 className="text-4xl font-bold text-gray-900">Resumen de Venta</h2>
        <ul
          role="list"
          className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-gray-500"
        >
          {contents.map((item) => (
            <ShoopingCartItem key={item.productId} item={item} />
          ))}
        </ul>
        <dl className="space-y-6 py-6 border-t border-gray-300 text-sm font-medium text-gray-500">
          {discount ? (
            <Amount label="Descuento" amount={discount} discount />
          ) : null}
          <Amount label="Total a Pagar" amount={total} />
        </dl>
        <CouponForm />
      </aside>
    )
  );
}
