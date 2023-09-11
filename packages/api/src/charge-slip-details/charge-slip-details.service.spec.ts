import { Test, TestingModule } from '@nestjs/testing';
import { ChargeSlipDetailsService } from './charge-slip-details.service';

describe('ChargeSlipDetailsService', () => {
  let service: ChargeSlipDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChargeSlipDetailsService],
    }).compile();

    service = module.get<ChargeSlipDetailsService>(ChargeSlipDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
