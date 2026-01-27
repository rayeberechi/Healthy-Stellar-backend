# Pathology and Diagnostic Services Module

## Overview
Comprehensive pathology and diagnostic services management system for handling pathology cases, specimens, histology/cytology workflows, digital pathology images, molecular diagnostics, genetic testing, and quality assurance.

## Features

### 1. Pathology Case Management
- Create and track pathology cases
- Workflow status management (received → accessioning → grossing → processing → diagnosis → finalized)
- Case assignment to pathologists
- Consultation requests
- Turnaround time tracking
- ICD and CPT coding

### 2. Specimen Processing
- Specimen tracking and management
- Processing protocol documentation
- Block and slide counting
- Fixative and processing time tracking

### 3. Histology Workflow
- Slide creation and management
- Multiple stain types (H&E, IHC, special stains)
- Quality assessment
- Recut requests
- Technician tracking

### 4. Cytology Workflow
- Cytology slide management
- Adequacy assessment
- Bethesda classification for Pap smears
- Cytotechnologist screening
- Pathologist review

### 5. Digital Pathology
- Whole slide imaging support
- Image storage and retrieval
- Annotation capabilities
- AI analysis integration
- Access logging for compliance

### 6. Pathology Reports
- Standardized report generation
- CAP protocol templates
- Synoptic reporting
- TNM staging
- Report signing and finalization
- Amendment and addendum support

### 7. Molecular Diagnostics
- PCR, FISH, NGS, and other molecular tests
- Test ordering and result tracking
- External lab integration
- Reference range management

### 8. Genetic Testing
- Genetic test panel management
- Variant detection and classification
- ACMG classification
- Consent documentation
- Genetic counselor notes

### 9. Quality Assurance
- Peer review system
- Random and targeted case reviews
- Discrepancy tracking
- QA metrics and reporting
- Educational case identification

## API Endpoints

### Pathology Cases
```
POST   /api/pathology/cases                    - Create new case
GET    /api/pathology/cases                    - Search cases
GET    /api/pathology/cases/:id                - Get case details
GET    /api/pathology/cases/patient/:patientId - Get patient cases
PATCH  /api/pathology/cases/:id                - Update case
POST   /api/pathology/cases/:id/assign         - Assign pathologist
POST   /api/pathology/cases/:id/consultation   - Request consultation
DELETE /api/pathology/cases/:id                - Delete case
```

### Specimens
```
POST   /api/pathology/specimens                - Create specimen
GET    /api/pathology/specimens/:id            - Get specimen
GET    /api/pathology/specimens/case/:caseId   - Get case specimens
PATCH  /api/pathology/specimens/:id/process    - Update processing
```

### Histology
```
POST   /api/pathology/histology/slides              - Create slide
GET    /api/pathology/histology/slides/:id          - Get slide
GET    /api/pathology/histology/case/:caseId/slides - Get case slides
POST   /api/pathology/histology/slides/:id/stain    - Perform staining
POST   /api/pathology/histology/slides/:id/recut    - Request recut
```

### Cytology
```
POST   /api/pathology/cytology/slides              - Create slide
GET    /api/pathology/cytology/slides/:id          - Get slide
GET    /api/pathology/cytology/case/:caseId/slides - Get case slides
POST   /api/pathology/cytology/slides/:id/screen   - Screen slide
POST   /api/pathology/cytology/slides/:id/review   - Pathologist review
```

### Digital Pathology
```
POST   /api/pathology/images/upload           - Upload image
GET    /api/pathology/images/:id              - Get image
GET    /api/pathology/images/case/:caseId     - Get case images
GET    /api/pathology/images/slide/:slideId   - Get slide images
POST   /api/pathology/images/:id/annotate     - Add annotations
POST   /api/pathology/images/:id/ai-analysis  - Add AI analysis
```

### Reports
```
POST   /api/pathology/reports                      - Create report
GET    /api/pathology/reports/:id                  - Get report
GET    /api/pathology/reports/case/:caseId         - Get case reports
POST   /api/pathology/reports/:id/finalize         - Finalize report
POST   /api/pathology/reports/:id/amend            - Amend report
POST   /api/pathology/reports/:id/addendum         - Add addendum
POST   /api/pathology/reports/templates            - Create template
GET    /api/pathology/reports/templates            - Get templates
GET    /api/pathology/reports/templates/:id        - Get template
GET    /api/pathology/reports/templates/organ/:type - Get organ templates
POST   /api/pathology/reports/templates/:id/activate - Activate template
```

### Molecular Diagnostics
```
POST   /api/pathology/molecular/tests              - Order test
GET    /api/pathology/molecular/tests/:id          - Get test
GET    /api/pathology/molecular/case/:caseId/tests - Get case tests
PATCH  /api/pathology/molecular/tests/:id/result   - Update result
PATCH  /api/pathology/molecular/tests/:id/status   - Update status
```

### Genetic Testing
```
POST   /api/pathology/genetic/tests              - Order test
GET    /api/pathology/genetic/tests/:id          - Get test
GET    /api/pathology/genetic/case/:caseId/tests - Get case tests
PATCH  /api/pathology/genetic/tests/:id/result   - Update result
```

### Quality Control
```
POST   /api/pathology/quality/review              - Create review
GET    /api/pathology/quality/review/:id          - Get review
GET    /api/pathology/quality/case/:caseId/reviews - Get case reviews
PATCH  /api/pathology/quality/review/:id/resolve  - Resolve discrepancy
GET    /api/pathology/quality/metrics             - Get QA metrics
```

## Database Schema

### Main Entities
- **PathologyCase**: Core case information and workflow tracking
- **PathologySpecimen**: Specimen details and processing
- **HistologySlide**: Histology slide information
- **CytologySlide**: Cytology slide information
- **DigitalImage**: Digital pathology images
- **PathologyReport**: Pathology reports
- **ReportTemplate**: Report templates
- **MolecularTest**: Molecular diagnostic tests
- **GeneticTest**: Genetic tests
- **QualityControlLog**: QA reviews and discrepancies

### Relationships
```
PathologyCase (1) ─── (many) PathologySpecimen
PathologyCase (1) ─── (many) HistologySlide
PathologyCase (1) ─── (many) CytologySlide
PathologyCase (1) ─── (many) DigitalImage
PathologyCase (1) ─── (many) PathologyReport
PathologyCase (1) ─── (many) MolecularTest
PathologyCase (1) ─── (many) GeneticTest
PathologyCase (1) ─── (many) QualityControlLog
HistologySlide (1) ─── (many) DigitalImage
CytologySlide (1) ─── (many) DigitalImage
PathologyReport (many) ─── (1) ReportTemplate
```

## Workflow Examples

### Complete Pathology Case Workflow
1. Create pathology case
2. Add specimens
3. Process specimens (grossing, embedding)
4. Create histology slides
5. Perform staining
6. Upload digital images
7. Assign to pathologist
8. Add microscopic findings and diagnosis
9. Generate report from template
10. Finalize and sign report
11. Peer review (QA)

### Cytology Workflow
1. Create pathology case (cytology type)
2. Create cytology slide
3. Cytotechnologist screens slide
4. Pathologist reviews and interprets
5. Generate report
6. Finalize report

### Molecular Testing Workflow
1. Order molecular test from pathology case
2. Update test status as processing
3. Enter test results
4. Add interpretation
5. Link to pathology report

## Compliance Features

### HIPAA Compliance
- Access logging for all image views
- Audit trails for all modifications
- User tracking (createdBy, updatedBy)
- Secure data storage

### CAP Compliance
- Standardized report templates
- Synoptic reporting
- Required field validation
- Quality assurance tracking

### CLIA Compliance
- Quality control logging
- Proficiency testing support
- Personnel tracking
- Turnaround time monitoring

## Integration Points

- **Laboratory Module**: Link pathology cases to lab orders
- **Medical Records**: Attach reports to patient records
- **Billing Module**: Generate CPT/ICD codes for billing
- **Auth Module**: Role-based access control
- **Audit Module**: Comprehensive audit logging

## Future Enhancements

- DICOM integration for medical imaging
- HL7 interface for report distribution
- LIS (Laboratory Information System) integration
- Barcode scanning for specimen tracking
- Mobile app for slide review
- Advanced AI/ML for diagnostic assistance
- Telepathology consultation features
- Integration with tumor registries

## Testing

Run tests with:
```bash
npm run test
npm run test:e2e
```

## Security

All endpoints require JWT authentication. Role-based access control should be implemented based on user roles (pathologist, technician, cytotechnologist, etc.).
