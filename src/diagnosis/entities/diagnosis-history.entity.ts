import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Index,
  JoinColumn,
} from 'typeorm';
import { Diagnosis } from './diagnosis.entity';

@Entity('diagnosis_history')
@Index(['diagnosisId', 'createdAt'])
export class DiagnosisHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  diagnosisId: string;

  @ManyToOne(() => Diagnosis, (diagnosis) => diagnosis.history)
  @JoinColumn({ name: 'diagnosisId' })
  diagnosis: Diagnosis;

  @Column({ type: 'varchar', length: 50 })
  changeType: string; // status_change, code_update, severity_change, notes_update

  @Column({ type: 'jsonb', nullable: true })
  previousValues: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  newValues: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  changeReason: string;

  @Column({ type: 'uuid', nullable: true })
  changedBy: string;

  @CreateDateColumn()
  createdAt: Date;
}
