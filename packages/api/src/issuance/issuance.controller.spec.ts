import { Test, TestingModule } from '@nestjs/testing';
import { IssuanceController } from './issuance.controller';
import { IssuanceService } from './issuance.service';

describe('IssuanceController', () => {
  let controller: IssuanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IssuanceController],
      providers: [IssuanceService],
    }).compile();

    controller = module.get<IssuanceController>(IssuanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
