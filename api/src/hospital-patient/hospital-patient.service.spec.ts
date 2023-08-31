import { Test, TestingModule } from '@nestjs/testing';
import { HospitalPatientService } from './hospital-patient.service';

describe('HospitalPatientService', () => {
  let service: HospitalPatientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HospitalPatientService],
    }).compile();

    service = module.get<HospitalPatientService>(HospitalPatientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
