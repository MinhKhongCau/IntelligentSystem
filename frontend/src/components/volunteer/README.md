# Volunteer Components

This directory contains components related to volunteer functionality.

## MyFoundCases Component

Displays all the found case reports submitted by the current volunteer user.

### Features

- **Personal Reports**: Shows only reports submitted by the logged-in volunteer
- **Case Information**: Displays the missing person details for each report
- **Status Tracking**: Shows verification status (Missing, Found, Rejected)
- **Photo Display**: Shows sighting photos if available
- **Location Details**: Displays where the sighting occurred
- **Navigation**: Links to view full case details and edit reports
- **Edit Functionality**: Allows editing reports with "Missing" status
- **Delete Functionality**: Allows deleting reports with "Missing" status
- **Statistics Dashboard**: Shows counts by status
- **Filter & Sort**: Filter by status and sort by date or status

## EditFoundCase Component

Allows volunteers to edit their submitted found case reports.

### Features

- **Report Editing**: Update description, location, and coordinates
- **Validation**: Ensures required fields are filled
- **Original Info Display**: Shows original report information for reference
- **Area Selection**: Choose from available sighting areas
- **Coordinate Input**: Optional latitude/longitude input
- **Status Restriction**: Only reports with "Missing" status can be edited

### Usage

```jsx
import MyFoundCases from './components/volunteer/MyFoundCases';
import EditFoundCase from './components/volunteer/EditFoundCase';

// Routes in App.js
<Route path="/my-found-cases" element={
  <ProtectedRoute>
    <MyFoundCases/>
  </ProtectedRoute>
} />
<Route path="/my-found-cases/edit/:reportId" element={
  <ProtectedRoute>
    <EditFoundCase/>
  </ProtectedRoute>
} />
```

### Data Flow

1. **MyFoundCases**: Fetches all missing documents and their reports, filters by current user
2. **EditFoundCase**: Finds specific report by ID, allows editing, updates via API
3. **Backend API**: Handles report updates with validation and data persistence

### API Endpoints Used

- `GET /api/missing-documents` - Get all missing documents
- `GET /api/missing-documents/reports/{id}` - Get reports for each document
- `PUT /api/missing-documents/reports/{reportId}` - Update specific report
- `PUT /api/missing-documents/reports/{reportId}/status` - Update report status
- `DELETE /api/missing-documents/reports/{reportId}` - Delete specific report
- `GET /api/areas` - Get available areas for location selection

### Navigation Flow

```
Dashboard → My Found Cases → Edit Report → Back to My Found Cases
     ↓              ↓              ↓
Browse Missing → Report Finding → Update Report
```

### Edit & Delete Restrictions

- Only reports with "Missing" status can be edited or deleted
- Users can only edit/delete their own reports
- All form validation is enforced
- Changes update the report timestamp
- Delete requires confirmation modal