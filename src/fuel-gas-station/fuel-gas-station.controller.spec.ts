import { Test, TestingModule } from '@nestjs/testing';
import { FuelGasStationController } from './fuel-gas-station.controller';
import { FuelGasStationService } from './fuel-gas-station.service';

describe('FuelGasStationController', () => {
  let controller: FuelGasStationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FuelGasStationController],
      providers: [FuelGasStationService],
    }).compile();

    controller = module.get<FuelGasStationController>(FuelGasStationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
