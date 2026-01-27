import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Index,
  JoinColumn,
} from 'typeorm';
import { TreatmentPlan } from './treatment-plan.entity';

@Entity('treatment_plan_versions')
@Index(['treatmentPlanId', 'version'])
export class TreatmentPlanVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  treatmentPlanId: string;

  @ManyToOne(() => TreatmentPlan, (plan) => plan.versions)
  @JoinColumn({ name: 'treatmentPlanId' })
  treatmentPlan: TreatmentPlan;

  @Column({ type: 'int' })
  version: number;

  @Column({ type: 'jsonb' })
  snapshot: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  changeNotes: string;

  @Column({ type: 'uuid', nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;
}
