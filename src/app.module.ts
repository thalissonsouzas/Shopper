import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MeasureController } from './controllers/measure.controller';
import { Measure, MeasureSchema } from './schemas/measures.schema';
import { GeminiService } from './services/gemini.service';
import { MeasureService } from './services/measure.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.getOrThrow('MONGO_URL'),
      }),
    }),
    MongooseModule.forFeature([{ name: Measure.name, schema: MeasureSchema }]),
  ],
  controllers: [MeasureController],
  providers: [MeasureService, GeminiService],
})
export class AppModule {}
