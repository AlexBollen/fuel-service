import { Test, TestingModule } from '@nestjs/testing';
import { FuelTypesService } from './fuel-types.service';

describe('FuelTypesService', () => {
  let service: FuelTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FuelTypesService],
    }).compile();

    service = module.get<FuelTypesService>(FuelTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
