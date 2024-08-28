import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { generateContent } from 'src/gemini';
import { MeasureService } from 'src/services/measure.service';
import { v4 as uuid } from 'uuid';

@Controller()
export class MeasureController {
  constructor(private readonly measureService: MeasureService) {}
  @Get('/')
  getHello(): string {
    return 'Hello World! hihihihihih';
  }

  @Get('/:customer/list')
  async getMeasuresByCustomer(@Param('customer') customer: string, @Query('measure_type') measure_type: string) {
    return await this.measureService.listMeasuresByCustomer(customer, measure_type);
  }

  @Post('/upload')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    const base64 = file.buffer.toString('base64');

    const id = uuid();

    // todo: get measure value from Gemini.
    const measure_value = await generateContent(base64);

    return await this.measureService.create({
      customer_code: body.customer_code,
      image_url: 'link imagem',
      // image_url: `data:${file.mimetype};charset=${file.encoding};base64,${base64}`,
      measure_type: body.measure_type,
      measure_datetime: body.measure_datetime,
      measure_uuid: id,
      measure_value: measure_value,
      has_confirmed: false,
    });
  }

  @Patch('/confirm')
  @HttpCode(200)
  confirmMeasure(@Body() body: any) {
    return this.measureService.confirmMeasure(body);
  }
}
