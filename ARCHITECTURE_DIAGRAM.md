# FHIR Bulk Export - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENT APPLICATION                          │
│                         (Frontend / EHR System)                          │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 │ HTTPS + JWT
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           NESTJS APPLICATION                             │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    FHIR Controller                               │   │
│  │  • GET /fhir/r4/Patient/$export                                 │   │
│  │  • GET /fhir/r4/$export-status/:jobId                           │   │
│  │  • DELETE /fhir/r4/$export-status/:jobId                        │   │
│  └────────────────────────┬────────────────────────────────────────┘   │
│                           │                                              │
│                           ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                 BulkExportService                                │   │
│  │  • initiateExport()                                              │   │
│  │  • getJobStatus()                                                │   │
│  │  • cancelJob()                                                   │   │
│  │  • processExport()                                               │   │
│  │  • cleanupExpiredJobs()                                          │   │
│  └────────┬──────────────────────────────────┬─────────────────────┘   │
│           │                                   │                          │
│           │                                   │                          │
│           ▼                                   ▼                          │
│  ┌────────────────┐                 ┌─────────────────────┐            │
│  │  TypeORM       │                 │   BullMQ Queue      │            │
│  │  Repositories  │                 │  (fhir-bulk-export) │            │
│  │                │                 │                     │            │
│  │  • Patient     │                 │  Job: {             │            │
│  │  • MedicalRec  │                 │    jobId: uuid      │            │
│  │  • Consent     │                 │  }                  │            │
│  │  • History     │                 │                     │            │
│  │  • ExportJob   │                 └──────────┬──────────┘            │
│  └────────┬───────┘                            │                        │
│           │                                    │                        │
└───────────┼────────────────────────────────────┼────────────────────────┘
            │                                    │
            ▼                                    ▼
┌─────────────────────┐          ┌──────────────────────────────────────┐
│   PostgreSQL DB     │          │     BullMQ Worker Process            │
│                     │          │                                      │
│  Tables:            │          │  ┌────────────────────────────────┐ │
│  • patients         │          │  │  BulkExportProcessor           │ │
│  • medical_records  │          │  │  • process(job)                │ │
│  • consents         │          │  │  • Streams resources           │ │
│  • medical_history  │          │  │  • Converts to FHIR            │ │
│  • bulk_export_jobs │          │  │  • Generates NDJSON            │ │
│                     │          │  │  • Uploads to IPFS             │ │
└─────────────────────┘          │  └────────────┬───────────────────┘ │
                                 │               │                      │
                                 └───────────────┼──────────────────────┘
                                                 │
                                                 ▼
                                 ┌──────────────────────────────────────┐
                                 │         IPFS Storage                 │
                                 │                                      │
                                 │  • Decentralized storage             │
                                 │  • Content-addressed                 │
                                 │  • NDJSON files                      │
                                 │  • ipfs:// URLs                      │
                                 │                                      │
                                 │  Options:                            │
                                 │  - Self-hosted node                  │
                                 │  - Pinata                            │
                                 │  - Infura                            │
                                 │  - Web3.Storage                      │
                                 └──────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                         SCHEDULED TASKS                                  │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  BulkExportCleanupTask (Cron: Every Hour)                       │   │
│  │  • Find expired jobs (> 24 hours)                               │   │
│  │  • Unpin IPFS files                                              │   │
│  │  • Delete job records                                            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

## Request Flow

### 1. Export Initiation

```
Client                Controller           Service              Queue              DB
  │                       │                   │                   │                │
  │  GET $export          │                   │                   │                │
  ├──────────────────────>│                   │                   │                │
  │                       │  initiateExport() │                   │                │
  │                       ├──────────────────>│                   │                │
  │                       │                   │  Create Job       │                │
  │                       │                   ├──────────────────>│                │
  │                       │                   │<──────────────────┤                │
  │                       │                   │  Add to Queue     │                │
  │                       │                   ├──────────────────────────────────>│
  │                       │                   │<──────────────────────────────────┤
  │                       │<──────────────────┤                   │                │
  │  202 + Content-Loc    │                   │                   │                │
  │<──────────────────────┤                   │                   │                │
  │                       │                   │                   │                │
```

### 2. Background Processing

```
Queue              Worker             Service              DB              IPFS
  │                  │                   │                  │                │
  │  Job Available   │                   │                  │                │
  ├─────────────────>│                   │                  │                │
  │                  │  processExport()  │                  │                │
  │                  ├──────────────────>│                  │                │
  │                  │                   │  Update Status   │                │
  │                  │                   ├─────────────────>│                │
  │                  │                   │  Fetch Resources │                │
  │                  │                   ├─────────────────>│                │
  │                  │                   │<─────────────────┤                │
  │                  │                   │  Convert to FHIR │                │
  │                  │                   │  Generate NDJSON │                │
  │                  │                   │  Upload Files    │                │
  │                  │                   ├────────────────────────────────>│
  │                  │                   │<────────────────────────────────┤
  │                  │                   │  Save Output URLs│                │
  │                  │                   ├─────────────────>│                │
  │                  │<──────────────────┤                  │                │
  │<─────────────────┤                   │                  │                │
  │                  │                   │                  │                │
```

### 3. Status Check

```
Client                Controller           Service              DB
  │                       │                   │                  │
  │  GET $export-status   │                   │                  │
  ├──────────────────────>│                   │                  │
  │                       │  getJobStatus()   │                  │
  │                       ├──────────────────>│                  │
  │                       │                   │  Find Job        │
  │                       │                   ├─────────────────>│
  │                       │                   │<─────────────────┤
  │                       │                   │  Check Auth      │
  │                       │<──────────────────┤                  │
  │  200 + Status/Manifest│                   │                  │
  │<──────────────────────┤                   │                  │
  │                       │                   │                  │
```

### 4. Cleanup (Hourly)

```
Cron               Task                Service              DB              IPFS
  │                  │                   │                  │                │
  │  Trigger         │                   │                  │                │
  ├─────────────────>│                   │                  │                │
  │                  │  cleanupExpired() │                  │                │
  │                  ├──────────────────>│                  │                │
  │                  │                   │  Find Expired    │                │
  │                  │                   ├─────────────────>│                │
  │                  │                   │<─────────────────┤                │
  │                  │                   │  Unpin Files     │                │
  │                  │                   ├────────────────────────────────>│
  │                  │                   │  Delete Jobs     │                │
  │                  │                   ├─────────────────>│                │
  │                  │<──────────────────┤                  │                │
  │<─────────────────┤                   │                  │                │
  │                  │                   │                  │                │
```

## Data Flow

```
┌──────────────┐
│   Patient    │
│   Records    │
└──────┬───────┘
       │
       │ Query
       ▼
┌──────────────┐
│  PostgreSQL  │
│   Database   │
└──────┬───────┘
       │
       │ Stream
       ▼
┌──────────────┐
│ FHIR Mapper  │
│  (Convert)   │
└──────┬───────┘
       │
       │ FHIR Resources
       ▼
┌──────────────┐
│   NDJSON     │
│  Generator   │
└──────┬───────┘
       │
       │ Newline-delimited JSON
       ▼
┌──────────────┐
│     IPFS     │
│   Upload     │
└──────┬───────┘
       │
       │ ipfs:// URL
       ▼
┌──────────────┐
│  Export Job  │
│  (Complete)  │
└──────────────┘
```

## Component Interactions

```
┌─────────────────────────────────────────────────────────────┐
│                      FHIR Module                             │
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │              │    │              │    │              │  │
│  │  Controller  │───>│   Service    │───>│ Repositories │  │
│  │              │    │              │    │              │  │
│  └──────────────┘    └──────┬───────┘    └──────────────┘  │
│                              │                               │
│                              │                               │
│                              ▼                               │
│                      ┌──────────────┐                        │
│                      │              │                        │
│                      │  Processor   │                        │
│                      │              │                        │
│                      └──────┬───────┘                        │
│                             │                                │
└─────────────────────────────┼────────────────────────────────┘
                              │
                              ▼
                      ┌──────────────┐
                      │              │
                      │  BullMQ      │
                      │  Queue       │
                      │              │
                      └──────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                           │
│                                                               │
│  1. Authentication (JWT)                                     │
│     └─> Verify token validity                               │
│                                                               │
│  2. Authorization (RBAC)                                     │
│     └─> Check user role (PATIENT/ADMIN)                     │
│                                                               │
│  3. Data Scoping                                             │
│     └─> Filter by patientId (if not ADMIN)                  │
│                                                               │
│  4. Job Ownership                                            │
│     └─> Verify requesterId matches user                     │
│                                                               │
│  5. IPFS Access Control                                      │
│     └─> Require token for file downloads                    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Monitoring & Observability

```
┌─────────────────────────────────────────────────────────────┐
│                    Monitoring Stack                          │
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │              │    │              │    │              │  │
│  │  BullBoard   │    │   Metrics    │    │     Logs     │  │
│  │  Dashboard   │    │   Service    │    │   (Winston)  │  │
│  │              │    │              │    │              │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                                                               │
│  Tracks:                                                     │
│  • Queue length                                              │
│  • Job success/failure rates                                 │
│  • Processing times                                          │
│  • IPFS upload metrics                                       │
│  • Export sizes                                              │
│  • Error rates                                               │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```
