import axios from 'axios';
import React, { useState, useEffect } from 'react';
import MissingDocumentDetailPopup from './MissingDocumentDetailPopup';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const PersonCard = (props) => {
  const [showPopup, setShowPopup] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const navigate = useNavigate()
  
  const lookDetail = (id) => {
    navigate(`/missing-document/${id}`);
  };

  const onClosePopup = () => {
    setShowPopup(false);
  };

  // Check if user is already subscribed
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          setCheckingSubscription(false);
          return;
        }

        const user = JSON.parse(userStr);
        const volunteerId = user?.id;

        if (!volunteerId) {
          setCheckingSubscription(false);
          return;
        }

        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE}/api/missing-documents/subscriptions/${volunteerId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Check if current document is in subscribed list
        const subscribed = response.data.some(doc => doc.id === props.id);
        setIsSubscribed(subscribed);
      } catch (error) {
        console.error('Error checking subscription:', error);
      } finally {
        setCheckingSubscription(false);
      }
    };

    checkSubscription();
  }, [props.id]);

  const onSubscribe = async (missingDocumentId) => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        alert('User not found. Please log in.');
        return;
      }

      const user = JSON.parse(userStr);
      const volunteerId = user?.id;

      if (!volunteerId) {
        alert('Volunteer ID not found. Please log in as a volunteer.');
        return;
      }

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
        setIsSubscribed(true);
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
      <div className="mx-4 md:mx-20 my-4">
        <div className="flex flex-col md:flex-row rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex-shrink-0 mb-4 md:mb-0">
            <img className="w-full md:w-40 h-40 rounded-md object-cover" src={props.image} alt={props.name} />
          </div>

          <div className="flex flex-col px-0 md:px-6 flex-grow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{props.name}</h2>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-gray-300 p-3 bg-gray-50 flex-1">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-semibold text-gray-800 text-sm">{formattedMissingTime}</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">Missing From</div>
              </div>

              <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-gray-300 p-3 bg-gray-50 flex-1">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold text-gray-800 text-sm">{props.caseStatus}</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">Status</div>
              </div>

              <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-gray-300 p-3 bg-gray-50 flex-1">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-semibold text-gray-800 text-sm text-center">{areaString}</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">Last Seen Area</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4 md:mt-0 md:ml-4 justify-center">
            <button 
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm"
              onClick={() => lookDetail(props.id)}
            >
              View Details
            </button>
            {props.caseStatus !== 'Found' && !isSubscribed && !checkingSubscription && (
              <button 
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium text-sm shadow-sm"
                onClick={() => onSubscribe(props.id)}
              >
                Subscribe
              </button>
            )}
            {isSubscribed && (
              <div className="px-6 py-2 bg-gray-100 text-gray-600 rounded-md text-center font-medium text-sm">
                ✓ Subscribed
              </div>
            )}
          </div>
        </div>
      </div>
      {showPopup && <MissingDocumentDetailPopup {...props} onClose={onClosePopup} />}
    </div>
  );
};

export default PersonCard;