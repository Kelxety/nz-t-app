import { Test, TestingModule } from '@nestjs/testing';
import { HospitalPatientTypeService } from './hospital-patient-type.service';

describe('HospitalPatientTypeService', () => {
  let service: HospitalPatientTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HospitalPatientTypeService],
    }).compile();

    service = module.get<HospitalPatientTypeService>(
      HospitalPatientTypeService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
