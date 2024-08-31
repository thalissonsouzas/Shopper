import { IsInt, IsNotEmpty, IsUUID } from 'class-validator';

export class ConfirmMeasureDto {
  @IsUUID()
  @IsNotEmpty()
  measure_uuid: string;

  @IsInt()
  @IsNotEmpty()
  confirmed_value: number;
}
