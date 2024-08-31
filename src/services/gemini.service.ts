import { GoogleGenerativeAI, Part } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeminiService {
  private generationConfig = {
    temperature: 0.5,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };
  private model: any;

  constructor(private config: ConfigService) {
    const genAI = new GoogleGenerativeAI(this.config.get('GEMINI_API_KEY'));
    this.model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: this.generationConfig,
    });
  }

  async generateContent(base64: string) {
    const parts = [
      {
        text: 'essa é uma foto de leitura de conta de energia, agua ou gás, me informe somente os numeros do consumo, nunca me informe mais de um numero, na dǘvida ou quando não encontrar, me envie 0000',
      },
      {
        inlineData: {
          mimeType: 'image/jpg',
          data: base64,
        },
      },
    ];

    const data: any = await this.model.generateContent({
      contents: [{ role: 'user', parts: parts as Part[] }],
    });
    const result = data.response;
    const text = result.text();
    const valueParsed = text.replace(/\D/gm, '');

    return valueParsed;
  }
}
