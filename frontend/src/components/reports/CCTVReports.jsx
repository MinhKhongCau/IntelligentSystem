import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CCTVReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockReports = [
      {
        id: 1,
        cameraId: 1,
        cameraName: 'CCTV Quận 1 - Đường Nguyễn Huệ',
        detectedPerson: 'Trần Thị Mai',
        confidence: 0.95,
        timestamp: '2024-01-20T10:30:00',
        status: 'VERIFIED',
        imageUrl: '/api/images/detection1.jpg',
        location: 'Quận 1, TP.HCM',
        verifiedBy: 'Cảnh sát A',
        verifiedAt: '2024-01-20T11:00:00',
        notes: 'Xác nhận là người mất tích'
      },
      {
        id: 2,
        cameraId: 2,
        cameraName: 'CCTV Quận 3 - Chợ Bến Thành',
        detectedPerson: 'Nguyễn Văn Nam',
        confidence: 0.87,
        timestamp: '2024-01-20T14:15:00',
        status: 'FALSE_POSITIVE',
        imageUrl: '/api/images/detection2.jpg',
        location: 'Quận 3, TP.HCM',
        verifiedBy: 'Cảnh sát B',
        verifiedAt: '2024-01-20T15:00:00',
        notes: 'Không phải người mất tích'
      },
      {
        id: 3,
        cameraId: 1,
        cameraName: 'CCTV Quận 1 - Đường Nguyễn Huệ',
        detectedPerson: 'Lê Thị Hoa',
        confidence: 0.92,
        timestamp: '2024-01-20T16:45:00',
        status: 'PENDING',
        imageUrl: '/api/images/detection3.jpg',
        location: 'Quận 1, TP.HCM',
        verifiedBy: null,
        verifiedAt: null,
        notes: null
      },
      {
        id: 4,
        cameraId: 3,
        cameraName: 'CCTV Quận 5 - Công viên Lê Văn Tám',
        detectedPerson: 'Phạm Văn Đức',
        confidence: 0.78,
        timestamp: '2024-01-19T09:20:00',
        status: 'VERIFIED',
        imageUrl: '/api/images/detection4.jpg',
        location: 'Quận 5, TP.HCM',
        verifiedBy: 'Cảnh sát C',
        verifiedAt: '2024-01-19T10:30:00',
        notes: 'Đã liên hệ gia đình'
      }
    ];

    setReports(mockReports);
    setLoading(false);
  }, []);

  const handleStatusUpdate = (reportId, newStatus) => {
    setReports(reports.map(report => 
      report.id === reportId 
        ? { 
            ...report, 
            status: newStatus,
            verifiedBy: 'Current User',
            verifiedAt: new Date().toISOString(),
            notes: newStatus === 'VERIFIED' ? 'Đã xác minh' : 'Báo động sai'
          }
        : report
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-green-100 text-green-800';
      case 'FALSE_POSITIVE':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'VERIFIED':
        return 'Đã xác minh';
      case 'FALSE_POSITIVE':
        return 'Báo động sai';
      case 'PENDING':
        return 'Chờ xác minh';
      default:
        return 'Không xác định';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredReports = reports.filter(report => {
    const matchesFilter = filter === 'ALL' || report.status === filter;
    const matchesDate = !selectedDate || report.timestamp.startsWith(selectedDate);
    return matchesFilter && matchesDate;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Đang tải...</div>
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
              <h1 className="text-3xl font-bold text-gray-900">Báo cáo CCTV</h1>
              <p className="mt-2 text-gray-600">Quản lý và xác minh các phát hiện từ hệ thống CCTV</p>
            </div>
            <Link
              to="/cctv-management"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Quản lý CCTV
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">TD</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Tổng phát hiện</dt>
                    <dd className="text-lg font-medium text-gray-900">{reports.length}</dd>
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
                    <span className="text-white text-sm font-bold">XM</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Đã xác minh</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {reports.filter(r => r.status === 'VERIFIED').length}
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
                    <span className="text-white text-sm font-bold">CX</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Chờ xác minh</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {reports.filter(r => r.status === 'PENDING').length}
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
                  <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">BS</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Báo động sai</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {reports.filter(r => r.status === 'FALSE_POSITIVE').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Bộ lọc</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="ALL">Tất cả</option>
                  <option value="PENDING">Chờ xác minh</option>
                  <option value="VERIFIED">Đã xác minh</option>
                  <option value="FALSE_POSITIVE">Báo động sai</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Danh sách phát hiện</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Người phát hiện
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Camera
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Độ tin cậy
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.map((report) => (
                    <tr key={report.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {report.detectedPerson}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <div>{report.cameraName}</div>
                          <div className="text-xs text-gray-400">{report.location}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`font-medium ${getConfidenceColor(report.confidence)}`}>
                          {(report.confidence * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(report.timestamp).toLocaleString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                          {getStatusText(report.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {report.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(report.id, 'VERIFIED')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Xác minh
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(report.id, 'FALSE_POSITIVE')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Báo sai
                            </button>
                          </>
                        )}
                        <button className="text-blue-600 hover:text-blue-900">
                          Xem ảnh
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-900">
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredReports.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Không có báo cáo nào phù hợp với bộ lọc.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Hoạt động gần đây</h3>
            <div className="space-y-3">
              {reports.slice(0, 5).map((report) => (
                <div key={report.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-900">
                        Phát hiện <span className="font-medium">{report.detectedPerson}</span> tại {report.cameraName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(report.timestamp).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                    {getStatusText(report.status)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CCTVReports;

