import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarePlanTemplate } from '../entities/care-plan-template.entity';
import { TreatmentPlan } from '../entities/treatment-plan.entity';
import {
  CreateCarePlanTemplateDto,
  UpdateCarePlanTemplateDto,
  ApplyTemplateDto,
  CreateTreatmentPlanDto,
} from '../dto/treatment-planning.dto';
import { TreatmentPlanService } from './treatment-plan.service';

@Injectable()
export class CarePlanTemplateService {
  constructor(
    @InjectRepository(CarePlanTemplate)
    private readonly templateRepository: Repository<CarePlanTemplate>,
    private readonly treatmentPlanService: TreatmentPlanService,
  ) {}

  async create(createDto: CreateCarePlanTemplateDto): Promise<CarePlanTemplate> {
    const template = this.templateRepository.create(createDto);
    return await this.templateRepository.save(template);
  }

  async findById(id: string): Promise<CarePlanTemplate> {
    const template = await this.templateRepository.findOne({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException(`Care plan template with ID ${id} not found`);
    }

    return template;
  }

  async findAll(): Promise<CarePlanTemplate[]> {
    return await this.templateRepository.find({
      where: { status: 'active' as any },
      order: { name: 'ASC' },
    });
  }

  async findByIcd10Code(icd10Code: string): Promise<CarePlanTemplate[]> {
    return await this.templateRepository
      .createQueryBuilder('template')
      .where(':code = ANY(template.icd10Codes)', { code: icd10Code })
      .andWhere('template.status = :status', { status: 'active' })
      .getMany();
  }

  async update(id: string, updateDto: UpdateCarePlanTemplateDto): Promise<CarePlanTemplate> {
    const template = await this.findById(id);
    Object.assign(template, updateDto);
    return await this.templateRepository.save(template);
  }

  async delete(id: string): Promise<void> {
    const template = await this.findById(id);
    await this.templateRepository.remove(template);
  }

  async applyTemplate(applyDto: ApplyTemplateDto): Promise<TreatmentPlan> {
    const template = await this.findById(applyDto.templateId);

    // Create treatment plan from template
    const treatmentPlanDto: CreateTreatmentPlanDto = {
      patientId: applyDto.patientId,
      title: template.name,
      description: template.description,
      goals: template.goals,
      objectives: template.objectives,
      interventions: template.interventions,
      medications: template.medications,
      patientEducation: template.patientEducation,
      specialInstructions: template.specialInstructions,
      startDate: new Date().toISOString(),
      createdBy: applyDto.createdBy,
    };

    // Apply customizations if provided
    if (applyDto.customizations) {
      Object.assign(treatmentPlanDto, applyDto.customizations);
    }

    // Increment usage count
    template.usageCount += 1;
    await this.templateRepository.save(template);

    return await this.treatmentPlanService.create(treatmentPlanDto);
  }
}
