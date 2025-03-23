import { PartialType } from '@nestjs/swagger';
import { CreateGeneralDepositDto } from './create-general-deposit.dto';

export class UpdateGeneralDepositDto extends PartialType(CreateGeneralDepositDto) {}
