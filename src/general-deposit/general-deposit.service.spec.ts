import { Test, TestingModule } from '@nestjs/testing';
import { GeneralDepositService } from './general-deposit.service';

describe('GeneralDepositService', () => {
  let service: GeneralDepositService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeneralDepositService],
    }).compile();

    service = module.get<GeneralDepositService>(GeneralDepositService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
