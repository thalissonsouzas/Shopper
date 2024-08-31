import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { MeasureType } from 'src/types/measure-type.enum';

export class UploadMeasureDto {
  @IsString()
  @IsNotEmpty()
  customer_code: string;

  @IsString()
  measure_datetime: string;

  @IsEnum(MeasureType)
  @IsNotEmpty()
  measure_type: MeasureType;
}
