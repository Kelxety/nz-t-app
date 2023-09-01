import { Test, TestingModule } from '@nestjs/testing';
import { HospitalPatientController } from './hospital-patient.controller';
import { HospitalPatientService } from './hospital-patient.service';

describe('HospitalPatientController', () => {
  let controller: HospitalPatientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HospitalPatientController],
      providers: [HospitalPatientService],
    }).compile();

    controller = module.get<HospitalPatientController>(
      HospitalPatientController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
