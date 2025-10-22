import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CaseManagement = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockCases = [
      { 
        id: 1, 
        name: 'Trần Thị Mai', 
        status: 'MISSING', 
        reportedDate: '2024-01-15', 
        lastSeen: '2024-01-14',
        area: 'Quận 1',
        reporter: 'Nguyễn Văn A',
        priority: 'HIGH',
        assignedOfficer: 'Cảnh sát B'
      },
      { 
        id: 2, 
        name: 'Lê Văn Nam', 
        status: 'FOUND', 
        reportedDate: '2024-01-10', 
        lastSeen: '2024-01-09',
        area: 'Quận 3',
        reporter: 'Trần Thị B',
        priority: 'MEDIUM',
        assignedOfficer: 'Cảnh sát C'
      },
      { 
        id: 3, 
        name: 'Nguyễn Thị Hoa', 
        status: 'MISSING', 
        reportedDate: '2024-01-12', 
        lastSeen: '2024-01-11',
        area: 'Quận 5',
        reporter: 'Lê Văn D',
        priority: 'LOW',
        assignedOfficer: 'Cảnh sát E'
      }
    ];
    
    setCases(mockCases);
    setLoading(false);
  }, []);

  const handleStatusUpdate = async (caseId, newStatus) => {
    try {
      // Mock API call - replace with actual API
      setCases(cases.map(c => 
        c.id === caseId ? { ...c, status: newStatus } : c
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleAssignOfficer = async (caseId, officerName) => {
    try {
      // Mock API call - replace with actual API
      setCases(cases.map(c => 
        c.id === caseId ? { ...c, assignedOfficer: officerName } : c
      ));
    } catch (error) {
      console.error('Error assigning officer:', error);
    }
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
        return 'Đang mất tích';
      case 'FOUND':
        return 'Đã tìm thấy';
      case 'INVESTIGATING':
        return 'Đang điều tra';
      default:
        return 'Không xác định';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'Ưu tiên cao';
      case 'MEDIUM':
        return 'Ưu tiên trung bình';
      case 'LOW':
        return 'Ưu tiên thấp';
      default:
        return 'Không xác định';
    }
  };

  const filteredCases = cases.filter(caseItem => {
    const matchesFilter = filter === 'ALL' || caseItem.status === filter;
    const matchesSearch = caseItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.area.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-900">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center">
            <div>
          <h1 className="text-3xl font-bold text-gray-900">Case Management</h1>
          <p className="mt-2 text-gray-600">Manage and track missing person cases</p>
            </div>
            <Link
              to="/Formmissing"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
                Create New Case
            </Link>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Status
                </label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="ALL">All</option>
                  <option value="MISSING">Missing</option>
                  <option value="INVESTIGATING">Investigating</option>
                  <option value="FOUND">Found</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search by name or area..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cases Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ưu tiên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khu vực
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Người báo cáo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cảnh sát phụ trách
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCases.map((caseItem) => (
                    <tr key={caseItem.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {caseItem.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(caseItem.status)}`}>
                          {getStatusText(caseItem.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(caseItem.priority)}`}>
                          {getPriorityText(caseItem.priority)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {caseItem.area}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {caseItem.reporter}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {caseItem.assignedOfficer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Link
                          to={`/case-details/${caseItem.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Xem
                        </Link>
                        <button
                          onClick={() => handleStatusUpdate(caseItem.id, 'FOUND')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Tìm thấy
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(caseItem.id, 'INVESTIGATING')}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          Điều tra
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">M</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Đang mất tích</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {cases.filter(c => c.status === 'MISSING').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">I</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Đang điều tra</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {cases.filter(c => c.status === 'INVESTIGATING').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">F</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Đã tìm thấy</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {cases.filter(c => c.status === 'FOUND').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseManagement;
