import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpException, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { DreamsService } from './dreams.service';
import { CreateDreamDto } from './dto/create-dream.dto';
import { UpdateDreamDto } from './dto/update-dream.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('dreams')
export class DreamsController {
  dreamService: any;
  constructor(private readonly dreamsService: DreamsService) {}

  @Post()
  create(@Body() createDreamDto: CreateDreamDto, @Req() req,) {
    return this.dreamsService.create(createDreamDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.dreamsService.findAll();
  }

  @Post('interpret')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async interpretDream(@Body() createDreamDto: CreateDreamDto, @Req() req) {
    const { dreamText } = createDreamDto;
    const userId = req.user.id;

    if (!userId || !dreamText) {
      throw new HttpException(
        'userId и dreamText обязательны',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      // Генерируем интерпретацию через LLM
      const interpretation = await this.dreamService.createInterpretation(
        userId,
        dreamText,
      );

      // Сохраняем сон + интерпретацию в БД
      const dream = await this.dreamService.create({
        userId,
        dreamText,
        interpretation,
      });

      return {
        success: true,
        dreamId: dream.id,
        interpretation,
      };
    } catch (error) {
      console.error('Ошибка интерпретации:', error);
      throw new HttpException(
        error.message || 'Не удалось обработать сон',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
