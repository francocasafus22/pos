import { IsIn, IsNumberString, IsOptional } from 'class-validator';
export class GetCategoryQueryDto {
  @IsOptional()
  @IsIn(['true', 'false'], { message: 'Show Products debe ser true o false' })
  showProducts: string;

  @IsOptional()
  @IsNumberString({}, { message: 'La cantidad debe ser un número' })
  take: number;

  @IsOptional()
  @IsNumberString({}, { message: 'La página debe ser un número' })
  page: number;
}
