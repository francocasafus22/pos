import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'Nombre no válido' })
  name: string;

  @IsNotEmpty({ message: 'La imagen es obligatoria' })
  @IsString({ message: 'Imagen no válido' })
  image: string;

  @IsNotEmpty({ message: 'El precio es obligatorio' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Precio no válido' })
  price: number;

  @IsNotEmpty({ message: 'La cantidad es obligatoria' })
  @IsNumber({ maxDecimalPlaces: 0 }, { message: 'Cantidad no válida' })
  inventory: number;

  @IsNotEmpty({ message: 'La categoria es obligatoria' })
  @IsInt({ message: 'La categoria no es válida' })
  categoryId: number;
}
