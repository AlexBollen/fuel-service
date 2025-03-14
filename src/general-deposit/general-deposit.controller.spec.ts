import { Test, TestingModule } from '@nestjs/testing';
import { GeneralDepositController } from './general-deposit.controller';
import { GeneralDepositService } from './general-deposit.service';

describe('GeneralDepositController', () => {
  let controller: GeneralDepositController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeneralDepositController],
      providers: [GeneralDepositService],
    }).compile();

    controller = module.get<GeneralDepositController>(GeneralDepositController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
