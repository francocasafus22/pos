"use client";

import { uploadImage } from "@/actions/upload-image-action";
import { getImagePath } from "@/src/utils";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function UploadProductImage({
  currentImage,
}: {
  currentImage?: string;
}) {
  const [image, setImage] = useState("");

  const onDrop = useCallback(async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file);
    });
    const image = await uploadImage(formData);
    setImage(image);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: {
      "image/jepg": [".jpg"],
      "image/png": [".png"],
    },
    onDrop,
    maxFiles: 1,
  });

  return (
    <>
      <div className="space-y-1">
        <label className="block  font-medium leading-6 text-gray-900">
          Imagen Producto
        </label>
        <div
          {...getRootProps({
            className: `
                py-20 border-2 border-dashed  text-center rounded-lg
                ${isDragActive ? "border-gray-900 text-gray-900 bg-gray-200 " : "border-gray-400 text-gray-400 bg-white"}
                ${isDragReject ? "border-none bg-white" : "cursor-not-allowed"}
            `,
          })}
        >
          <input {...getInputProps()} />
          {isDragAccept && <p>Suelta la Imagen</p>}
          {isDragReject && <p>Archivo no válido</p>}
          {!isDragActive && <p>Arrastra y suelta una imagen aquí</p>}
        </div>
      </div>
      {currentImage && !image && (
        <div className="py-5 space-y-3">
          <p className="font-bold">Imagen Actual: </p>
          <div className="w-50 h-50 relative">
            <Image
              src={getImagePath(currentImage)}
              alt="Imagen publicada"
              className="object-cover"
              fill
              unoptimized
            />
          </div>
        </div>
      )}

      {image && (
        <div className="py-5 space-y-3">
          <p className="font-bold">Imagen Producto: </p>
          <div className="w-50 h-50 relative">
            <Image
              src={image}
              alt="Imagen publicada"
              className="object-cover"
              fill
            />
          </div>
        </div>
      )}

      <input
        type="hidden"
        name="image"
        defaultValue={image ? image : currentImage}
      />
    </>
  );
}
