# Pathology Module - Quick Start Guide

## 🚀 Getting Started

### 1. Module is Already Integrated
The pathology module has been added to `app.module.ts` and is ready to use.

### 2. Database Setup
The entities will be automatically created when you run the application with TypeORM synchronization enabled, or you can create a migration:

```bash
npm run migration:generate -- src/migrations/AddPathologyModule
npm run migration:run
```

### 3. Start the Application
```bash
npm run start:dev
```

## 📝 Basic Usage Examples

### Example 1: Create a Pathology Case

**POST** `/api/pathology/cases`

```json
{
  "patientId": "uuid-of-patient",
  "patientName": "John Doe",
  "orderingPhysicianId": "uuid-of-physician",
  "orderingPhysicianName": "Dr. Smith",
  "caseType": "surgical",
  "priority": "routine",
  "clinicalHistory": "Patient presents with suspicious lesion on left arm",
  "clinicalIndication": "Rule out malignancy"
}
```

**Response:**
```json
{
  "id": "case-uuid",
  "caseNumber": "PATH-20260127-0001",
  "status": "received",
  "receivedDate": "2026-01-27T10:00:00Z",
  ...
}
```

### Example 2: Add a Specimen

**POST** `/api/pathology/specimens`

```json
{
  "pathologyCaseId": "case-uuid",
  "specimenType": "tissue",
  "description": "Skin biopsy, left arm",
  "site": "Left forearm",
  "fixative": "formalin",
  "containerType": "Standard container"
}
```

### Example 3: Create Histology Slide

**POST** `/api/pathology/histology/slides`

```json
{
  "pathologyCaseId": "case-uuid",
  "blockNumber": "A1",
  "sectionNumber": 1,
  "stainType": "H&E",
  "technicianId": "tech-uuid",
  "technicianName": "Jane Tech"
}
```

### Example 4: Upload Digital Image

**POST** `/api/pathology/images/upload`

```json
{
  "pathologyCaseId": "case-uuid",
  "histologySlideId": "slide-uuid",
  "imageType": "whole_slide",
  "format": "svs",
  "storagePath": "/images/pathology/case-uuid/slide-1.svs",
  "thumbnailPath": "/images/pathology/case-uuid/slide-1-thumb.jpg",
  "scannerInfo": "Aperio AT2",
  "magnification": "40x",
  "fileSizeBytes": 524288000
}
```

### Example 5: Create Pathology Report

**POST** `/api/pathology/reports`

```json
{
  "pathologyCaseId": "case-uuid",
  "clinicalInformation": "Patient with suspicious skin lesion",
  "grossDescription": "Received in formalin is a 0.5 x 0.4 x 0.2 cm ellipse of tan-pink skin...",
  "microscopicDescription": "Sections show epidermis with underlying dermis...",
  "diagnosis": "Benign intradermal nevus",
  "pathologistId": "path-uuid",
  "pathologistName": "Dr. Pathologist"
}
```

### Example 6: Update Case Status

**PATCH** `/api/pathology/cases/{caseId}`

```json
{
  "status": "diagnosis",
  "diagnosis": "Benign intradermal nevus",
  "microscopicFindings": "Sections show a well-circumscribed proliferation of nevus cells..."
}
```

### Example 7: Finalize Report

**POST** `/api/pathology/reports/{reportId}/finalize`

```json
{
  "signature": "Dr. John Pathologist, MD - Board Certified Pathologist"
}
```

### Example 8: Order Molecular Test

**POST** `/api/pathology/molecular/tests`

```json
{
  "pathologyCaseId": "case-uuid",
  "testType": "ihc",
  "testName": "Ki-67 Immunohistochemistry",
  "methodology": "Immunohistochemical staining using Ki-67 antibody",
  "specimenType": "FFPE tissue",
  "indication": "Assess proliferation index"
}
```

### Example 9: Create Quality Control Review

**POST** `/api/pathology/quality/review`

```json
{
  "pathologyCaseId": "case-uuid",
  "qcType": "peer_review",
  "reviewerId": "reviewer-uuid",
  "reviewerName": "Dr. Senior Pathologist",
  "findings": "Diagnosis confirmed. Excellent slide quality.",
  "severity": "none",
  "agreement": true
}
```

### Example 10: Search Cases

**GET** `/api/pathology/cases?status=diagnosis&priority=urgent&page=1&limit=20`

## 🔄 Complete Workflow Example

### Step-by-Step: Surgical Pathology Case

1. **Create Case**
   ```
   POST /api/pathology/cases
   ```

2. **Add Specimen**
   ```
   POST /api/pathology/specimens
   ```

3. **Update Case Status to Accessioning**
   ```
   PATCH /api/pathology/cases/{id}
   { "status": "accessioning" }
   ```

4. **Update Case Status to Grossing**
   ```
   PATCH /api/pathology/cases/{id}
   { "status": "grossing", "grossDescription": "..." }
   ```

5. **Create Histology Slides**
   ```
   POST /api/pathology/histology/slides
   ```

6. **Perform Staining**
   ```
   POST /api/pathology/histology/slides/{id}/stain
   ```

7. **Upload Digital Images**
   ```
   POST /api/pathology/images/upload
   ```

8. **Assign to Pathologist**
   ```
   POST /api/pathology/cases/{id}/assign
   ```

9. **Add Diagnosis**
   ```
   PATCH /api/pathology/cases/{id}
   { "status": "diagnosis", "diagnosis": "...", "microscopicFindings": "..." }
   ```

10. **Generate Report**
    ```
    POST /api/pathology/reports
    ```

11. **Finalize Report**
    ```
    POST /api/pathology/reports/{id}/finalize
    ```

12. **Peer Review (QA)**
    ```
    POST /api/pathology/quality/review
    ```

13. **Finalize Case**
    ```
    PATCH /api/pathology/cases/{id}
    { "status": "finalized" }
    ```

## 🎯 Common Use Cases

### Use Case 1: Frozen Section
```json
{
  "caseType": "frozen_section",
  "priority": "frozen",
  "clinicalHistory": "Intraoperative consultation requested"
}
```

### Use Case 2: Cytology with Pap Smear
```json
{
  "caseType": "cytology",
  "specimenType": "pap_smear",
  "preparationMethod": "thinprep",
  "adequacy": "satisfactory",
  "bethesdaClassification": "NILM"
}
```

### Use Case 3: Molecular Testing for Cancer
```json
{
  "testType": "ngs",
  "testName": "Comprehensive Cancer Panel",
  "geneMarker": "EGFR, KRAS, BRAF, ALK",
  "methodology": "Next Generation Sequencing"
}
```

### Use Case 4: Genetic Testing with Consent
```json
{
  "testPanelName": "Hereditary Cancer Panel",
  "genesAnalyzed": ["BRCA1", "BRCA2", "TP53", "PTEN"],
  "consentDocumented": true,
  "consentFormPath": "/consents/patient-uuid-consent.pdf"
}
```

## 🔍 Search and Filter Examples

### Find Cases by Patient
```
GET /api/pathology/cases?patientId=patient-uuid
```

### Find Urgent Cases
```
GET /api/pathology/cases?priority=urgent&status=diagnosis
```

### Find Cases by Date Range
```
GET /api/pathology/cases?startDate=2026-01-01&endDate=2026-01-31
```

### Find Cases by Pathologist
```
GET /api/pathology/cases?pathologistId=path-uuid
```

## 📊 Quality Metrics

### Get QA Metrics for a Period
```
GET /api/pathology/quality/metrics?startDate=2026-01-01&endDate=2026-01-31
```

**Response:**
```json
{
  "totalReviews": 150,
  "discrepancyRate": 2.5,
  "criticalDiscrepancies": 1,
  "averageResolutionTime": 3.2,
  "educationalCases": 12
}
```

## 🔐 Authentication

All endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📚 Additional Resources

- Full API documentation: `README.md`
- Entity schemas: `entities/` directory
- Service implementations: `services/` directory
- DTO validations: `dto/` directory

## 💡 Tips

1. **Case Numbers**: Auto-generated in format `PATH-YYYYMMDD-XXXX`
2. **Status Workflow**: Follow the proper status transitions
3. **Turnaround Time**: Automatically calculated when case is finalized
4. **Image Access**: All image views are logged for compliance
5. **Report Templates**: Create templates for common organ types
6. **Quality Control**: Perform regular peer reviews for quality assurance

## 🐛 Troubleshooting

### Issue: Case status transition fails
**Solution**: Check valid status transitions in `pathology-case.service.ts`

### Issue: Image upload fails
**Solution**: Ensure storage path is accessible and file size is within limits

### Issue: Report finalization fails
**Solution**: Verify all required fields are completed

## 📞 Support

For issues or questions, refer to the main README.md or contact the development team.
