import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
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
}

export class CreateTransactionDto {
  @IsOptional()
  coupon: string;

  @IsArray()
  @ArrayNotEmpty({ message: 'Los contenidos no pueden ir vacios' })
  @ValidateNested()
  @Type(() => TransactionContentsDto)
  contents: TransactionContentsDto[];
}
