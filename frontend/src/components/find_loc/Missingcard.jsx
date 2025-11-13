import React from 'react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const Missingcard = ({ document }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const areaString = document.missingArea 
    ? `${document.missingArea.commune || ''}${document.missingArea.commune ? ', ' : ''}${document.missingArea.district || ''}${document.missingArea.district ? ', ' : ''}${document.missingArea.province}`
    : 'N/A';

  return (
    <div className="m-4 w-80 bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-64 bg-gray-200">
        <img 
          src={`${API_BASE}${document.facePictureUrl}`}
          alt={document.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/default-avatar.png';
          }}
        />
        <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          Missing
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-3">{document.name}</h3>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <span className="font-medium">Missing Since:</span>
              <br />
              {formatDate(document.missingTime)}
            </div>
          </div>

          <div className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <span className="font-medium">Last Seen:</span>
              <br />
              {areaString}
            </div>
          </div>

          {document.gender && (
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-medium">Gender:</span>
              <span className="ml-1">{document.gender ? 'Female' : 'Male'}</span>
            </div>
          )}

          {document.height && (
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              <span className="font-medium">Height:</span>
              <span className="ml-1">{document.height} cm</span>
            </div>
          )}

          {document.identifyingCharacteristic && (
            <div className="flex items-start">
              <svg className="w-5 h-5 mr-2 mt-0.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <span className="font-medium">Characteristics:</span>
                <br />
                <span className="text-xs">{document.identifyingCharacteristic}</span>
              </div>
            </div>
          )}
        </div>

        {/* Status Badge */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            document.caseStatus === 'Missing' 
              ? 'bg-red-100 text-red-800' 
              : document.caseStatus === 'Found'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            Status: {document.caseStatus || 'Unknown'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Missingcard;
