"use client";

import { addProduct } from "@/actions/add-product-actio";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "react-toastify";

export default function AddProductForm({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [state, dispatch] = useActionState(addProduct, {
    errors: [],
    success: "",
  });

  useEffect(() => {
    if (state.errors) {
      state.errors.forEach((error) => toast.error(error));
    }

    if (state.success) {
      toast.success(state.success);
      router.push("/admin/products");
    }
  }, [state]);

  return (
    <form className="space-y-5" action={dispatch}>
      {children}
      <input
        type="submit"
        className="rounded-lg bg-green-400 text-white font-bold py-2 mt-5 w-full cursor-pointer"
        value={"Agregar Producto"}
      />
    </form>
  );
}
