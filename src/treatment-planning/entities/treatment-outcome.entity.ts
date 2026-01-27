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
import { TreatmentPlan } from './treatment-plan.entity';

@Entity('treatment_outcomes')
@Index(['treatmentPlanId'])
@Index(['recordedDate'])
export class TreatmentOutcome {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  treatmentPlanId: string;

  @ManyToOne(() => TreatmentPlan, (plan) => plan.outcomes)
  @JoinColumn({ name: 'treatmentPlanId' })
  treatmentPlan: TreatmentPlan;

  @Column({ type: 'uuid' })
  patientId: string;

  @Column({ type: 'timestamp' })
  recordedDate: Date;

  @Column({ type: 'varchar', length: 100 })
  outcomeType: string; // clinical, patient_reported, quality_of_life

  @Column({ type: 'jsonb', nullable: true })
  clinicalMetrics: {
    metricName: string;
    value: number | string;
    unit?: string;
    normalRange?: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  patientReportedOutcomes: {
    question: string;
    response: string | number;
    scale?: string;
  }[];

  @Column({ type: 'int', nullable: true })
  qualityOfLifeScore: number; // 0-100

  @Column({ type: 'int', nullable: true })
  painScore: number; // 0-10

  @Column({ type: 'int', nullable: true })
  functionalStatusScore: number; // 0-100

  @Column({ type: 'text', nullable: true })
  patientSatisfaction: string;

  @Column({ type: 'jsonb', nullable: true })
  adverseEvents: {
    event: string;
    severity: 'mild' | 'moderate' | 'severe';
    date: Date;
    resolved: boolean;
  }[];

  @Column({ type: 'boolean', default: false })
  goalsAchieved: boolean;

  @Column({ type: 'text', nullable: true })
  goalsAchievedNotes: string;

  @Column({ type: 'boolean', nullable: true })
  treatmentEffective: boolean;

  @Column({ type: 'text', nullable: true })
  effectivenessNotes: string;

  @Column({ type: 'jsonb', nullable: true })
  followUpRequirements: {
    required: boolean;
    frequency?: string;
    nextAppointmentDate?: Date;
    specialInstructions?: string;
  };

  @Column({ type: 'text', nullable: true })
  clinicianNotes: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'uuid', nullable: true })
  recordedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
