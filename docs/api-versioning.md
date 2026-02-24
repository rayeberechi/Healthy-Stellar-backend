# API Versioning Strategy

## Overview

As the Medical Records Management System evolves, maintaining backwards compatibility for existing API consumers is critical. We use **URI-based versioning** to ensure that breaking changes can be introduced safely in new versions without disrupting clients using older versions.

## Global Versioning Rules

- All new controllers should be versioned. The application has globally enabled URI-based versioning.
- The `defaultVersion` is set to `1`.
- For clients requesting unversioned endpoints (e.g. `/records`), the system will automatically fallback to version `1` (e.g. `/v1/records`).

### Example

Standard controller with version 1:

```typescript
@Controller({
  version: '1',
  path: 'records', // URI will be /v1/records
})
export class RecordsController {}
```

## Neutral Versioning

Enpoints like health checks (`/health`) or top-level app metadata (`/`) should not be versioned, as they represent the overall state of the service.
Use `@Version(VERSION_NEUTRAL)` to explicitly exclude an endpoint from the `/vX/` prefix.

```typescript
import { Controller, Get, Version, VERSION_NEUTRAL } from '@nestjs/common';

@Version(VERSION_NEUTRAL)
@Controller('health')
export class HealthController {}
```

## Deprecating Routes

When a route is scheduled to be removed in future versions, we use the custom `@DeprecatedRoute()` decorator. This adds standardized HTTP headers to warn consumers.

### Headers Provided

- `Deprecation: true`
- `Sunset: <date>` (optional)
- `Link: <alternative_url>; rel="alternate"` (optional)

### Usage

```typescript
import { DeprecatedRoute } from '../common/decorators/deprecated.decorator';

@DeprecatedRoute({
  sunsetDate: 'Wed, 11 Nov 2026 11:00:00 GMT',
  alternativeRoute: '/v2/records'
})
@Get('old-endpoint')
getOldData() {}
```
