import { Product } from "@/src/schemas";
import { formatCurrency, getImagePath } from "@/src/utils";
import Image from "next/image";
import AddProductButton from "./AddProductButton";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="rounded-lg bg-white shadow relative p-5">
      <div>
        <Image
          src={getImagePath(product.image)}
          alt={`Imagen de producto ${product.name}`}
          width={400}
          height={600}
          unoptimized
          className="mx-auto rounded-lg"
        />
        <div className="p-3 space-y-2">
          <h3 className="text-xl font-bold text-gray-600">{product.name}</h3>
          <p className="text-gray-500">Disponibles: {product.inventory}</p>
          <p className="text-2xl font-extrabold  text-gray-900">
            {formatCurrency(product.price)}
          </p>
        </div>
      </div>
      <AddProductButton product={product} />
    </div>
  );
}
