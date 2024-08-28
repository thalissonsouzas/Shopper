import { GoogleGenerativeAI, Part } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyAUu-o17IJ7181e6Rcli0OHYwdjc2KPTck');

const generationConfig = {
  temperature: 0.5,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig,
});

async function generateContent(base64: string) {
//   const imagepath = 'src/relogio.jpg';
//   const imagedata = await fs.readFile(imagepath);
//   const imageformat = imagedata.toString('base64');

  const parts = [
    { text: 'me retorne uma string com o valor da medição do relógio' },
    {
      inlineData: {
        mimeType: 'image/jpg',
        data: base64,
      },
    },
  ];

  const data: any = await model.generateContent({
    contents: [{ role: 'user', parts: parts as Part[] }],
  });
  const result = data.response;
  const text = result.text();
  console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', text);
  return text;
}

export { generateContent };
