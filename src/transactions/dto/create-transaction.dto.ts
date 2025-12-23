import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class TransactionContentsDto {
  @IsNotEmpty({ message: 'El ID del producto es obligatorio' })
  @IsInt({ message: 'Producto no válido' })
  productId: number;

  @IsNotEmpty({ message: 'La cantidad es obligatoria' })
  @IsInt({ message: 'Cantidad no válido' })
  quantity: number;

  @IsNotEmpty({ message: 'El precio es obligatorio' })
  @IsNumber({}, { message: 'Precio no válido' })
  price: number;
}

export class CreateTransactionDto {
  @IsNotEmpty({ message: 'El total es obligatorio' })
  @IsNumber({}, { message: 'Total no válido' })
  total: number;

  @IsOptional()
  coupon: string;

  @IsArray()
  @ArrayNotEmpty({ message: 'Los contenidos no pueden ir vacios' })
  @ValidateNested()
  @Type(() => TransactionContentsDto)
  contents: TransactionContentsDto[];
}
