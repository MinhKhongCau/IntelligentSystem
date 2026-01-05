# Missing Document Controller API Documentation

## Volunteer Report Management APIs

### 1. Update Volunteer Report
**PUT** `/api/missing-documents/reports/{reportId}`

Updates a volunteer report's details.

**Parameters:**
- `reportId` (path) - ID of the report to update
- `description` (form) - Updated description (optional)
- `sightingPicture` (form) - Updated sighting picture URL (optional)
- `sightingAreaId` (form) - Updated sighting area ID (optional)
- `latitude` (form) - Updated latitude coordinate (optional)
- `longitude` (form) - Updated longitude coordinate (optional)

**Response:**
- `200 OK` - Report updated successfully
- `404 NOT_FOUND` - Report not found
- `400 BAD_REQUEST` - Invalid area ID or coordinate format

**Example:**
```bash
curl -X PUT "http://localhost:8080/api/missing-documents/reports/123" \
  -H "Authorization: Bearer {token}" \
  -d "description=Updated sighting description" \
  -d "sightingAreaId=456" \
  -d "latitude=10.7769" \
  -d "longitude=106.7009"
```

### 2. Update Volunteer Report Status
**PUT** `/api/missing-documents/reports/{reportId}/status`

Updates the status of a volunteer report.

**Parameters:**
- `reportId` (path) - ID of the report to update
- `status` (form) - New status (Missing, Found, Rejected)

**Response:**
- `200 OK` - Status updated successfully
- `404 NOT_FOUND` - Report not found
- `400 BAD_REQUEST` - Invalid status value

**Example:**
```bash
curl -X PUT "http://localhost:8080/api/missing-documents/reports/123/status" \
  -H "Authorization: Bearer {token}" \
  -d "status=Found"
```

### 3. Get Single Volunteer Report
**GET** `/api/missing-documents/reports/single/{reportId}`

Retrieves a specific volunteer report by ID.

**Parameters:**
- `reportId` (path) - ID of the report to retrieve

**Response:**
- `200 OK` - Returns VolunteerReportDTO
- `404 NOT_FOUND` - Report not found

**Example:**
```bash
curl -X GET "http://localhost:8080/api/missing-documents/reports/single/123" \
  -H "Authorization: Bearer {token}"
```

### 4. Delete Volunteer Report
**DELETE** `/api/missing-documents/reports/{reportId}`

Deletes a volunteer report (only if status is "Missing").

**Parameters:**
- `reportId` (path) - ID of the report to delete

**Response:**
- `200 OK` - Report deleted successfully
- `404 NOT_FOUND` - Report not found
- `400 BAD_REQUEST` - Cannot delete processed reports

**Example:**
```bash
curl -X DELETE "http://localhost:8080/api/missing-documents/reports/123" \
  -H "Authorization: Bearer {token}"
```

## Existing APIs

### 5. Get Reports by Missing Document
**GET** `/api/missing-documents/reports/{missingDocumentId}`

Retrieves all reports for a specific missing document.

### 6. Submit New Report
**POST** `/api/missing-documents/submit-missing-person`

Submits a new volunteer report for a missing person.

### 7. Update Missing Document Status
**PUT** `/api/missing-documents/{id}/update-status`

Updates the status of a missing document.

### 8. Mark Document as Found
**PUT** `/api/missing-documents/{id}/mark-found`

Marks a missing document as found.

## Status Values

### Volunteer Report Status
- **Missing** - Report is pending review
- **Found** - Report has been verified and person found
- **Rejected** - Report has been rejected/invalid

### Missing Document Status
- **Missing** - Person is still missing
- **Found** - Person has been found
- **Rejected** - Case has been rejected
- **Accepted** - Case has been accepted for investigation

## Security Notes

- All endpoints require authentication via Bearer token
- Users can only edit/delete their own reports
- Only reports with "Missing" status can be edited or deleted
- Proper validation is enforced on all input parameters