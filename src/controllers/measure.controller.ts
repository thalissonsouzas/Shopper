import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseEnumPipe,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ConfirmMeasureDto } from 'src/dto/confirm-measure.dto';
import { UploadMeasureDto } from 'src/dto/upload-measure.dto';
import { v4 as uuid } from 'uuid';
import { GeminiService } from '../services/gemini.service';
import { MeasureService } from '../services/measure.service';
import { MeasureType } from '../types/measure-type.enum';
import { deleteFile, getFileStream, uploadFile } from '../util/upload-file';

@Controller()
export class MeasureController {
  constructor(
    private readonly measureService: MeasureService,
    private geminiService: GeminiService,
  ) {}

  @Get('/')
  getHello(): string {
    return 'Hello World! ';
  }

  @Get('/:customer/list')
  async getMeasuresByCustomer(
    @Param('customer') customer: string,
    @Query('measure_type', new ParseEnumPipe(MeasureType, { optional: true }))
    measure_type?: MeasureType,
  ) {
    return await this.measureService.listMeasuresByCustomer(
      customer,
      measure_type,
    );
  }

  @Get('/media/:fileName')
  async getMedia(@Param('fileName') fileName: string, @Res() res: Response) {
    const file = await getFileStream(fileName);

    file.pipe(res);
  }

  @Post('/upload')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadMeasureDto,
  ) {
    const base64 = file.buffer.toString('base64');
    const id = uuid();

    const fileUrl = await uploadFile(id, file);
    const measure_value = await this.geminiService.generateContent(base64);

    try {
      return await this.measureService.create({
        customer_code: body.customer_code,
        image_url: `http://localhost:3000/media/${fileUrl}`,
        measure_type: body.measure_type,
        measure_datetime: new Date(body.measure_datetime),
        measure_uuid: id,
        measure_value: measure_value,
        has_confirmed: false,
      });
    } catch (e) {
      deleteFile(fileUrl);

      throw e;
    }
  }

  @Patch('/confirm')
  @HttpCode(200)
  confirmMeasure(@Body() body: ConfirmMeasureDto) {
    return this.measureService.confirmMeasure(body);
  }
}
