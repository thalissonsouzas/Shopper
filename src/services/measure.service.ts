import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Measure } from 'src/schemas/measures.schema';

@Injectable()
export class MeasureService {
  constructor(
    @InjectModel(Measure.name) private measureModel: Model<Measure>,
  ) {}

  async listMeasuresByCustomer(customer: string, measure_type?: string) {
    if (measure_type) {
      if (
        measure_type.toUpperCase() !== 'GAS' &&
        measure_type.toUpperCase() !== 'WATER'
      ) {
        throw new BadRequestException({
          error_code: 'INVALID_TYPE',
          error_description: 'Tipo de medição não permitida',
        });
      }
      const response = await this.measureModel
        .find({
          customer_code: customer,
          measure_type: measure_type.toUpperCase(),
        })
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
    const response = await this.measureModel
      .find({ customer_code: customer })
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
    if (!body.measure_uuid || !body.confirmed_value) {
      throw new BadRequestException({
        error_code: 'INVALID_DATA',
        error_description: 'É necessário informar measure_uuid e confirmed_value',
      });
    }

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
