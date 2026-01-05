# Report Map Modal

This component displays an interactive map showing the locations of missing person reports and the original missing location.

## Features

- **Interactive Map**: Uses Leaflet/OpenStreetMap for reliable map display
- **Custom Markers**: 
  - Red marker with "M" for missing location
  - Colored numbered markers for reports (green=verified, yellow=pending, red=rejected)
- **Info Popups**: Click markers to see detailed information
- **Auto-centering**: Map automatically centers and zooms to show all markers
- **Legend**: Clear visual guide for marker meanings

## Usage

```jsx
import ReportMapModal from './ReportMapModal';

<ReportMapModal
  isOpen={showMapModal}
  onClose={() => setShowMapModal(false)}
  missingDocument={document}
  reports={reports}
/>
```

## Props

- `isOpen` (boolean): Controls modal visibility
- `onClose` (function): Callback when modal is closed
- `missingDocument` (object): Missing person document with missingArea coordinates
- `reports` (array): Array of report objects with latitude/longitude

## Data Requirements

### Missing Document
```javascript
{
  name: "Person Name",
  missingTime: "2024-01-01T00:00:00Z",
  missingArea: {
    latitude: "10.7769",
    longitude: "106.7009",
    commune: "Ward Name",
    district: "District Name", 
    province: "Province Name",
    country: "Country Name"
  }
}
```

### Reports
```javascript
[
  {
    id: 1,
    latitude: "10.7800",
    longitude: "106.7100", 
    volunteerName: "Reporter Name",
    reportStatus: "verified", // "verified", "pending", "rejected"
    reportTime: "2024-01-02T00:00:00Z",
    description: "Report description",
    sightingArea: {
      commune: "Ward Name",
      district: "District Name",
      province: "Province Name", 
      country: "Country Name"
    }
  }
]
```

## Dependencies

- `react-leaflet`: Map components
- `leaflet`: Core mapping library
- Tailwind CSS for styling