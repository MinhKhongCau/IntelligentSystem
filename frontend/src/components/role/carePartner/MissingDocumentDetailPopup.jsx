import React from 'react';

const MissingDocumentDetailPopup = ({ onClose, ...props }) => {
  const formattedMissingTime = props.missingTime 
    ? new Date(props.missingTime).toLocaleString() 
    : 'N/A';

  const areaString = props.missingArea 
    ? `${props.missingArea.province}, ${props.missingArea.country}`
    : 'N/A';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Missing Person Details</h3>
          <div className="mt-2 px-7 py-3">
            <img className="w-full h-64 object-cover rounded-md mb-4" src={props.image} alt={props.name} />
            <p className="text-sm text-gray-500 text-left"><strong>Name:</strong> {props.name}</p>
            <p className="text-sm text-gray-500 text-left"><strong>Birthday:</strong> {props.birthday}</p>
            <p className="text-sm text-gray-500 text-left"><strong>Gender:</strong> {props.gender}</p>
            <p className="text-sm text-gray-500 text-left"><strong>Identity Card:</strong> {props.identityCardNumber}</p>
            <p className="text-sm text-gray-500 text-left"><strong>Height:</strong> {props.height} cm</p>
            <p className="text-sm text-gray-500 text-left"><strong>Weight:</strong> {props.weight} kg</p>
            <p className="text-sm text-gray-500 text-left"><strong>Characteristic:</strong> {props.identifyingCharacteristic}</p>
            <p className="text-sm text-gray-500 text-left"><strong>Last Known Outfit:</strong> {props.lastKnownOutfit}</p>
            <p className="text-sm text-gray-500 text-left"><strong>Medical Conditions:</strong> {props.medicalConditions}</p>
            <p className="text-sm text-gray-500 text-left"><strong>Missing Time:</strong> {formattedMissingTime}</p>
            <p className="text-sm text-gray-500 text-left"><strong>Report Date:</strong> {props.reportDate}</p>
            <p className="text-sm text-gray-500 text-left"><strong>Relationship:</strong> {props.reporterRelationship}</p>
            <p className="text-sm text-gray-500 text-left"><strong>Missing Area:</strong> {areaString}</p>
            <p className="text-sm text-gray-500 text-left"><strong>Case Status:</strong> {props.caseStatus}</p>
          </div>
          <div className="items-center px-4 py-3">
            <button
              id="ok-btn"
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
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