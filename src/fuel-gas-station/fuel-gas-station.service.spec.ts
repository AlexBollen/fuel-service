import { Test, TestingModule } from '@nestjs/testing';
import { FuelGasStationService } from './fuel-gas-station.service';

describe('FuelGasStationService', () => {
  let service: FuelGasStationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FuelGasStationService],
    }).compile();

    service = module.get<FuelGasStationService>(FuelGasStationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
