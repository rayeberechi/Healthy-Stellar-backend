import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diagnosis } from './entities/diagnosis.entity';
import { DiagnosisHistory } from './entities/diagnosis-history.entity';
import { DiagnosisService } from './services/diagnosis.service';
import { DiagnosisController } from './controllers/diagnosis.controller';
import { BillingModule } from '../billing/billing.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Diagnosis, DiagnosisHistory]),
    BillingModule, // For MedicalCodeService
  ],
  controllers: [DiagnosisController],
  providers: [DiagnosisService],
  exports: [DiagnosisService],
})
export class DiagnosisModule {}
