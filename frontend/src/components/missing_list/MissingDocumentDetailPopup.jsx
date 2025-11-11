import React from 'react';

const MissingDocumentDetailPopup = ({ onClose, ...props }) => {
  const formattedMissingTime = props.missingTime 
    ? new Date(props.missingTime).toLocaleString() 
    : 'N/A';

  const areaString = props.missingArea 
    ? `${props.missingArea.province}, ${props.missingArea.country}`
    : 'N/A';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex items-center justify-center overflow-y-auto p-4" onClick={onClose}>
      <div 
        className="relative bg-white rounded-lg shadow-2xl w-full max-w-lg md:max-w-xl lg:max-w-2xl transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">Missing Person Details</h3>
          
          <div className="mb-6">
            {props.image ? (
              <img 
                className="w-full h-64 object-cover rounded-md border border-gray-300" 
                src={props.image} 
                alt={props.name || 'Missing Person'} 
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 border border-gray-300">
                No Image Available
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
            <div className="col-span-1">
              <p className="text-sm font-medium text-gray-700">Name</p>
              <p className="text-sm text-gray-900 mt-1">{props.name || 'N/A'}</p>
            </div>
            <div className="col-span-1">
              <p className="text-sm font-medium text-gray-700">Birthday</p>
              <p className="text-sm text-gray-900 mt-1">{props.birthday || 'N/A'}</p>
            </div>
            <div className="col-span-1">
              <p className="text-sm font-medium text-gray-700">Gender</p>
              <p className="text-sm text-gray-900 mt-1">{props.gender || 'N/A'}</p>
            </div>
            <div className="col-span-1">
              <p className="text-sm font-medium text-gray-700">Identity Card</p>
              <p className="text-sm text-gray-900 mt-1">{props.identityCardNumber || 'N/A'}</p>
            </div>
            <div className="col-span-1">
              <p className="text-sm font-medium text-gray-700">Height</p>
              <p className="text-sm text-gray-900 mt-1">{props.height ? `${props.height} cm` : 'N/A'}</p>
            </div>
            <div className="col-span-1">
              <p className="text-sm font-medium text-gray-700">Weight</p>
              <p className="text-sm text-gray-900 mt-1">{props.weight ? `${props.weight} kg` : 'N/A'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-gray-700">Identifying Characteristic</p>
              <p className="text-sm text-gray-900 mt-1">{props.identifyingCharacteristic || 'N/A'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-gray-700">Last Known Outfit</p>
              <p className="text-sm text-gray-900 mt-1">{props.lastKnownOutfit || 'N/A'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-gray-700">Medical Conditions</p>
              <p className="text-sm text-gray-900 mt-1">{props.medicalConditions || 'N/A'}</p>
            </div>
            <div className="col-span-1">
              <p className="text-sm font-medium text-gray-700">Missing Time</p>
              <p className="text-sm text-gray-900 mt-1">{formattedMissingTime}</p>
            </div>
            <div className="col-span-1">
              <p className="text-sm font-medium text-gray-700">Report Date</p>
              <p className="text-sm text-gray-900 mt-1">{props.reportDate || 'N/A'}</p>
            </div>
            <div className="col-span-1">
              <p className="text-sm font-medium text-gray-700">Reporter Relationship</p>
              <p className="text-sm text-gray-900 mt-1">{props.reporterRelationship || 'N/A'}</p>
            </div>
            <div className="col-span-1">
              <p className="text-sm font-medium text-gray-700">Case Status</p>
              <p className="text-sm text-gray-900 mt-1">{props.caseStatus || 'N/A'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-gray-700">Missing Area</p>
              <p className="text-sm text-gray-900 mt-1">{areaString}</p>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white text-base font-medium rounded-md shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissingDocumentDetailPopup;