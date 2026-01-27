import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TreatmentOutcome } from '../entities/treatment-outcome.entity';
import {
  CreateTreatmentOutcomeDto,
  UpdateTreatmentOutcomeDto,
} from '../dto/treatment-planning.dto';

@Injectable()
export class TreatmentOutcomeService {
  constructor(
    @InjectRepository(TreatmentOutcome)
    private readonly outcomeRepository: Repository<TreatmentOutcome>,
  ) {}

  async create(createDto: CreateTreatmentOutcomeDto): Promise<TreatmentOutcome> {
    const outcome = this.outcomeRepository.create(createDto);
    return await this.outcomeRepository.save(outcome);
  }

  async findById(id: string): Promise<TreatmentOutcome> {
    const outcome = await this.outcomeRepository.findOne({
      where: { id },
      relations: ['treatmentPlan'],
    });

    if (!outcome) {
      throw new NotFoundException(`Treatment outcome with ID ${id} not found`);
    }

    return outcome;
  }

  async findByTreatmentPlanId(treatmentPlanId: string): Promise<TreatmentOutcome[]> {
    return await this.outcomeRepository.find({
      where: { treatmentPlanId },
      order: { recordedDate: 'DESC' },
    });
  }

  async findByPatientId(patientId: string): Promise<TreatmentOutcome[]> {
    return await this.outcomeRepository.find({
      where: { patientId },
      order: { recordedDate: 'DESC' },
    });
  }

  async update(id: string, updateDto: UpdateTreatmentOutcomeDto): Promise<TreatmentOutcome> {
    const outcome = await this.findById(id);
    Object.assign(outcome, updateDto);
    return await this.outcomeRepository.save(outcome);
  }

  async delete(id: string): Promise<void> {
    const outcome = await this.findById(id);
    await this.outcomeRepository.remove(outcome);
  }

  async getAnalytics(patientId?: string, startDate?: Date, endDate?: Date): Promise<any> {
    const queryBuilder = this.outcomeRepository
      .createQueryBuilder('outcome')
      .select('AVG(outcome.qualityOfLifeScore)', 'avgQualityOfLife')
      .addSelect('AVG(outcome.painScore)', 'avgPainScore')
      .addSelect('AVG(outcome.functionalStatusScore)', 'avgFunctionalStatus')
      .addSelect('COUNT(*)', 'totalOutcomes')
      .addSelect(
        'SUM(CASE WHEN outcome.goalsAchieved = true THEN 1 ELSE 0 END)',
        'goalsAchievedCount',
      )
      .addSelect(
        'SUM(CASE WHEN outcome.treatmentEffective = true THEN 1 ELSE 0 END)',
        'effectiveTreatmentCount',
      );

    if (patientId) {
      queryBuilder.where('outcome.patientId = :patientId', { patientId });
    }

    if (startDate) {
      queryBuilder.andWhere('outcome.recordedDate >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('outcome.recordedDate <= :endDate', { endDate });
    }

    const result = await queryBuilder.getRawOne();

    return {
      averageQualityOfLife: parseFloat(result.avgQualityOfLife) || 0,
      averagePainScore: parseFloat(result.avgPainScore) || 0,
      averageFunctionalStatus: parseFloat(result.avgFunctionalStatus) || 0,
      totalOutcomes: parseInt(result.totalOutcomes) || 0,
      goalsAchievedCount: parseInt(result.goalsAchievedCount) || 0,
      effectiveTreatmentCount: parseInt(result.effectiveTreatmentCount) || 0,
      goalsAchievedRate:
        result.totalOutcomes > 0
          ? (parseInt(result.goalsAchievedCount) / parseInt(result.totalOutcomes)) * 100
          : 0,
      treatmentEffectivenessRate:
        result.totalOutcomes > 0
          ? (parseInt(result.effectiveTreatmentCount) / parseInt(result.totalOutcomes)) * 100
          : 0,
    };
  }
}
