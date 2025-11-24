import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const VIDEO_STREAM_URL = 'http://localhost:5001';

const CCTVMonitor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [streamStatus, setStreamStatus] = useState({
    streaming: false,
    topic: 'video-stream',
    server: 'localhost:5001'
  });
  const [notification, setNotification] = useState({ message: '', type: '' });
  
  // Search states
  const [searchImage, setSearchImage] = useState(null);
  const [searchImagePreview, setSearchImagePreview] = useState(null);
  const [searchCameraIp, setSearchCameraIp] = useState('');
  const [searchThreshold, setSearchThreshold] = useState(0.6);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(location.state?.searchResults || null);
  
  // Missing persons list
  const [missingPersons, setMissingPersons] = useState([]);
  const [selectedMissingPerson, setSelectedMissingPerson] = useState(null);
  const [loadingMissingPersons, setLoadingMissingPersons] = useState(true);

  // Available cameras from backend
  const [availableCameras, setAvailableCameras] = useState([]);
  const [loadingCameras, setLoadingCameras] = useState(true);

  // Fetch missing persons list
  useEffect(() => {
    const fetchMissingPersons = async () => {
      try {
        setLoadingMissingPersons(true);
        const response = await axios.get(`${API_BASE}/api/missing-documents`);
        setMissingPersons(response.data);
      } catch (error) {
        console.error('Failed to fetch missing persons:', error);
        showNotification('Failed to load missing persons list', 'error');
      } finally {
        setLoadingMissingPersons(false);
      }
    };

    fetchMissingPersons();
  }, []);

  // Fetch active cameras from video stream server
  useEffect(() => {
    const fetchCameras = async () => {
      try {
        setLoadingCameras(true);
        const response = await axios.get(`${VIDEO_STREAM_URL}/api/camera/list`);
        
        // Transform response to match expected format
        const cameras = response.data.cameras.map(cam => ({
          id: cam.ip,
          name: `Camera ${cam.ip}`,
          ip: cam.ip,
          status: cam.status === 'running' ? 'Active' : 'Inactive',
          port: null,
          areaName: null
        }));
        
        setAvailableCameras(cameras);
      } catch (error) {
        console.error('Failed to fetch cameras:', error);
        showNotification('Failed to load active cameras', 'error');
      } finally {
        setLoadingCameras(false);
      }
    };

    fetchCameras();
    
    // Refresh camera list every 10 seconds
    const interval = setInterval(fetchCameras, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await axios.get(`${VIDEO_STREAM_URL}/api/status`);
        setStreamStatus(response.data);
      } catch (error) {
        console.error('Failed to check stream status:', error);
        setStreamStatus(prev => ({ ...prev, streaming: false }));
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 5000);
  };

  const handleMissingPersonSelect = async (personId) => {
    const person = missingPersons.find(p => p.id === parseInt(personId));
    if (person) {
      setSelectedMissingPerson(person);
      
      // Fetch the image from the backend
      try {
        const imageUrl = `${API_BASE}${person.facePictureUrl}`;
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], `${person.name}.jpg`, { type: 'image/jpeg' });
        
        setSearchImage(file);
        setSearchImagePreview(imageUrl);
      } catch (error) {
        console.error('Failed to load person image:', error);
        showNotification('Failed to load person image', 'error');
      }
    } else {
      setSelectedMissingPerson(null);
      setSearchImage(null);
      setSearchImagePreview(null);
    }
  };

  const handleSearchPerson = async () => {
    if (!searchImage) {
      showNotification('Please select an image', 'error');
      return;
    }
    if (!searchCameraIp) {
      showNotification('Please select a camera', 'error');
      return;
    }

    setIsSearching(true);
    setSearchResults(null);

    try {
      const formData = new FormData();
      formData.append('image', searchImage);
      formData.append('camera_ip', searchCameraIp);
      formData.append('threshold', searchThreshold);

      const response = await axios.post(
        `${VIDEO_STREAM_URL}/api/search/person-in-video`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const results = response.data;
      
      // Fetch frame images with bounding boxes for each detection
      if (results.detections && results.detections.length > 0) {
        const detectionsWithImages = await Promise.all(
          results.detections.map(async (detection) => {
            try {
              const imageResponse = await axios.post(
                `${VIDEO_STREAM_URL}/api/detection/frame-image`,
                {
                  camera_ip: searchCameraIp,
                  frame_number: detection.frame_number,
                  bbox: detection.bbox,
                  confidence: detection.confidence
                },
                { responseType: 'blob' }
              );
              
              const imageUrl = URL.createObjectURL(imageResponse.data);
              return { ...detection, imageUrl };
            } catch (error) {
              console.error(`Failed to fetch image for frame ${detection.frame_number}:`, error);
              return { ...detection, imageUrl: null };
            }
          })
        );
        
        results.detections = detectionsWithImages;
      }
      
      setSearchResults(results);
      
      if (results.total_detections > 0) {
        showNotification(
          `Found ${results.total_detections} detection(s) in camera ${searchCameraIp}!`,
          'success'
        );
      } else {
        showNotification('No matches found in the video', 'info');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Search failed';
      showNotification(errorMsg, 'error');
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    // Revoke object URLs to free memory
    if (searchResults?.detections) {
      searchResults.detections.forEach(detection => {
        if (detection.imageUrl) {
          URL.revokeObjectURL(detection.imageUrl);
        }
      });
    }
    
    setSearchImage(null);
    setSearchImagePreview(null);
    setSearchCameraIp('');
    setSearchResults(null);
    setSelectedMissingPerson(null);
  };

  const handleViewDetection = (detection, index) => {
    navigate('/police/cctv-report', {
      state: {
        detection,
        detectionIndex: index,
        totalDetections: searchResults.total_detections,
        searchResults
      }
    });
  };

  const handleOpenStreamWindow = (camera) => {
    // Open video stream in a new window
    const streamUrl = `${VIDEO_STREAM_URL}/video_feed/${camera.ip}`;
    const windowFeatures = 'width=800,height=600,menubar=no,toolbar=no,location=no,status=no';
    const streamWindow = window.open('', `camera_${camera.ip}`, windowFeatures);
    
    if (streamWindow) {
      streamWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${camera.name} - Live Stream</title>
            <style>
              body {
                margin: 0;
                padding: 0;
                background: #000;
                display: flex;
                flex-direction: column;
                height: 100vh;
                font-family: Arial, sans-serif;
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
              }
              .header-left {
                display: flex;
                align-items: center;
                gap: 10px;
              }
              .live-indicator {
                display: flex;
                align-items: center;
                gap: 5px;
                background: rgba(239, 68, 68, 0.9);
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: bold;
              }
              .live-dot {
                width: 8px;
                height: 8px;
                background: white;
                border-radius: 50%;
                animation: pulse 1.5s infinite;
              }
              @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.3; }
              }
              .camera-info {
                font-size: 18px;
                font-weight: bold;
              }
              .camera-ip {
                font-size: 12px;
                opacity: 0.9;
                background: rgba(255,255,255,0.2);
                padding: 3px 8px;
                border-radius: 10px;
              }
              .video-container {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
                overflow: hidden;
              }
              img {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
              }
              .footer {
                background: #1a1a1a;
                color: #888;
                padding: 10px 20px;
                text-align: center;
                font-size: 12px;
              }
              .status {
                color: #4ade80;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="header-left">
                <div class="live-indicator">
                  <div class="live-dot"></div>
                  LIVE
                </div>
                <div class="camera-info">${camera.name}</div>
                <div class="camera-ip">${camera.ip}</div>
              </div>
            </div>
            <div class="video-container">
              <img src="${streamUrl}?t=${Date.now()}" alt="${camera.name} Stream" />
            </div>
            <div class="footer">
              <span class="status">● Streaming</span> | Press Ctrl+W or close this window to stop
            </div>
          </body>
        </html>
      `);
      streamWindow.document.close();
    } else {
      showNotification('Failed to open stream window. Please allow pop-ups.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Notification */}
        {notification.message && (
          <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            notification.type === 'success' ? 'bg-green-100 text-green-800' :
            notification.type === 'error' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {notification.message}
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-xl shadow-2xl p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                <span className="text-5xl">🚔</span>
                CCTV Monitoring & Person Search
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Real-time Video Stream & Missing Person Detection</p>
            </div>
            
            <div className={`px-6 py-3 rounded-full font-semibold text-lg flex items-center gap-2 ${
              streamStatus.streaming 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              <span className={`w-3 h-3 rounded-full ${
                streamStatus.streaming ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`}></span>
              {streamStatus.streaming ? 'Stream Active' : 'Stream Inactive'}
            </div>
          </div>
        </div>

        {/* Search Person Section */}
        <div className="bg-white rounded-xl shadow-2xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-3xl">🔍</span>
            Search Missing Person in Video
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Select Missing Person */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">1. Select Missing Person</h3>
              <div className="space-y-3">
                {loadingMissingPersons ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-sm text-gray-600 mt-2">Loading missing persons...</p>
                  </div>
                ) : (
                  <select
                    value={selectedMissingPerson?.id || ''}
                    onChange={(e) => handleMissingPersonSelect(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a missing person...</option>
                    {missingPersons.map((person) => (
                      <option key={person.id} value={person.id}>
                        {person.name} - {person.age} years old
                      </option>
                    ))}
                  </select>
                )}
                
                {searchImagePreview && selectedMissingPerson && (
                  <div className="mt-3">
                    <img 
                      src={searchImagePreview} 
                      alt={selectedMissingPerson.name} 
                      className="w-full h-48 object-cover rounded-lg border-2 border-blue-300"
                    />
                    <div className="mt-2 text-sm text-gray-600">
                      <p className="font-semibold">{selectedMissingPerson.name}</p>
                      <p>Age: {selectedMissingPerson.age} | Gender: {selectedMissingPerson.gender}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Camera Selection */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">2. Select Camera</h3>
              {loadingCameras ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Loading cameras...</p>
                </div>
              ) : (
                <select
                  value={searchCameraIp}
                  onChange={(e) => setSearchCameraIp(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                >
                  <option value="">Select a camera...</option>
                  {availableCameras.map((camera) => (
                    <option key={camera.id} value={camera.ip}>
                      {camera.name} - {camera.ip}
                    </option>
                  ))}
                </select>
              )}
              
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confidence Threshold: {(searchThreshold * 100).toFixed(0)}%
                </label>
                <input
                  type="range"
                  min="0.3"
                  max="0.9"
                  step="0.05"
                  value={searchThreshold}
                  onChange={(e) => setSearchThreshold(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Less Strict</span>
                  <span>More Strict</span>
                </div>
              </div>
            </div>

            {/* Search Actions */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">3. Search</h3>
              <div className="space-y-3">
                <button
                  onClick={handleSearchPerson}
                  disabled={isSearching || !searchImage || !searchCameraIp}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSearching ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Start Search
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleClearSearch}
                  className="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-all"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Search Results */}
          {searchResults && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Search Results
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600">Camera</p>
                  <p className="text-2xl font-bold text-blue-600">{searchResults.camera_ip}</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600">Detections</p>
                  <p className="text-2xl font-bold text-green-600">{searchResults.total_detections}</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600">Total Frames</p>
                  <p className="text-2xl font-bold text-purple-600">{searchResults.total_frames}</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600">FPS</p>
                  <p className="text-2xl font-bold text-orange-600">{searchResults.fps?.toFixed(1)}</p>
                </div>
              </div>

              {searchResults.detections && searchResults.detections.length > 0 && (
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Detection Details:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.detections.map((detection, index) => (
                      <div 
                        key={index} 
                        className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => handleViewDetection(detection, index)}
                      >
                        {/* Detection Image */}
                        {detection.imageUrl ? (
                          <div className="relative">
                            <img 
                              src={detection.imageUrl} 
                              alt={`Detection ${index + 1}`}
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                              #{index + 1}
                            </div>
                            <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                              {detection.confidence}%
                            </div>
                            
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center">
                              <div className="opacity-0 hover:opacity-100 transition-opacity bg-white text-blue-600 px-3 py-2 rounded-lg text-sm font-semibold">
                                View Details
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-500">Image not available</span>
                          </div>
                        )}
                        
                        {/* Detection Info */}
                        <div className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                              Frame {detection.frame_number}
                            </span>
                            <span className="text-xs text-gray-500">
                              @ {detection.timestamp.toFixed(2)}s
                            </span>
                          </div>
                          
                          <div className="space-y-1 text-xs text-gray-600">
                            <div className="flex justify-between">
                              <span>Position:</span>
                              <span className="font-mono">({detection.bbox.x}, {detection.bbox.y})</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Size:</span>
                              <span className="font-mono">{detection.bbox.width}x{detection.bbox.height}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Distance:</span>
                              <span className="font-mono">{detection.distance.toFixed(4)}</span>
                            </div>
                          </div>
                          
                          {/* Click hint */}
                          <div className="mt-2 text-center text-xs text-blue-600 font-medium">
                            Click for full details →
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Available Cameras Info */}
        <div className="bg-white rounded-xl shadow-2xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-3xl">📹</span>
            Available Cameras ({availableCameras.length})
          </h2>
          
          {loadingCameras ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading active cameras...</p>
            </div>
          ) : availableCameras.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-lg mb-2">No active cameras found</p>
              <p className="text-sm text-gray-500">Start a camera using the API to see it here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {availableCameras.map((camera) => (
                <div key={camera.id} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`w-3 h-3 rounded-full ${
                      camera.status === 'Active' 
                        ? 'bg-green-500 animate-pulse' 
                        : 'bg-gray-400'
                    }`}></span>
                    <h3 className="font-semibold text-gray-800">{camera.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600">IP: {camera.ip}</p>
                  <p className={`text-xs mt-2 font-medium ${
                    camera.status === 'Active'
                      ? 'text-green-600'
                      : 'text-gray-500'
                  }`}>
                    ● {camera.status === 'Active' ? 'Streaming' : 'Stopped'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Camera Cards - Click to open stream in new window */}
        {availableCameras.filter(cam => cam.status === 'Active').length > 0 && (
          <div className="bg-white rounded-xl shadow-2xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-3xl">📺</span>
              Available Cameras ({availableCameras.filter(cam => cam.status === 'Active').length})
            </h2>
            
            <p className="text-gray-600 mb-4 text-sm">
              Click on any camera card to open live stream in a new window
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {availableCameras
                .filter(camera => camera.status === 'Active')
                .map((camera) => (
                  <div 
                    key={camera.id} 
                    className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all cursor-pointer group"
                    onClick={() => handleOpenStreamWindow(camera)}
                  >
                    {/* Camera Icon */}
                    <div className="flex justify-center mb-4">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-4 group-hover:scale-110 transition-transform">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Camera Info */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <h3 className="font-bold text-gray-800 text-lg">{camera.name}</h3>
                      </div>
                      
                      <div className="bg-white rounded-lg px-3 py-2 mb-3">
                        <p className="text-sm text-gray-600 font-mono">{camera.ip}</p>
                      </div>
                      
                      <div className="flex items-center justify-center gap-2 text-green-600 text-sm font-semibold">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        <span>● LIVE</span>
                      </div>
                    </div>
                    
                    {/* Hover Effect */}
                    <div className="mt-4 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold inline-flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Open Stream
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* System Info Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Kafka Server</h3>
            <p className="text-xl font-bold text-gray-800">{streamStatus.server}</p>
            <p className="text-xs text-gray-500 mt-1">Message Broker</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Active Streams</h3>
            <p className="text-xl font-bold text-green-600">
              {availableCameras.filter(cam => cam.status === 'Active').length} / {availableCameras.length}
            </p>
            <p className="text-xs text-gray-500 mt-1">Cameras Online</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How to Use
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Click on any camera card to open live stream in a new window</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Streams open in separate windows to prevent performance impact on main page</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Upload a person's image and select a camera to search for matches</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Camera list refreshes automatically every 60 seconds</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Close stream windows to stop video playback and save resources</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Use the API to start/stop cameras: POST /api/camera/start or /stop</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CCTVMonitor;
