import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Index,
  JoinColumn,
} from 'typeorm';
import { DiagnosisStatus, DiagnosisSeverity } from '../../common/enums';
import { MedicalCode } from '../../billing/entities/medical-code.entity';
import { DiagnosisHistory } from './diagnosis-history.entity';

@Entity('diagnoses')
@Index(['patientId', 'status'])
@Index(['icd10CodeId'])
@Index(['diagnosisDate'])
export class Diagnosis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  patientId: string;

  @Column({ type: 'uuid', nullable: true })
  providerId: string;

  @Column({ type: 'uuid', nullable: true })
  medicalRecordId: string;

  // ICD-10 Code Reference
  @Column({ type: 'uuid' })
  icd10CodeId: string;

  @ManyToOne(() => MedicalCode, { eager: true })
  @JoinColumn({ name: 'icd10CodeId' })
  icd10Code: MedicalCode;

  @Column({
    type: 'enum',
    enum: DiagnosisStatus,
    default: DiagnosisStatus.PRELIMINARY,
  })
  status: DiagnosisStatus;

  @Column({
    type: 'enum',
    enum: DiagnosisSeverity,
    nullable: true,
  })
  severity: DiagnosisSeverity;

  @Column({ type: 'timestamp' })
  diagnosisDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  onsetDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  resolvedDate: Date;

  @Column({ type: 'text', nullable: true })
  clinicalNotes: string;

  @Column({ type: 'text', nullable: true })
  presentingSymptoms: string;

  @Column({ type: 'jsonb', nullable: true })
  supportingEvidence: {
    labResults?: string[];
    imagingResults?: string[];
    physicalExamFindings?: string;
  };

  @Column({ type: 'boolean', default: false })
  isPrimary: boolean;

  @Column({ type: 'boolean', default: false })
  isChronic: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  laterality: string; // left, right, bilateral

  @Column({ type: 'varchar', length: 100, nullable: true })
  bodyLocation: string;

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
  @OneToMany(() => DiagnosisHistory, (history) => history.diagnosis, {
    cascade: true,
  })
  history: DiagnosisHistory[];
}
