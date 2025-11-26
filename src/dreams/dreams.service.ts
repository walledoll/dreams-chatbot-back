import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDreamDto } from './dto/create-dream.dto';
import { UpdateDreamDto } from './dto/update-dream.dto';
import { PrismaService } from 'prisma/prisma.service';
import { AiService } from 'src/ai/ai.service';

@Injectable()
export class DreamsService {
  constructor(private prisma: PrismaService, private ai: AiService){}
  create(createDreamDto: CreateDreamDto, userId: string) {
    return this.prisma.dream.create({
      data: {
        dreamText: createDreamDto.dreamText,
        interpretation: createDreamDto.interpretation,
        userId,
      }
    });
  }

  findAll() {
    return this.prisma.dream.findMany();
  }

  async createInterpretation(dreamText: string, userId?: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const pastDreams = await this.prisma.dream.findMany({
      where: { userId },
      take: 2,
      orderBy: { createdAt: 'desc' },
    });
    if(!user)
      throw new NotFoundException();

    const age = user.birthDate
      ? new Date().getFullYear() - new Date(user.birthDate).getFullYear()
      : null;

    const context = pastDreams
      .map(d => `Сон: ${d.dreamText}\nИнтерпретация: ${d.interpretation || '—'}`)
      .join('\n---\n');

    const prompt = userId ? `
      Имя пользователя: ${user.name || 'друг'}
      ${age ? `Возраст: ${age} лет` : ''}

      Контекст прошлых снов:
      ${context || 'Нет предыдущих снов'}

      Текущий сон:
      "${dreamText}"

      Дай тёплую, психологическую интерпретацию: переформулируй сон, предложи 2–3 смысла, задай вопрос для рефлексии, заверши поддержкой. Не используй эзотерику.
    `:
    `
      Ты — дружелюбный психолог-сонник.
      Пользователь прислал сон:
      "${dreamText}"

      Дай тёплую, поддерживающую интерпретацию:
      - Переформулируй сон
      - Предложи 2–3 возможных смысла
      - Задай 1–2 вопроса для рефлексии
      - Заверши словами поддержки

      Не используй эзотерику, магию или предсказания.
    `;

    return this.ai.generateInterpretation(prompt);
  }

  async *streamInterpretation(dreamText: string, userId?: string): AsyncGenerator<string> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const pastDreams = await this.prisma.dream.findMany({
      where: { userId },
      take: 2,
      orderBy: { createdAt: 'desc' },
    });

    const age = user?.birthDate
      ? new Date().getFullYear() - new Date(user.birthDate).getFullYear()
      : null;

    const context = pastDreams
      .map(d => `Сон: ${d.dreamText}\nИнтерпретация: ${d.interpretation || '—'}`)
      .join('\n---\n');

    if(!user)
      throw new NotFoundException();

    const prompt = userId ? `
      Имя пользователя: ${user.name || 'друг'}
      ${age ? `Возраст: ${age} лет` : ''}

      Контекст прошлых снов:
      ${context || 'Нет предыдущих снов'}

      Текущий сон:
      "${dreamText}"

      Дай тёплую, психологическую интерпретацию: переформулируй сон, предложи 2–3 смысла, задай вопрос для рефлексии, заверши поддержкой. Не используй эзотерику.
    `:
    `
      Ты — дружелюбный психолог-сонник.
      Пользователь прислал сон:
      "${dreamText}"

      Дай тёплую, поддерживающую интерпретацию:
      - Переформулируй сон
      - Предложи 2–3 возможных смысла
      - Задай 1–2 вопроса для рефлексии
      - Заверши словами поддержки

      Не используй эзотерику, магию или предсказания.
    `;

    // Используем streaming от OpenAI
    const stream = await this.ai.streamCompletion(prompt);
    yield* stream;
  }
}
