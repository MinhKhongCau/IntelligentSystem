import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdvancedSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    name: '',
    age: '',
    gender: '',
    area: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    reporter: ''
  });

  const [areas, setAreas] = useState([]);

  useEffect(() => {
    // Mock areas data - replace with actual API call
    const mockAreas = [
      'Quận 1', 'Quận 3', 'Quận 5', 'Quận 7', 'Quận 10', 'Quận 11', 'Quận 12',
      'Quận Bình Thạnh', 'Quận Gò Vấp', 'Quận Phú Nhuận', 'Quận Tân Bình', 'Quận Tân Phú'
    ];
    setAreas(mockAreas);
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Mock search results - replace with actual API call
      const mockResults = [
        {
          id: 1,
          name: 'Trần Thị Mai',
          age: 25,
          gender: 'Nữ',
          area: 'Quận 1',
          status: 'MISSING',
          reportedDate: '2024-01-15',
          lastSeen: '2024-01-14',
          reporter: 'Nguyễn Văn A',
          description: 'Mất tích khi đi làm về'
        },
        {
          id: 2,
          name: 'Lê Văn Nam',
          age: 30,
          gender: 'Nam',
          area: 'Quận 3',
          status: 'FOUND',
          reportedDate: '2024-01-10',
          lastSeen: '2024-01-09',
          reporter: 'Trần Thị B',
          description: 'Đã tìm thấy tại bệnh viện'
        }
      ];
      
      // Filter results based on search parameters
      let filteredResults = mockResults;
      
      if (searchParams.name) {
        filteredResults = filteredResults.filter(r => 
          r.name.toLowerCase().includes(searchParams.name.toLowerCase())
        );
      }
      
      if (searchParams.area) {
        filteredResults = filteredResults.filter(r => r.area === searchParams.area);
      }
      
      if (searchParams.status) {
        filteredResults = filteredResults.filter(r => r.status === searchParams.status);
      }
      
      if (searchParams.gender) {
        filteredResults = filteredResults.filter(r => r.gender === searchParams.gender);
      }

      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchParams({
      name: '',
      age: '',
      gender: '',
      area: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      reporter: ''
    });
    setSearchResults([]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'MISSING':
        return 'bg-red-100 text-red-800';
      case 'FOUND':
        return 'bg-green-100 text-green-800';
      case 'INVESTIGATING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'MISSING':
        return 'Missing';
      case 'FOUND':
        return 'Found';
      case 'INVESTIGATING':
        return 'Investigating';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">Advanced Search</h1>
          <p className="mt-2 text-gray-600">Search for missing persons with multiple criteria</p>
        </div>

        {/* Search Form */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Search Criteria</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Missing Person Name
                </label>
                <input
                  type="text"
                  placeholder="Enter name..."
                  value={searchParams.name}
                  onChange={(e) => setSearchParams({...searchParams, name: e.target.value})}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  placeholder="Enter age..."
                  value={searchParams.age}
                  onChange={(e) => setSearchParams({...searchParams, age: e.target.value})}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={searchParams.gender}
                  onChange={(e) => setSearchParams({...searchParams, gender: e.target.value})}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">All</option>
                  <option value="Nam">Male</option>
                  <option value="Nữ">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area
                </label>
                <select
                  value={searchParams.area}
                  onChange={(e) => setSearchParams({...searchParams, area: e.target.value})}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">All</option>
                  {areas.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={searchParams.status}
                  onChange={(e) => setSearchParams({...searchParams, status: e.target.value})}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">All</option>
                  <option value="MISSING">Missing</option>
                  <option value="FOUND">Found</option>
                  <option value="INVESTIGATING">Investigating</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reporter
                </label>
                <input
                  type="text"
                  placeholder="Enter reporter name..."
                  value={searchParams.reporter}
                  onChange={(e) => setSearchParams({...searchParams, reporter: e.target.value})}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  value={searchParams.dateFrom}
                  onChange={(e) => setSearchParams({...searchParams, dateFrom: e.target.value})}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={searchParams.dateTo}
                  onChange={(e) => setSearchParams({...searchParams, dateTo: e.target.value})}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="mt-6 flex space-x-4">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
              <button
                onClick={handleClearSearch}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Search Results ({searchResults.length} results)
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Age/Gender
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Area
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Report Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reporter
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {searchResults.map((result) => (
                      <tr key={result.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {result.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {result.age} years old - {result.gender}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {result.area}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(result.status)}`}>
                            {getStatusText(result.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(result.reportedDate).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {result.reporter}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            to={`/case-details/${result.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* No Results */}
        {searchResults.length === 0 && !loading && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6 text-center">
              <p className="text-gray-500">No search results found. Please try again with different criteria.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedSearch;
