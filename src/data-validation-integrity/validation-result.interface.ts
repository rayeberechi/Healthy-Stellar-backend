import { AlertSeverity, DataQualityDimension } from '../medical-codes.constants';

export interface CodeValidationResult {
  code: string;
  codeSystem: 'ICD-10' | 'CPT' | 'LOINC' | 'NDC' | 'SNOMED';
  isValid: boolean;
  isActive: boolean;
  description?: string;
  category?: string;
  warnings: string[];
  errors: string[];
  metadata?: Record<string, unknown>;
}

export interface BulkValidationResult {
  totalCodes: number;
  validCount: number;
  invalidCount: number;
  warningCount: number;
  results: CodeValidationResult[];
  processingTimeMs: number;
}

export interface DataQualityScore {
  dimension: DataQualityDimension;
  score: number; // 0-100
  weight: number; // weighting for composite score
  issues: DataQualityIssue[];
}

export interface DataQualityIssue {
  field: string;
  issueType: string;
  severity: 'ERROR' | 'WARNING' | 'INFO';
  message: string;
  suggestedFix?: string;
}

export interface DataQualityReport {
  recordId: string;
  recordType: string;
  overallScore: number; // 0-100 composite
  qualityScores: DataQualityScore[];
  issues: DataQualityIssue[];
  isPassing: boolean; // based on threshold
  assessedAt: Date;
}

export interface ClinicalAlert {
  alertId: string;
  alertType: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  patientId: string;
  affectedCodes?: string[];
  recommendations: string[];
  references?: string[];
  createdAt: Date;
  requiresAcknowledgment: boolean;
  isActionable: boolean;
}

export interface GovernanceComplianceResult {
  policyId: string;
  policyName: string;
  isCompliant: boolean;
  violations: GovernanceViolation[];
  lastCheckedAt: Date;
}

export interface GovernanceViolation {
  ruleId: string;
  ruleName: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  affectedField?: string;
  remediationSteps: string[];
}

export interface ReferenceDataUpdate {
  codeSystem: string;
  version: string;
  totalCodes: number;
  addedCodes: number;
  updatedCodes: number;
  deprecatedCodes: number;
  updatedAt: Date;
}
