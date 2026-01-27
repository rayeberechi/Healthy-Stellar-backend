import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
  Index,
  JoinTable,
} from 'typeorm';
import { TreatmentPlanStatus } from '../../common/enums';
import { TreatmentPlanVersion } from './treatment-plan-version.entity';
import { MedicalProcedure } from './medical-procedure.entity';
import { TreatmentOutcome } from './treatment-outcome.entity';

@Entity('treatment_plans')
@Index(['patientId', 'status'])
@Index(['startDate'])
export class TreatmentPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  patientId: string;

  @Column({ type: 'uuid', nullable: true })
  primaryProviderId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: TreatmentPlanStatus,
    default: TreatmentPlanStatus.DRAFT,
  })
  status: TreatmentPlanStatus;

  // Associated diagnoses (many-to-many relationship with diagnosis IDs)
  @Column({ type: 'simple-array', nullable: true })
  diagnosisIds: string[];

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  goals: {
    description: string;
    targetDate?: Date;
    achieved?: boolean;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  objectives: {
    description: string;
    priority: 'high' | 'medium' | 'low';
    status: 'pending' | 'in_progress' | 'completed';
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
  reviewSchedule: {
    frequency: string; // weekly, monthly, quarterly
    nextReviewDate?: Date;
    lastReviewDate?: Date;
  };

  @Column({ type: 'text', nullable: true })
  specialInstructions: string;

  @Column({ type: 'text', nullable: true })
  patientEducation: string;

  @Column({ type: 'int', default: 1 })
  version: number;

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

  // Relations
  @OneToMany(() => TreatmentPlanVersion, (version) => version.treatmentPlan, {
    cascade: true,
  })
  versions: TreatmentPlanVersion[];

  @OneToMany(() => MedicalProcedure, (procedure) => procedure.treatmentPlan)
  procedures: MedicalProcedure[];

  @OneToMany(() => TreatmentOutcome, (outcome) => outcome.treatmentPlan)
  outcomes: TreatmentOutcome[];
}
