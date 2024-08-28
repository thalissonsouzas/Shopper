import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Measure } from 'src/schemas/measures.schema';

@Injectable()
export class MeasureService {
  constructor(
    @InjectModel(Measure.name) private measureModel: Model<Measure>,
  ) {}

  async listMeasuresByCustomer(customer: string) {
    const response = await this.measureModel
      .find({ customer_code: customer })
      .select(
        'measure_uuid measure_datatime measure_type measure_value image_url -_id',
      );
    return {
      customer_code: customer,
      measures: response,
    };
  }

  async create(body: Measure) {
    // Validação básica dos dados fornecidos no corpo da requisição
    if (!body.customer_code || !body.measure_datetime || !body.measure_type) {
      throw new BadRequestException({
        error_code: 'INVALID_DATA',
        error_description:'Os dados fornecidos no corpo da requisição são inválidos',
      });
    }

    if (
      body.measure_type.toUpperCase() !== 'GAS' &&
      body.measure_type.toUpperCase() !== 'WATER'
    ) {
      throw new BadRequestException({
        error_code: 'INVALID_DATA',
        error_description: 'Tipo de medida inválido',
      });
    }

    const hasAnotherMeasure = await this.measureModel.findOne({
      $and: [
        {
          $expr: {
            $and: [
              {
                $eq: [
                  { $month: '$measure_datetime' },
                  { $month: new Date(body.measure_datetime) },
                ],
              },
              {
                $eq: [
                  { $year: '$measure_datetime' },
                  { $year: new Date(body.measure_datetime) },
                ],
              },
            ],
          },
        },
        { customer_code: body.customer_code },
        { measure_type: body.measure_type.toUpperCase() },
      ],
    });

    if (hasAnotherMeasure) {
      throw new ConflictException({
        error_code: 'DOUBLE_REPORT',
        error_description: 'Leitura do mês já realizada',
      });
    }

    await this.measureModel.create(body);
    return { message: 'Measure created successfully', status: 200 };
  }

  async confirmMeasure(body: any) {
    const hasMeasure = await this.measureModel.findOne({
      measure_uuid: body.measure_uuid,
    });

    if (hasMeasure === null) {
      throw new BadRequestException({
        error_code: 'INVALID_DATA',
        error_description: 'Leitura não encontrada',
      });
    }

    console.log(body, hasMeasure);

    await this.measureModel.updateMany(
      { measure_uuid: body.measure_uuid },
      { $set: { measure_value: body.confirmed_value, has_confirmed: true } },
    );

    return { sucess: true };
  }
}
