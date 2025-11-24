import { useState, useEffect } from 'react';
import axios from 'axios';
import CCTVReportModal from './CCTVReportModal';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const VIDEO_STREAM_URL = 'http://localhost:5001';

const CCTVMonitor = () => {
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
  const [searchResults, setSearchResults] = useState(null);

  // Available cameras from backend
  const [availableCameras, setAvailableCameras] = useState([]);
  const [loadingCameras, setLoadingCameras] = useState(true);

  // Modal state
  const [selectedDetection, setSelectedDetection] = useState(null);
  const [selectedDetectionIndex, setSelectedDetectionIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Streaming state - track which cameras are actively streaming
  const [streamingCameras, setStreamingCameras] = useState(new Set());

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

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSearchImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSearchImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
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
  };

  const handleViewDetection = (detection, index) => {
    setSelectedDetection(detection);
    setSelectedDetectionIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDetection(null);
    setSelectedDetectionIndex(null);
  };

  const handleToggleStream = (cameraIp) => {
    setStreamingCameras(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cameraIp)) {
        newSet.delete(cameraIp);
      } else {
        newSet.add(cameraIp);
      }
      return newSet;
    });
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
            {/* Image Upload */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">1. Upload Person Image</h3>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {searchImagePreview && (
                  <div className="mt-3">
                    <img 
                      src={searchImagePreview} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-lg border-2 border-blue-300"
                    />
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
                      <div key={index} className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
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

        {/* Video Streams - Only show active cameras */}
        {availableCameras.filter(cam => cam.status === 'Active').length > 0 && (
          <div className="bg-white rounded-xl shadow-2xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-3xl">📺</span>
              Live Streams ({availableCameras.filter(cam => cam.status === 'Active').length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCameras
                .filter(camera => camera.status === 'Active')
                .map((camera) => {
                  const isStreaming = streamingCameras.has(camera.ip);
                  
                  return (
                    <div key={camera.id} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
                      {/* Camera Header */}
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                          <h3 className="text-white font-semibold text-sm">{camera.name}</h3>
                        </div>
                        <span className="text-white text-xs bg-white/20 px-2 py-1 rounded-full">
                          {camera.ip}
                        </span>
                      </div>
                      
                      {/* Video Stream or Snapshot */}
                      <div 
                        className="relative bg-black aspect-video cursor-pointer group"
                        onClick={() => handleToggleStream(camera.ip)}
                      >
                        {isStreaming ? (
                          // Live Stream
                          <>
                            <img 
                              className="w-full h-full object-contain"
                              src={`${VIDEO_STREAM_URL}/video_feed/${camera.ip}?t=${Date.now()}`}
                              alt={`${camera.name} Stream`}
                              onError={(e) => {
                                console.error(`Failed to load stream for ${camera.ip}`);
                              }}
                            />
                            
                            {/* Live indicator */}
                            <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                              LIVE
                            </div>
                            
                            {/* Stop button overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
                                Click to Stop
                              </div>
                            </div>
                          </>
                        ) : (
                          // Static Snapshot
                          <>
                            <img 
                              className="w-full h-full object-contain"
                              src={`${VIDEO_STREAM_URL}/video_feed/${camera.ip}?t=${Date.now()}`}
                              alt={`${camera.name} Snapshot`}
                              onError={(e) => {
                                console.error(`Failed to load snapshot for ${camera.ip}`);
                              }}
                            />
                            
                            {/* Play button overlay */}
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all flex items-center justify-center">
                              <div className="bg-white/90 group-hover:bg-white rounded-full p-4 transition-all">
                                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                              </div>
                            </div>
                            
                            {/* Snapshot indicator */}
                            <div className="absolute top-2 left-2 bg-gray-700 text-white px-2 py-1 rounded text-xs font-semibold">
                              📸 Snapshot
                            </div>
                          </>
                        )}
                      </div>
                      
                      {/* Camera Info Footer */}
                      <div className="px-4 py-2 bg-gray-100 flex items-center justify-between text-xs text-gray-600">
                        <span>Status: {isStreaming ? 'Streaming' : 'Ready'}</span>
                        <span className="text-blue-600 font-medium">
                          {isStreaming ? 'Click to stop' : 'Click to stream'}
                        </span>
                      </div>
                    </div>
                  );
                })}
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
              <span>Each camera streams to its own Kafka topic for isolated processing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Only active cameras will display live video feeds</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Upload a person's image and select a camera to search for matches</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Camera list refreshes automatically every 10 seconds</span>
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
