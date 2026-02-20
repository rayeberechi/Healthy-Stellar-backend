import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsNumber,
  Min,
  Max,
  IsDateString,
  ValidateNested,
  IsBoolean,
  IsNotEmpty,
  Matches,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ValidateIcd10Dto {
  @ApiProperty({ example: 'J18.9', description: 'ICD-10-CM diagnosis code' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z][0-9]{2}(\.[0-9A-Z]{1,4})?$/, {
    message: 'Code must follow ICD-10 format (e.g., J18.9, A01.0)',
  })
  code: string;

  @ApiPropertyOptional({ example: '2024', description: 'Code year for version validation' })
  @IsOptional()
  @IsString()
  codeYear?: string;
}

export class ValidateCptDto {
  @ApiProperty({ example: '99213', description: 'CPT procedure code' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{4}[0-9A-Z]$|^[0-9]{5}$/, {
    message: 'Code must follow CPT format (5 digits or 4 digits + alphanumeric)',
  })
  code: string;

  @ApiPropertyOptional({ description: 'Associated ICD-10 codes for crosswalk validation' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  associatedDiagnosisCodes?: string[];
}

export class ValidateLoincDto {
  @ApiProperty({ example: '2823-3', description: 'LOINC lab observation code' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{1,5}-[0-9]$/, {
    message: 'Code must follow LOINC format (e.g., 2823-3)',
  })
  code: string;

  @ApiPropertyOptional({ description: 'Observed value for range validation' })
  @IsOptional()
  @IsNumber()
  observedValue?: number;

  @ApiPropertyOptional({ description: 'Unit of measure (UCUM format)' })
  @IsOptional()
  @IsString()
  unit?: string;
}

export class BulkCodeValidationDto {
  @ApiProperty({ type: [ValidateIcd10Dto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ValidateIcd10Dto)
  icd10Codes?: ValidateIcd10Dto[];

  @ApiProperty({ type: [ValidateCptDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ValidateCptDto)
  cptCodes?: ValidateCptDto[];

  @ApiProperty({ type: [ValidateLoincDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ValidateLoincDto)
  loincCodes?: ValidateLoincDto[];
}

export class ClinicalDataQualityCheckDto {
  @ApiProperty({ description: 'Patient encounter or record ID' })
  @IsString()
  @IsNotEmpty()
  recordId: string;

  @ApiProperty({ description: 'Record type (encounter, lab, medication, etc.)' })
  @IsString()
  @IsNotEmpty()
  recordType: string;

  @ApiProperty({ description: 'The clinical data object to validate' })
  data: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Required fields that must be present' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredFields?: string[];
}

export class MedicalAlertDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsString()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty({ description: 'Alert type (drug-interaction, allergy, critical-value)' })
  @IsString()
  @IsNotEmpty()
  alertType: string;

  @ApiProperty({ description: 'Clinical context data' })
  data: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Override reason if suppressing alert' })
  @IsOptional()
  @IsString()
  overrideReason?: string;
}

export class DataGovernancePolicyDto {
  @ApiProperty({ description: 'Policy name' })
  @IsString()
  @IsNotEmpty()
  policyName: string;

  @ApiProperty({ description: 'Policy type' })
  @IsString()
  @IsNotEmpty()
  policyType: string;

  @ApiProperty({ description: 'Policy rules as key-value configuration' })
  rules: Record<string, unknown>;

  @ApiProperty({ description: 'Effective date' })
  @IsDateString()
  effectiveDate: string;

  @ApiPropertyOptional({ description: 'Expiry date' })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @ApiProperty({ description: 'Whether policy is active' })
  @IsBoolean()
  isActive: boolean;
}
