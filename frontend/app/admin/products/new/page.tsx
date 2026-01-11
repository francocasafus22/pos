import AddProductForm from "@/components/products/AddProductForm";
import ProductForm from "@/components/products/ProductForm";
import Heading from "@/components/ui/Heading";
import Link from "next/link";

export default function NewProductPage() {
  return (
    <>
      <div>
        <Link
          href={"/admin/products?page=1"}
          className="rounded-lg bg-green-400 font-bold py-2 px-10 text-center text-white"
        >
          Volver
        </Link>
      </div>
      <Heading>Nuevo Producto</Heading>
      <AddProductForm>
        <ProductForm />
      </AddProductForm>
    </>
  );
}
