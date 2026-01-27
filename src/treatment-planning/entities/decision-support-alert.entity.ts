import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';
import { AlertSeverity, AlertType } from '../../common/enums';

@Entity('decision_support_alerts')
@Index(['patientId', 'severity'])
@Index(['acknowledged'])
@Index(['createdAt'])
export class DecisionSupportAlert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  patientId: string;

  @Column({ type: 'uuid', nullable: true })
  treatmentPlanId: string;

  @Column({ type: 'uuid', nullable: true })
  diagnosisId: string;

  @Column({
    type: 'enum',
    enum: AlertType,
  })
  alertType: AlertType;

  @Column({
    type: 'enum',
    enum: AlertSeverity,
  })
  severity: AlertSeverity;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'text', nullable: true })
  recommendation: string;

  @Column({ type: 'jsonb', nullable: true })
  supportingEvidence: {
    source: string;
    evidenceLevel?: string;
    reference?: string;
  }[];

  @Column({ type: 'uuid', nullable: true })
  guidelineId: string;

  @Column({ type: 'jsonb', nullable: true })
  triggeredBy: {
    type: string; // diagnosis, medication, procedure, lab_result
    id?: string;
    details?: string;
  };

  @Column({ type: 'boolean', default: false })
  acknowledged: boolean;

  @Column({ type: 'uuid', nullable: true })
  acknowledgedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  acknowledgedAt: Date;

  @Column({ type: 'text', nullable: true })
  acknowledgedNotes: string;

  @Column({ type: 'boolean', default: false })
  dismissed: boolean;

  @Column({ type: 'text', nullable: true })
  dismissalReason: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
