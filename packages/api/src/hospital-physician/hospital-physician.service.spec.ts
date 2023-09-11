import { Test, TestingModule } from '@nestjs/testing';
import { HospitalPhysicianService } from './hospital-physician.service';

describe('HospitalPhysicianService', () => {
  let service: HospitalPhysicianService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HospitalPhysicianService],
    }).compile();

    service = module.get<HospitalPhysicianService>(HospitalPhysicianService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
