import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { TreatmentPlan } from '../entities/treatment-plan.entity';
import { TreatmentPlanVersion } from '../entities/treatment-plan-version.entity';
import { CreateTreatmentPlanDto, UpdateTreatmentPlanDto } from '../dto/treatment-planning.dto';
import { TreatmentPlanStatus } from '../../common/enums';

@Injectable()
export class TreatmentPlanService {
  constructor(
    @InjectRepository(TreatmentPlan)
    private readonly treatmentPlanRepository: Repository<TreatmentPlan>,
    @InjectRepository(TreatmentPlanVersion)
    private readonly versionRepository: Repository<TreatmentPlanVersion>,
  ) {}

  async create(createDto: CreateTreatmentPlanDto): Promise<TreatmentPlan> {
    const plan = this.treatmentPlanRepository.create(createDto);
    const savedPlan = await this.treatmentPlanRepository.save(plan);

    // Create initial version
    await this.createVersion(savedPlan, 'Initial plan created', createDto.createdBy);

    return savedPlan;
  }

  async findById(id: string): Promise<TreatmentPlan> {
    const plan = await this.treatmentPlanRepository.findOne({
      where: { id },
      relations: ['procedures', 'outcomes', 'versions'],
    });

    if (!plan) {
      throw new NotFoundException(`Treatment plan with ID ${id} not found`);
    }

    return plan;
  }

  async findByPatientId(patientId: string): Promise<TreatmentPlan[]> {
    return await this.treatmentPlanRepository.find({
      where: { patientId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateDto: UpdateTreatmentPlanDto): Promise<TreatmentPlan> {
    const plan = await this.findById(id);

    // Create new version before updating
    if (updateDto.changeNotes || this.hasSignificantChanges(updateDto)) {
      plan.version += 1;
      await this.createVersion(plan, updateDto.changeNotes, updateDto.updatedBy);
    }

    Object.assign(plan, updateDto);
    return await this.treatmentPlanRepository.save(plan);
  }

  async updateStatus(
    id: string,
    status: TreatmentPlanStatus,
    updatedBy?: string,
  ): Promise<TreatmentPlan> {
    const plan = await this.findById(id);
    plan.status = status;
    plan.updatedBy = updatedBy;

    if (status === TreatmentPlanStatus.COMPLETED) {
      plan.completedDate = new Date();
    }

    return await this.treatmentPlanRepository.save(plan);
  }

  async delete(id: string): Promise<void> {
    const plan = await this.findById(id);
    await this.treatmentPlanRepository.remove(plan);
  }

  async getActivePlans(patientId: string): Promise<TreatmentPlan[]> {
    return await this.treatmentPlanRepository.find({
      where: {
        patientId,
        status: TreatmentPlanStatus.ACTIVE,
      },
      order: { startDate: 'DESC' },
    });
  }

  async getVersionHistory(planId: string): Promise<TreatmentPlanVersion[]> {
    return await this.versionRepository.find({
      where: { treatmentPlanId: planId },
      order: { version: 'DESC' },
    });
  }

  private async createVersion(
    plan: TreatmentPlan,
    changeNotes?: string,
    createdBy?: string,
  ): Promise<TreatmentPlanVersion> {
    const snapshot = {
      title: plan.title,
      description: plan.description,
      status: plan.status,
      diagnosisIds: plan.diagnosisIds,
      goals: plan.goals,
      objectives: plan.objectives,
      interventions: plan.interventions,
      medications: plan.medications,
      reviewSchedule: plan.reviewSchedule,
      specialInstructions: plan.specialInstructions,
      patientEducation: plan.patientEducation,
    };

    const version = this.versionRepository.create({
      treatmentPlanId: plan.id,
      version: plan.version,
      snapshot,
      changeNotes,
      createdBy,
    });

    return await this.versionRepository.save(version);
  }

  private hasSignificantChanges(updateDto: UpdateTreatmentPlanDto): boolean {
    return !!(
      updateDto.goals ||
      updateDto.objectives ||
      updateDto.interventions ||
      updateDto.medications ||
      updateDto.status
    );
  }
}
