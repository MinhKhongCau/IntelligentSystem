import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const VIDEO_STREAM_URL = 'http://localhost:5001';

const CCTVMonitor = () => {
  const [streamStatus, setStreamStatus] = useState({
    streaming: false,
    topic: 'video-stream',
    server: 'localhost:5001'
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    // Check stream status periodically
    const checkStatus = async () => {
      try {
        const response = await axios.get(`${VIDEO_STREAM_URL}/api/status`);
        setStreamStatus(response.data);
      } catch (error) {
        console.error('Failed to check stream status:', error);
        setStreamStatus(prev => ({ ...prev, streaming: false }));
      }
    };

    // Load camera list
    const loadCameras = async () => {
      try {
        const response = await axios.get(`${VIDEO_STREAM_URL}/api/camera/list`);
        setCameras(response.data.cameras);
      } catch (error) {
        console.error('Failed to load cameras:', error);
      }
    };

    checkStatus();
    loadCameras();
    const interval = setInterval(() => {
      checkStatus();
      loadCameras();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 3000);
  };

  const handleStartCamera = async () => {
    if (!selectedCamera) {
      showNotification('Please enter a camera IP address', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${VIDEO_STREAM_URL}/api/camera/start`, {
        ip: selectedCamera
      });
      
      showNotification(response.data.message, 'success');
      setSelectedCamera('');
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to start camera';
      showNotification(errorMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopCamera = async (cameraIp) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${VIDEO_STREAM_URL}/api/camera/stop`, {
        ip: cameraIp
      });
      
      showNotification(response.data.message, 'success');
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to stop camera';
      showNotification(errorMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleFullscreen = () => {
    const container = document.getElementById('video-container');
    if (container) {
      if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => {
          console.error('Error attempting to enable fullscreen:', err);
        });
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

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
                Police CCTV Monitoring System
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Real-time Video Stream via Kafka</p>
            </div>
            
            {/* Status Badge */}
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

        {/* Camera Control Panel */}
        <div className="bg-white rounded-xl shadow-2xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-3xl">📹</span>
            Camera Control Panel
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Start Camera */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Start New Camera</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter IP address (e.g., 10.0.0.1)"
                  value={selectedCamera}
                  onChange={(e) => setSelectedCamera(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleStartCamera}
                  disabled={isLoading}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Starting...' : 'Start'}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Make sure you have a video file named [IP].mp4 (e.g., 10.0.0.1.mp4)
              </p>
            </div>

            {/* Active Cameras */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Active Cameras ({cameras.filter(c => c.status === 'running').length})
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {cameras.length === 0 ? (
                  <p className="text-gray-500 text-sm">No cameras active</p>
                ) : (
                  cameras.map((camera) => (
                    <div key={camera.ip} className="flex items-center justify-between bg-white p-3 rounded border">
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${
                          camera.status === 'running' ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                        <span className="font-medium">{camera.ip}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          camera.status === 'running' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {camera.status}
                        </span>
                      </div>
                      {camera.status === 'running' && (
                        <button
                          onClick={() => handleStopCamera(camera.ip)}
                          disabled={isLoading}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors disabled:opacity-50"
                        >
                          Stop
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Video Container */}
        <div className="bg-white rounded-xl shadow-2xl p-6 mb-6">
          <div 
            id="video-container"
            className="relative bg-black rounded-lg overflow-hidden shadow-xl"
          >
            <img 
              key={refreshKey}
              className="w-full h-auto block"
              src={`${VIDEO_STREAM_URL}/video_feed?t=${Date.now()}`}
              alt="CCTV Stream"
              onError={(e) => {
                console.error('Failed to load video stream');
              }}
            />
            
            {/* Overlay Controls (visible on hover) */}
            {/* <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
              <div className="flex gap-3">
                <button
                  onClick={handleRefresh}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
                
                <button
                  onClick={handleFullscreen}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                </button>
              </div>
            </div> */}
          </div>

          {/* Controls */}
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={handleRefresh}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 hover:shadow-xl flex items-center gap-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Stream
            </button>
            
            <button
              onClick={handleFullscreen}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105 hover:shadow-xl flex items-center gap-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              Toggle Fullscreen
            </button>
          </div>
        </div>

        {/* Info Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 transform hover:scale-105 transition-transform">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Kafka Topic</h3>
            <p className="text-2xl font-bold text-gray-800">{streamStatus.topic}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 transform hover:scale-105 transition-transform">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Kafka Server</h3>
            <p className="text-2xl font-bold text-gray-800">{streamStatus.server}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-pink-500 transform hover:scale-105 transition-transform">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Connection Status</h3>
            <p className={`text-2xl font-bold ${
              streamStatus.streaming ? 'text-green-600' : 'text-red-600'
            }`}>
              {streamStatus.streaming ? 'Connected' : 'Waiting...'}
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Instructions
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>The video stream is provided via Kafka message broker</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Click "Refresh Stream" if the video appears frozen</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Use "Toggle Fullscreen" for better viewing experience</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Stream status updates automatically every 3 seconds</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CCTVMonitor;
