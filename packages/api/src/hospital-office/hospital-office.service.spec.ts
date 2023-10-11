import { Test, TestingModule } from '@nestjs/testing';
import { HospitalOfficeService } from './hospital-office.service';

describe('HospitalOfficeService', () => {
  let service: HospitalOfficeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HospitalOfficeService],
    }).compile();

    service = module.get<HospitalOfficeService>(HospitalOfficeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
