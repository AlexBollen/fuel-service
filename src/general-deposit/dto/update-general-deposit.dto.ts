import { PartialType } from '@nestjs/mapped-types';
import { CreateGeneralDepositDto } from './create-general-deposit.dto';

export class UpdateGeneralDepositDto extends PartialType(CreateGeneralDepositDto) {
  id: number;
}
