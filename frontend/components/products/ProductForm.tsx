import { CategoriesResponseSchema } from "@/src/schemas";

async function getCategories() {
  const url = `${process.env.API_URL}/categories`;
  const req = await fetch(url);
  const json = await req.json();
  const categories = CategoriesResponseSchema.parse(json);
  return categories;
}

export default async function ProductForm() {
  const categories = await getCategories();
  console.log(categories);

  return (
    <>
      <div className="space-y-2 ">
        <label htmlFor="name" className="block">
          Nombre Producto
        </label>
        <input
          id="name"
          type="text"
          placeholder="Nombre Producto"
          className="border border-gray-300 w-full p-2 rounded-lg"
          name="name"
        />
      </div>

      <div className="space-y-2 ">
        <label htmlFor="price" className="block">
          Precio
        </label>
        <input
          id="price"
          type="number"
          placeholder="Precio Producto"
          className="border border-gray-300 w-full p-2 rounded-lg"
          name="price"
          min={0}
        />
      </div>

      <div className="space-y-2 ">
        <label htmlFor="inventory" className="block">
          Inventario
        </label>
        <input
          id="inventory"
          type="number"
          placeholder="Cantidad Disponible"
          className="border border-gray-300 w-full p-2 rounded-lg"
          name="inventory"
          min={0}
        />
      </div>

      <div className="space-y-2 ">
        <label htmlFor="categoryId" className="block">
          Categoría
        </label>
        <select
          id="categoryId"
          className="border border-gray-300 w-full p-2 bg-white rounded-lg"
          name="categoryId"
        >
          <option value="">Seleccionar Categoría</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
