import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
  JoinColumn,
} from 'typeorm';
import { ProcedureStatus } from '../../common/enums';
import { TreatmentPlan } from './treatment-plan.entity';

@Entity('medical_procedures')
@Index(['patientId', 'status'])
@Index(['scheduledDate'])
@Index(['providerId'])
export class MedicalProcedure {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  patientId: string;

  @Column({ type: 'uuid', nullable: true })
  treatmentPlanId: string;

  @ManyToOne(() => TreatmentPlan, (plan) => plan.procedures)
  @JoinColumn({ name: 'treatmentPlanId' })
  treatmentPlan: TreatmentPlan;

  @Column({ type: 'uuid', nullable: true })
  providerId: string;

  @Column({ type: 'varchar', length: 255 })
  procedureName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  cptCode: string; // CPT code reference

  @Column({ type: 'uuid', nullable: true })
  cptCodeId: string; // Reference to MedicalCode entity

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ProcedureStatus,
    default: ProcedureStatus.SCHEDULED,
  })
  status: ProcedureStatus;

  @Column({ type: 'timestamp' })
  scheduledDate: Date;

  @Column({ type: 'int', nullable: true })
  estimatedDurationMinutes: number;

  @Column({ type: 'timestamp', nullable: true })
  actualStartTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualEndTime: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  facility: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  room: string;

  @Column({ type: 'text', nullable: true })
  preProcedureNotes: string;

  @Column({ type: 'jsonb', nullable: true })
  preProcedureInstructions: {
    fasting?: boolean;
    fastingHours?: number;
    medicationAdjustments?: string;
    specialPreparation?: string;
  };

  @Column({ type: 'text', nullable: true })
  postProcedureNotes: string;

  @Column({ type: 'jsonb', nullable: true })
  outcome: {
    success: boolean;
    findings?: string;
    complications?: string;
    followUpRequired?: boolean;
    followUpInstructions?: string;
  };

  @Column({ type: 'simple-array', nullable: true })
  assistingProviderIds: string[];

  @Column({ type: 'varchar', length: 50, nullable: true })
  anesthesiaType: string;

  @Column({ type: 'text', nullable: true })
  cancellationReason: string;

  @Column({ type: 'timestamp', nullable: true })
  rescheduledFromDate: Date;

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
