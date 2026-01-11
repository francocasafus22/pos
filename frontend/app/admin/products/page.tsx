import ProductsTable from "@/components/products/ProductsTable";
import Heading from "@/components/ui/Heading";
import Pagination from "@/components/ui/Pagination";
import { ProductsResponseSchema } from "@/src/schemas";
import { isValidPage } from "@/src/utils";
import Link from "next/link";
import { redirect } from "next/navigation";

async function getProducts(page: number) {
  const url = `${process.env.API_URL}/products?page=${page}`;
  const req = await fetch(url);
  const json = await req.json();
  const data = ProductsResponseSchema.parse(json);
  return data;
}

type SearchParams = Promise<{ page: string }>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page } = await searchParams;
  if (!isValidPage(+page)) redirect("/admin/products?page=1");
  const data = await getProducts(+page);

  if (+page > data.totalPages) redirect("/admin/products?page=1");

  return (
    <>
      <Heading>Administrar Productos</Heading>

      <Link
        href={"/admin/products/new"}
        className="rounded-lg bg-green-400 font-bold py-2 px-10 text-center text-white"
      >
        Nuevo Producto
      </Link>

      <ProductsTable products={data.products} />
      <Pagination
        page={+page}
        totalPages={data.totalPages}
        baseURL={"/admin/products"}
      />
    </>
  );
}
