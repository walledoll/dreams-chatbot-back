import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiService {
    private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('API_KEY'),
      baseURL: "https://openai.api.proxyapi.ru/v1"
    });
  }

  async generateInterpretation(prompt: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o', // или 'gpt-3.5-turbo'
        messages: [
          {
            role: 'system',
            content: 'Ты — психолог-сонник. Ты даёшь глубокие, эмпатичные интерпретации снов, основанные на современной психологии, без эзотерики, предсказаний и архетипов.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 500,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      return completion.choices[0].message.content?.trim() || '';
    } catch (error) {
      console.error('OpenAI error:', error);
      throw new Error('Не удалось получить интерпретацию. Попробуйте позже.');
    }
  }

   async *streamCompletion(prompt: string): AsyncGenerator<string> {
    const stream = this.openai.chat.completions.stream({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'Ты — психолог-сонник. Ты даёшь глубокие, эмпатичные интерпретации снов, основанные на современной психологии, без эзотерики, предсказаний и архетипов.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) yield content;
    }
  }
}
