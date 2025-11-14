import { Controller } from '@nestjs/common';
import { DreamsService } from './dreams.service';

@Controller('dreams')
export class DreamsController {
  constructor(private readonly dreamsService: DreamsService) {}
}
