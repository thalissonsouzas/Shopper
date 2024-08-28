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
    return await this.measureModel.find({ customer_code: customer });
  }

  async create(body: Measure) {
    // Validação básica dos dados fornecidos no corpo da requisição
    if (!body.customer_code || !body.measure_datetime || !body.measure_type) {
      throw new BadRequestException({
        error_code: 'INVALID_DATA',
        error_description:'Os dados fornecidos no corpo da requisição são inválidos',
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
        { measure_type: body.measure_type },
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
}
