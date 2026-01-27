import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum TemplateStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

@Entity('care_plan_templates')
@Index(['status'])
export class CarePlanTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: TemplateStatus,
    default: TemplateStatus.DRAFT,
  })
  status: TemplateStatus;

  // Associated ICD-10 diagnosis codes
  @Column({ type: 'simple-array', nullable: true })
  icd10Codes: string[];

  @Column({ type: 'varchar', length: 100, nullable: true })
  specialty: string;

  @Column({ type: 'jsonb', nullable: true })
  goals: {
    description: string;
    targetDays?: number;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  objectives: {
    description: string;
    priority: 'high' | 'medium' | 'low';
  }[];

  @Column({ type: 'jsonb', nullable: true })
  interventions: {
    type: string;
    description: string;
    frequency?: string;
    duration?: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration?: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  customizableFields: {
    fieldName: string;
    fieldType: 'text' | 'number' | 'date' | 'select';
    options?: string[];
    required: boolean;
  }[];

  @Column({ type: 'text', nullable: true })
  patientEducation: string;

  @Column({ type: 'text', nullable: true })
  specialInstructions: string;

  @Column({ type: 'int', default: 0 })
  usageCount: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'uuid', nullable: true })
  createdBy: string;

  @Column({ type: 'uuid', nullable: true })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
