import { create } from "zustand";
import { Product, ShoopingCart } from "./schemas";
import { devtools } from "zustand/middleware";

interface Store {
  total: number;
  contents: ShoopingCart;
  addToCart: (product: Product) => void;
}

export const useStore = create<Store>()(
  devtools((set, get) => ({
    total: 0,
    contents: [],
    addToCart: (product) => {
      const { id: productId, categoryId, ...data } = product;
      let contents: ShoopingCart = [];
      // Verificar si está duplicado
      const duplicated = get().contents.findIndex(
        (item) => item.productId == productId,
      );
      if (duplicated >= 0) {
        // Validar que no supere el stock
        if (
          get().contents[duplicated].quantity >=
          get().contents[duplicated].inventory
        )
          return;
        // Si esta duplicado sumarle a quantity, sino devolver el item como está
        contents = get().contents.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      } else {
        // Añadir el product a contents
        contents = [...get().contents, { ...data, productId, quantity: 1 }];
      }

      set(() => ({ contents }));
    },
  })),
);
