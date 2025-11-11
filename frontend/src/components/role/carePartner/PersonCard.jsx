import axios from 'axios';
import React, { useState } from 'react';
import MissingDocumentEditPopup from './MissingDocumentDetailPopup';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const PersonCard = (props) => {
  const [showPopup, setShowPopup] = useState(false);
  
  const lookDetail = async (id) => {
    setShowPopup(true);
  };

  const onClosePopup = () => {
    setShowPopup(false);
  };

  const handleSave = async (updatedData) => {
    try {
      const response = await axios.put(`${API_BASE}/api/missing-documents/${props.id}`, updatedData);
      
      if (response.status === 200) {
        alert('Successfully updated missing person information.');
        // Optionally refresh the data or update parent component
        if (props.onUpdate) {
          props.onUpdate(response.data);
        }
      }
    } catch (error) {
      console.error('Error updating missing person:', error);
      alert('An error occurred while updating the information.');
    }
  };

  const onSubscribe = async (missingDocumentId) => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        alert('User not found. Please log in.');
        return;
      }

      const user = JSON.parse(userStr);
      const volunteerId = user?.id;
      console.log('volunteer id: ', volunteerId)

      if (!volunteerId) {
        alert(user, 'Volunteer ID not found. Please log in as a volunteer.')
        return;
      }

      // Create FormData to match backend's MULTIPART_FORM_DATA expectation
      const formData = new FormData();
      formData.append('missing_document_id', missingDocumentId);
      formData.append('volunteer_id', volunteerId);

      const response = await axios.post(`${API_BASE}/api/missing-documents/subcribe`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        alert('Successfully subscribed to updates for this missing person.');
      } else {
        alert('Subscription failed.');
      }
    } catch (error) {
      console.error('Error subscribing to missing person updates:', error);
      alert(error.response?.data || 'An error occurred while subscribing.');
    }
  };

  const formattedMissingTime = props.missingTime 
    ? new Date(props.missingTime).toLocaleString() 
    : 'N/A';
  
  const areaString = props.missingArea 
    ? `${props.missingArea.province}, ${props.missingArea.country}`
    : 'N/A';

  return (
    <div>
      <div className="mx-20 grid my-4">
        <div className="flex flex-row rounded-lg border border-gray-200/80 bg-white p-6">
          <div className="relative">
            <img className="w-40 h-40 rounded-md object-cover" src={props.image} alt={props.name} />
          </div>

          <div className="flex flex-col px-6">
            <div className="flex h-8 flex-row">
              <h2 className="text-lg font-semibold">{props.name}</h2>
            </div>


            <div className="mt-2 flex flex-row items-center space-x-5">
              {/* Box 1: Missing Time */}
              <div className="flex h-20 w-48 flex-col items-center justify-center rounded-md border border-dashed border-gray-200 p-2">
                <div className="flex flex-row items-center justify-center text-center">
                  <img src="https://img.icons8.com/material-outlined/24/000000/calendar-13.png" width="20" alt="" />
                  <span className="font-bold text-black-600 ml-1">{formattedMissingTime}</span>
                </div>
                <div className="mt-2 text-sm text-black-400">Missing From</div>
              </div>

              {/* Box 2: Case Status */}
              <div className="flex h-20 w-40 flex-col items-center justify-center rounded-md border border-dashed border-gray-200 p-2">
                <div className="flex flex-row items-center justify-center">
                  {/* Icon cho status */}
                  <img src="https://img.icons8.com/ios/50/000000/process.png" width="24" alt="" />
                  <span className="font-bold text-black-600 ml-1">{props.caseStatus}</span>
                </div>
                <div className="mt-2 text-sm text-black-400">Status</div>
              </div>

              {/* Box 3: Area */}
              <div className="flex h-20 w-48 flex-col items-center justify-center rounded-md border border-dashed border-gray-200 p-2 text-center">
                <div className="flex flex-row items-center justify-center">
                  <img src="https://img.icons8.com/material-outlined/24/000000/marker.png" width="20" alt="" />
                  <span className="font-bold text-black-600 ml-1">{areaString}</span>
                </div>
                <div className="mt-2 text-sm text-black-400">Last Seen Area</div>
              </div>
            </div>
          </div>

          <div className="w-100 flex flex-grow flex-col items-end justify-start">
            <div className="flex flex-col space-x-3">
              <button className="flex rounded-md bg-blue-500 py-2 px-4 text-white mb-2 w-60 justify-center" onClick={() => lookDetail(props.id)}>
                Update
              </button>
              <button className="flex rounded-md bg-green-500 py-2 px-4 text-white mb-2 w-60 justify-center" onClick={() => onSubscribe(props.id)}>
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
      {showPopup && <MissingDocumentEditPopup initialData={props} onClose={onClosePopup} onSave={handleSave} />}
    </div>
  );
};

export default PersonCard;