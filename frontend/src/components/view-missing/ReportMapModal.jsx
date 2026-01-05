import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom marker icons
const createCustomIcon = (color, text) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${text.length > 1 ? '10px' : '12px'};
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">
        ${text}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

const ReportMapModal = ({ isOpen, onClose, missingDocument, reports }) => {
  const [mapCenter, setMapCenter] = useState([16.0583, 108.2772]); // Default Vietnam center
  const [mapZoom, setMapZoom] = useState(10);

  // Calculate map center and zoom based on available coordinates
  React.useEffect(() => {
    if (isOpen) {
      const coordinates = [];
      
      // Add missing location coordinates
      if (missingDocument?.missingArea?.latitude && missingDocument?.missingArea?.longitude) {
        coordinates.push([
          parseFloat(missingDocument.missingArea.latitude),
          parseFloat(missingDocument.missingArea.longitude)
        ]);
      }
      
      // Add report coordinates
      reports.forEach(report => {
        if (report.latitude && report.longitude) {
          coordinates.push([parseFloat(report.latitude), parseFloat(report.longitude)]);
        }
      });
      
      if (coordinates.length > 0) {
        // Calculate bounds
        const lats = coordinates.map(coord => coord[0]);
        const lngs = coordinates.map(coord => coord[1]);
        const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
        const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
        
        setMapCenter([centerLat, centerLng]);
        
        // Calculate appropriate zoom level
        const latDiff = Math.max(...lats) - Math.min(...lats);
        const lngDiff = Math.max(...lngs) - Math.min(...lngs);
        const maxDiff = Math.max(latDiff, lngDiff);
        
        let zoom = 10;
        if (maxDiff < 0.01) zoom = 15;
        else if (maxDiff < 0.05) zoom = 13;
        else if (maxDiff < 0.1) zoom = 11;
        else if (maxDiff < 0.5) zoom = 9;
        else zoom = 7;
        
        setMapZoom(zoom);
      }
    }
  }, [isOpen, missingDocument, reports]);

  const getMarkerColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'verified': return '#16a34a';
      case 'pending': return '#eab308';
      case 'rejected': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const formatLocation = (area) => {
    if (!area) return 'Unknown';
    const parts = [];
    if (area.commune) parts.push(area.commune);
    if (area.district) parts.push(area.district);
    if (area.province) parts.push(area.province);
    if (area.country) parts.push(area.country);
    return parts.join(', ');
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <style>
        {`
          .custom-marker {
            background: transparent !important;
            border: none !important;
          }
          .leaflet-popup-content-wrapper {
            border-radius: 8px;
          }
          .leaflet-popup-content {
            margin: 8px 12px;
            line-height: 1.4;
          }
        `}
      </style>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Report Locations Map</h2>
              <p className="text-sm text-gray-600">
                {missingDocument?.name} - {reports.length} report(s)
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Legend */}
          <div className="px-4 py-2 bg-gray-50 border-b">
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">M</span>
                </div>
                <span>Missing Location</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-600 flex items-center justify-center">
                  <span className="text-white text-xs">#</span>
                </div>
                <span>Verified Report</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-600 flex items-center justify-center">
                  <span className="text-white text-xs">#</span>
                </div>
                <span>Pending Report</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center">
                  <span className="text-white text-xs">#</span>
                </div>
                <span>Rejected Report</span>
              </div>
            </div>
          </div>

          {/* Map Container */}
          <div className="flex-1 relative">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              className="w-full h-full"
              style={{ height: '100%', minHeight: '400px' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {/* Missing Location Marker */}
              {missingDocument?.missingArea?.latitude && missingDocument?.missingArea?.longitude && (
                <Marker
                  position={[
                    parseFloat(missingDocument.missingArea.latitude),
                    parseFloat(missingDocument.missingArea.longitude)
                  ]}
                  icon={createCustomIcon('#dc2626', 'M')}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold text-red-600 mb-2">Missing Location</h3>
                      <p><strong>Name:</strong> {missingDocument.name}</p>
                      <p><strong>Missing Since:</strong> {new Date(missingDocument.missingTime).toLocaleString('vi-VN')}</p>
                      <p><strong>Location:</strong> {formatLocation(missingDocument.missingArea)}</p>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Report Markers */}
              {reports.map((report, index) => {
                if (!report.latitude || !report.longitude) return null;
                
                const markerColor = getMarkerColor(report.reportStatus);
                
                return (
                  <Marker
                    key={report.id}
                    position={[parseFloat(report.latitude), parseFloat(report.longitude)]}
                    icon={createCustomIcon(markerColor, (index + 1).toString())}
                  >
                    <Popup>
                      <div className="p-2 max-w-xs">
                        <h3 className="font-semibold text-blue-600 mb-2">Report #{report.id}</h3>
                        <p><strong>Reporter:</strong> {report.volunteerName}</p>
                        <p><strong>Status:</strong> 
                          <span 
                            className="px-2 py-1 rounded text-xs ml-1"
                            style={{ 
                              backgroundColor: `${markerColor}20`, 
                              color: markerColor 
                            }}
                          >
                            {report.reportStatus || 'Pending'}
                          </span>
                        </p>
                        <p><strong>Time:</strong> {new Date(report.reportTime).toLocaleString('vi-VN')}</p>
                        <p><strong>Location:</strong> {formatLocation(report.sightingArea)}</p>
                        {report.description && (
                          <p><strong>Description:</strong> {report.description}</p>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Click on markers to view detailed information
              </div>
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportMapModal;