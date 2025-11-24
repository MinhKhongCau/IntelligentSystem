import { useEffect } from 'react';

const CCTVReportModal = ({ detection, isOpen, onClose, detectionIndex, totalDetections }) => {
  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !detection) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 animate-fadeIn">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Detection Report #{detectionIndex + 1}
            </h2>
            <p className="text-blue-100 mt-1">
              Detection {detectionIndex + 1} of {totalDetections}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Detection Image */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Detected Frame
            </h3>
            {detection.imageUrl ? (
              <div className="relative">
                <img 
                  src={detection.imageUrl} 
                  alt={`Detection ${detectionIndex + 1}`}
                  className="w-full rounded-lg shadow-lg"
                />
                <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg text-lg font-bold shadow-lg">
                  {detection.confidence}% Match
                </div>
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Image not available</span>
              </div>
            )}
          </div>

          {/* Detection Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Frame Information */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Frame Information
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Frame Number:</span>
                  <span className="font-mono font-semibold text-blue-700">{detection.frame_number}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Timestamp:</span>
                  <span className="font-mono font-semibold text-blue-700">{detection.timestamp.toFixed(2)}s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Time (mm:ss):</span>
                  <span className="font-mono font-semibold text-blue-700">
                    {Math.floor(detection.timestamp / 60)}:{String(Math.floor(detection.timestamp % 60)).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>

            {/* Confidence & Distance */}
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Match Quality
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Confidence:</span>
                    <span className="font-bold text-green-700">{detection.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${detection.confidence}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Face Distance:</span>
                  <span className="font-mono font-semibold text-green-700">{detection.distance.toFixed(4)}</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Lower distance = Better match
                </div>
              </div>
            </div>

            {/* Bounding Box Details */}
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                Bounding Box
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Position (X, Y):</span>
                  <span className="font-mono font-semibold text-purple-700">
                    ({detection.bbox.x}, {detection.bbox.y})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Width:</span>
                  <span className="font-mono font-semibold text-purple-700">{detection.bbox.width}px</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Height:</span>
                  <span className="font-mono font-semibold text-purple-700">{detection.bbox.height}px</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Area:</span>
                  <span className="font-mono font-semibold text-purple-700">
                    {(detection.bbox.width * detection.bbox.height).toLocaleString()}px²
                  </span>
                </div>
              </div>
            </div>

            {/* Status Summary */}
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
              <h4 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Detection Status
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    detection.confidence >= 70 ? 'bg-green-500' :
                    detection.confidence >= 50 ? 'bg-yellow-500' :
                    'bg-orange-500'
                  }`}></div>
                  <span className="text-sm font-medium">
                    {detection.confidence >= 70 ? 'High Confidence Match' :
                     detection.confidence >= 50 ? 'Medium Confidence Match' :
                     'Low Confidence Match'}
                  </span>
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  This detection was found at {detection.timestamp.toFixed(2)} seconds into the video recording.
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-all"
            >
              Close
            </button>
            <button
              onClick={() => {
                // Download image functionality
                if (detection.imageUrl) {
                  const link = document.createElement('a');
                  link.href = detection.imageUrl;
                  link.download = `detection_frame_${detection.frame_number}.jpg`;
                  link.click();
                }
              }}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CCTVReportModal;
