import { PartialType } from '@nestjs/swagger';
import { CreateBombDto } from './create-bomb.dto';

export class UpdateBombDto extends PartialType(CreateBombDto) {}
