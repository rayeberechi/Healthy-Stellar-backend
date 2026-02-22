# FHIR Bulk Export - Deployment Checklist

## Pre-Deployment

### Database
- [ ] Run migration: `npm run migration:run`
- [ ] Verify `bulk_export_jobs` table created
- [ ] Check indexes are in place
- [ ] Test database connection

### Dependencies
- [ ] Verify `@nestjs/bullmq` installed
- [ ] Verify `bullmq` installed
- [ ] Verify `@nestjs/schedule` installed
- [ ] Run `npm install` if needed

### Redis
- [ ] Redis server running
- [ ] Configure `REDIS_HOST` in `.env`
- [ ] Configure `REDIS_PORT` in `.env`
- [ ] Configure `REDIS_PASSWORD` in `.env` (if applicable)
- [ ] Test Redis connection

### Queue Configuration
- [ ] Verify `fhir-bulk-export` queue registered in `queue.module.ts`
- [ ] Check BullBoard accessible at `/admin/queues`
- [ ] Test queue connectivity

## Configuration

### Environment Variables
```env
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Optional: IPFS Configuration (for production)
IPFS_HOST=localhost
IPFS_PORT=5001
IPFS_PROTOCOL=http
```

### Module Registration
- [ ] `FhirModule` imported in `app.module.ts`
- [ ] `QueueModule` imported in `app.module.ts`
- [ ] `ScheduleModule` configured

## Testing

### Unit Tests
- [ ] Run: `npm run test -- bulk-export.service.spec`
- [ ] All tests passing
- [ ] Coverage acceptable

### E2E Tests
- [ ] Run: `npm run test:e2e -- fhir-bulk-export.e2e-spec`
- [ ] All scenarios passing
- [ ] Test with patient role
- [ ] Test with admin role

### Manual Testing
- [ ] Test export initiation
- [ ] Test status polling
- [ ] Test job cancellation
- [ ] Test access control (patient vs admin)
- [ ] Test expiration cleanup
- [ ] Verify NDJSON format
- [ ] Check IPFS URLs generated

## Production Setup

### IPFS Integration
- [ ] Choose IPFS solution:
  - [ ] Self-hosted IPFS node
  - [ ] Pinata service
  - [ ] Infura IPFS
  - [ ] Web3.Storage
- [ ] Install IPFS client library
- [ ] Update `uploadToIPFS()` method in `bulk-export.service.ts`
- [ ] Test file upload
- [ ] Test file retrieval
- [ ] Configure pinning strategy

### Monitoring
- [ ] Set up queue monitoring (BullBoard)
- [ ] Configure alerts for failed jobs
- [ ] Monitor Redis memory usage
- [ ] Track export job metrics
- [ ] Set up logging for exports

### Performance
- [ ] Configure Redis memory limits
- [ ] Set queue concurrency limits
- [ ] Test with large datasets
- [ ] Optimize streaming for memory
- [ ] Configure job timeouts

### Security
- [ ] Verify JWT authentication working
- [ ] Test role-based access control
- [ ] Validate patient data scoping
- [ ] Check IPFS file permissions
- [ ] Review error messages (no data leaks)

### Rate Limiting
- [ ] Configure export rate limits
- [ ] Set max concurrent exports per user
- [ ] Implement cooldown periods
- [ ] Add queue priority levels

## Post-Deployment

### Verification
- [ ] Test export from production
- [ ] Verify files accessible on IPFS
- [ ] Check cleanup job running
- [ ] Monitor queue health
- [ ] Review logs for errors

### Documentation
- [ ] Update API documentation
- [ ] Add examples to Swagger
- [ ] Document IPFS gateway URLs
- [ ] Create user guide
- [ ] Update changelog

### Monitoring Setup
- [ ] Dashboard for export metrics
- [ ] Alerts for:
  - [ ] Failed exports
  - [ ] Queue backlog
  - [ ] Redis connection issues
  - [ ] IPFS upload failures
  - [ ] Cleanup job failures

## Rollback Plan

### If Issues Occur
1. [ ] Disable export endpoints (feature flag)
2. [ ] Stop BullMQ workers
3. [ ] Revert database migration
4. [ ] Clear Redis queue
5. [ ] Restore previous version

### Rollback Commands
```bash
# Stop workers
pm2 stop bulk-export-worker

# Revert migration
npm run migration:revert

# Clear queue
redis-cli DEL bull:fhir-bulk-export:*

# Restart application
pm2 restart app
```

## Performance Benchmarks

### Target Metrics
- [ ] Export initiation: < 500ms
- [ ] Status check: < 200ms
- [ ] Processing: < 1 min per 1000 resources
- [ ] IPFS upload: < 5s per file
- [ ] Cleanup: < 30s per run

### Load Testing
- [ ] Test with 100 concurrent exports
- [ ] Test with 10,000+ resources
- [ ] Test with multiple resource types
- [ ] Verify memory usage stable
- [ ] Check Redis memory limits

## Compliance

### FHIR Specification
- [ ] Follows FHIR R4 standard
- [ ] Implements Bulk Data Access IG
- [ ] NDJSON format compliant
- [ ] Proper HTTP status codes
- [ ] OperationOutcome for errors

### Security & Privacy
- [ ] HIPAA compliance reviewed
- [ ] Patient data properly scoped
- [ ] Audit logging enabled
- [ ] Encryption in transit (HTTPS)
- [ ] Secure IPFS access

## Support

### Documentation Links
- Implementation: `FHIR_BULK_EXPORT_IMPLEMENTATION.md`
- Usage Guide: `src/fhir/BULK_EXPORT_GUIDE.md`
- Quick Reference: `src/fhir/QUICK_REFERENCE.md`
- API Docs: `src/fhir/README.md`

### Troubleshooting
- [ ] Document common issues
- [ ] Create runbook for operations
- [ ] Set up support channels
- [ ] Train support team

## Sign-Off

- [ ] Development complete
- [ ] Code reviewed
- [ ] Tests passing
- [ ] Documentation complete
- [ ] Security reviewed
- [ ] Performance validated
- [ ] Deployment approved

**Deployed By:** _______________  
**Date:** _______________  
**Version:** _______________
