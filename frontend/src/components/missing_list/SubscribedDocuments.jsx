import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import MissingDocumentDetailPopup from './MissingDocumentDetailPopup';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const SubscribedDocuments = () => {
  const [subscribedCases, setSubscribedCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSubscribedDocuments = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        setError('User not found. Please log in.');
        setLoading(false);
        return;
      }

      const user = JSON.parse(userStr);
      const volunteerId = user?.id;

      if (!volunteerId) {
        setError('Volunteer ID not found. Please log in as a volunteer.');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE}/api/missing-documents/subscriptions/${volunteerId}`);
      setSubscribedCases(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching subscribed documents:', err);
      setError('Failed to load subscribed cases. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscribedDocuments();
  }, [fetchSubscribedDocuments]);

  const handleUnsubscribe = (id) => {
    setSubscribedCases(prev => prev.filter(c => c.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading your subscriptions...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <button 
            onClick={fetchSubscribedDocuments}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex justify-center w-screen overflow-x-hidden">
        <div className="flex items-center justify-center gap-4 mt-24 mb-20">
          <div className="text-4xl font-bold font-sans">My Subscriptions</div>
          <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {subscribedCases.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Subscriptions Yet</h3>
            <p className="text-gray-500 mb-6">You haven't subscribed to any missing person cases yet.</p>
            <button 
              onClick={() => window.location.href = '/missingpeople'}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Browse Missing Persons
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <p className="text-gray-600">
                You are subscribed to <span className="font-semibold text-blue-600">{subscribedCases.length}</span> missing person case{subscribedCases.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="gap-6 px-4 md:px-0">
              {subscribedCases.map((element) => {
                const imageUrl = element.facePictureUrl?.startsWith('http') 
                  ? element.facePictureUrl 
                  : `${API_BASE}${element.facePictureUrl}`;

                return (
                  <SubscribedPersonCard
                    key={element.id}
                    id={element.id}
                    name={element.name}
                    image={imageUrl}
                    birthday={element.birthday}
                    gender={element.gender}
                    identityCardNumber={element.identityCardNumber}
                    height={element.height}
                    weight={element.weight}
                    identifyingCharacteristic={element.identifyingCharacteristic}
                    lastKnownOutfit={element.lastKnownOutfit}
                    medicalConditions={element.medicalConditions}
                    facePictureUrl={element.facePictureUrl}
                    missingTime={element.missingTime}
                    reportDate={element.reportDate}
                    reporterRelationship={element.reporterRelationship}
                    caseStatus={element.caseStatus}
                    missingArea={element.missingArea}
                    reporterId={element.reporterId}
                    onUnsubscribe={handleUnsubscribe}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const SubscribedPersonCard = (props) => {
  const [showPopup, setShowPopup] = useState(false);
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  
  const lookDetail = () => {
    setShowPopup(true);
  };

  const onClosePopup = () => {
    setShowPopup(false);
  };

  const handleUnsubscribe = async () => {
    if (!window.confirm('Are you sure you want to unsubscribe from updates for this missing person?')) {
      return;
    }

    setIsUnsubscribing(true);
    
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

      const response = await axios.delete(`${API_BASE}/api/missing-documents/subscriptions/${props.id}/${volunteerId}`);

      if (response.status === 200) {
        alert('Successfully unsubscribed from updates.');
        props.onUnsubscribe(props.id);
      }
    } catch (error) {
      console.error('Error unsubscribing:', error);
      alert(error.response?.data || 'An error occurred while unsubscribing.');
    } finally {
      setIsUnsubscribing(false);
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
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-semibold text-gray-900">{props.name}</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                </svg>
                Subscribed
              </span>
            </div>

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
                  <span className={`font-semibold text-sm ${
                    props.caseStatus === 'Missing' ? 'text-red-600' :
                    props.caseStatus === 'Found' ? 'text-green-600' :
                    'text-yellow-600'
                  }`}>{props.caseStatus}</span>
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
            <button 
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium text-sm shadow-sm disabled:bg-red-400"
              onClick={handleUnsubscribe}
              disabled={isUnsubscribing}
            >
              {isUnsubscribing ? 'Unsubscribing...' : 'Unsubscribe'}
            </button>
          </div>
        </div>
      </div>
      {showPopup && <MissingDocumentDetailPopup {...props} onClose={onClosePopup} />}
    </div>
  );
};

export default SubscribedDocuments;
