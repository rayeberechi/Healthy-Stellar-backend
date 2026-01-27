import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum EvidenceLevel {
  LEVEL_A = 'A', // High quality evidence
  LEVEL_B = 'B', // Moderate quality evidence
  LEVEL_C = 'C', // Low quality evidence
  LEVEL_D = 'D', // Expert opinion
}

@Entity('clinical_guidelines')
@Index(['status'])
export class ClinicalGuideline {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  source: string; // e.g., "American Heart Association", "WHO"

  @Column({ type: 'varchar', length: 100, nullable: true })
  guidelineVersion: string;

  // Associated ICD-10 diagnosis codes
  @Column({ type: 'simple-array', nullable: true })
  icd10Codes: string[];

  @Column({ type: 'simple-array', nullable: true })
  conditions: string[];

  @Column({ type: 'jsonb', nullable: true })
  recommendedInterventions: {
    intervention: string;
    description: string;
    evidenceLevel: EvidenceLevel;
    strength: 'strong' | 'moderate' | 'weak';
  }[];

  @Column({ type: 'jsonb', nullable: true })
  contraindicatedInterventions: {
    intervention: string;
    reason: string;
  }[];

  @Column({
    type: 'enum',
    enum: EvidenceLevel,
    default: EvidenceLevel.LEVEL_C,
  })
  overallEvidenceLevel: EvidenceLevel;

  @Column({ type: 'date', nullable: true })
  publishedDate: Date;

  @Column({ type: 'date', nullable: true })
  lastReviewedDate: Date;

  @Column({ type: 'date', nullable: true })
  nextReviewDate: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: string;

  @Column({ type: 'text', nullable: true })
  references: string;

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
