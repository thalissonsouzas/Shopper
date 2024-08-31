import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MeasureType } from 'src/types/measure-type.enum';
import { Measure } from '../schemas/measures.schema';

@Injectable()
export class MeasureService {
  constructor(
    @InjectModel(Measure.name) private measureModel: Model<Measure>,
  ) {}

  async listMeasuresByCustomer(customer: string, measure_type?: MeasureType) {
    const filter: Record<string, any> = { customer_code: customer };
    if (measure_type) {
      filter['measure_type'] = measure_type;
    }

    const response = await this.measureModel
      .find(filter)
      .select(
        'measure_uuid measure_datetime measure_type has_confirmed image_url -_id',
      );

    if (response.length === 0) {
      throw new NotFoundException({
        error_code: 'MEASURES_NOT_FOUND',
        error_description: 'Nenhuma leitura encontrada',
      });
    }

    return {
      customer_code: customer,
      measures: response,
    };
  }

  async create(body: Measure) {
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

    return {
      image_url: body.image_url,
      measure_value: body.measure_value,
      measure_uuid: body.measure_uuid,
    };
  }

  async confirmMeasure(body: any) {
    const hasMeasure = await this.measureModel.findOne({
      measure_uuid: body.measure_uuid,
    });

    if (hasMeasure === null) {
      throw new NotFoundException({
        error_code: 'INVALID_DATA',
        error_description: 'Leitura não encontrada',
      });
    }

    if (hasMeasure.has_confirmed) {
      throw new ConflictException({
        error_code: 'CONFIRMATION_DUPLICATE',
        error_description: 'Leitura do mês já realizada',
      });
    }

    await this.measureModel.updateMany(
      { measure_uuid: body.measure_uuid },
      { $set: { measure_value: body.confirmed_value, has_confirmed: true } },
    );

    return { sucess: true };
  }
}
