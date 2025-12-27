"use client";

import { useStore } from "@/src/store";
import ShoopingCartItem from "./ShoopingCartItem";

export default function ShoppingCart() {
  const contents = useStore((state) => state.contents);
  return (
    <>
      <h2 className="text-4xl font-bold text-gray-900">Resumen de Venta</h2>
      <ul
        role="list"
        className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-gray-500"
      >
        {contents.map((item) => (
          <ShoopingCartItem key={item.productId} item={item} />
        ))}
      </ul>
    </>
  );
}
