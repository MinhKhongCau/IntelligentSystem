import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const INTELLIGENT_API = process.env.REACT_APP_INTELLIGENT_API_URL || 'http://localhost:5001';

const FaceComparisonModal = ({ isOpen, onClose, missingPersonImage, reportImage, missingPersonName, reportId }) => {
  const [comparing, setComparing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [threshold, setThreshold] = useState(0.6);

  const urlToFile = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new File([blob], filename, { type: blob.type });
    } catch (err) {
      console.error('Error converting URL to file:', err);
      throw new Error('Failed to load image');
    }
  };

  const handleCompare = async () => {
    setComparing(true);
    setError(null);
    setResult(null);

    try {
      // Convert image URLs to File objects
      const image1Url = `${API_BASE}${missingPersonImage}`;
      const image2Url = `${API_BASE}${reportImage}`;

      const image1File = await urlToFile(image1Url, 'missing_person.jpg');
      const image2File = await urlToFile(image2Url, 'report_image.jpg');

      // Create FormData
      const formData = new FormData();
      formData.append('image1', image1File);
      formData.append('image2', image2File);
      formData.append('threshold', threshold.toString());

      // Call comparison API
      const response = await axios.post(
        `${INTELLIGENT_API}/api/compare-faces`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setResult(response.data);
    } catch (err) {
      console.error('Error comparing faces:', err);
      setError(err.response?.data?.error || 'Failed to compare faces. Please try again.');
    } finally {
      setComparing(false);
    }
  };

  const getMatchColor = (isMatch) => {
    return isMatch ? 'text-green-600' : 'text-red-600';
  };

  const getMatchBgColor = (isMatch) => {
    return isMatch ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Face Comparison</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Images Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Missing Person Image */}
            <div className="border-2 border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Missing Person</h3>
              <div className="bg-gray-100 rounded-lg overflow-hidden mb-2">
                <img
                  src={`${API_BASE}${missingPersonImage}`}
                  alt="Missing Person"
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    e.target.src = '/default-avatar.png';
                  }}
                />
              </div>
              <p className="text-sm text-gray-600 font-medium">{missingPersonName}</p>
            </div>

            {/* Report Image */}
            <div className="border-2 border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Report Sighting</h3>
              <div className="bg-gray-100 rounded-lg overflow-hidden mb-2">
                <img
                  src={`${API_BASE}${reportImage}`}
                  alt="Report Sighting"
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    e.target.src = '/default-image.png';
                  }}
                />
              </div>
              <p className="text-sm text-gray-600 font-medium">Report #{reportId}</p>
            </div>
          </div>

          {/* Threshold Control */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Similarity Threshold: {threshold.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.3"
              max="0.9"
              step="0.05"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              disabled={comparing}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Strict (0.3)</span>
              <span>Balanced (0.6)</span>
              <span>Loose (0.9)</span>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Lower threshold = stricter matching (fewer false positives)
            </p>
          </div>

          {/* Compare Button */}
          <button
            onClick={handleCompare}
            disabled={comparing}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
              comparing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {comparing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Comparing Faces...
              </span>
            ) : (
              'Compare Faces'
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className={`mt-6 p-6 border-2 rounded-lg ${getMatchBgColor(result.is_match)}`}>
              <div className="text-center mb-6">
                <h3 className={`text-3xl font-bold mb-2 ${getMatchColor(result.is_match)}`}>
                  {result.is_match ? '✓ MATCH' : '✗ NO MATCH'}
                </h3>
                <p className="text-gray-600">
                  {result.is_match
                    ? 'The faces are likely the same person'
                    : 'The faces appear to be different people'}
                </p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Distance</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {result.distance.toFixed(4)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Lower is better</p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Similarity</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {result.similarity.toFixed(2)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Higher is better</p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Threshold Used</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {result.threshold.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Match cutoff</p>
                </div>
              </div>

              {/* Visual Indicator */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Similarity Score</span>
                  <span>{result.similarity.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      result.is_match ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(result.similarity, 100)}%` }}
                  />
                </div>
              </div>

              {/* Technical Details */}
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                  Technical Details
                </summary>
                <div className="mt-3 p-4 bg-white rounded border border-gray-200 text-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="font-medium">Embedding Dimension:</span>
                      <span className="ml-2 text-gray-600">{result.embedding_dimension}</span>
                    </div>
                    <div>
                      <span className="font-medium">Algorithm:</span>
                      <span className="ml-2 text-gray-600">FaceNet + L2 Distance</span>
                    </div>
                  </div>
                  {result.bbox1 && result.bbox2 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="font-medium mb-2">Face Detection:</p>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-gray-600">Image 1: {result.bbox1.width}x{result.bbox1.height}px</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Image 2: {result.bbox2.width}x{result.bbox2.height}px</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </details>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaceComparisonModal;
