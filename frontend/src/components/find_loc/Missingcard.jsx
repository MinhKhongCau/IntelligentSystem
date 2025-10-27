import React from 'react';

const Missingcard = ({ document }) => {
  const {
    fullName,
    facePictureUrl,
    identityCardNumber,
    missingTime,
    missingArea,
  } = document;

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  const imageUrl = facePictureUrl?.startsWith('http') ? facePictureUrl : `${API_BASE}${facePictureUrl}`;

  return (
    <div className="mx-12">
      <div className="flex justify-center my-5 ">
        <div className="flex flex-col md:flex-row md:max-w-xl rounded-lg bg-white shadow-lg ">
          <img className="w-full h-96 md:h-auto object-cover md:w-40 rounded-t-lg md:rounded-none md:rounded-l-lg" src={imageUrl} alt={fullName || 'Missing Person'} />
          <div className="p-4 flex flex-col justify-start ">
            <div className="flex ">
              <h5 className="text-gray-900 text-xl font-medium mb-2">{fullName}</h5>
              {identityCardNumber && <h6 className="ml-5 text-gray-700 text-l font-medium mb-2">ID: {identityCardNumber}</h6>}
            </div>
            <div className="text-gray-700 text-base mb-4">
              <span className="text-gray-900 text-m font-medium mb-2 mx-1">Last Seen Time:</span> {new Date(missingTime).toLocaleString()}
            </div>
            <div className="text-gray-700 text-base ">
              <p><span className="text-gray-900 text-m font-medium">Last Seen Area:</span></p>
              <p className="text-gray-700 text-base mb-1">
                {missingArea?.commune}, {missingArea?.district}
              </p>
              <p className="text-gray-700 text-base mb-1">
                {missingArea?.province}, {missingArea?.country}
              </p>
              <p className="text-gray-700 text-base">
                (Lat: {missingArea?.latitude}, Lng: {missingArea?.longitude})
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Missingcard;