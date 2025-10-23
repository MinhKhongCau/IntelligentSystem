import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CCTVManagement = () => {
  const [cameras, setCameras] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockCameras = [
      { 
        id: 1, 
        name: 'CCTV Quận 1 - Đường Nguyễn Huệ', 
        location: 'Quận 1, TP.HCM',
        status: 'ACTIVE',
        lastMaintenance: '2024-01-10',
        detectionCount: 15
      },
      { 
        id: 2, 
        name: 'CCTV Quận 3 - Chợ Bến Thành', 
        location: 'Quận 3, TP.HCM',
        status: 'ACTIVE',
        lastMaintenance: '2024-01-12',
        detectionCount: 8
      },
      { 
        id: 3, 
        name: 'CCTV Quận 5 - Công viên Lê Văn Tám', 
        location: 'Quận 5, TP.HCM',
        status: 'MAINTENANCE',
        lastMaintenance: '2024-01-15',
        detectionCount: 0
      },
      { 
        id: 4, 
        name: 'CCTV Quận 7 - Khu đô thị Phú Mỹ Hưng', 
        location: 'Quận 7, TP.HCM',
        status: 'INACTIVE',
        lastMaintenance: '2024-01-08',
        detectionCount: 3
      }
    ];

    const mockReports = [
      {
        id: 1,
        cameraId: 1,
        detectedPerson: 'Trần Thị Mai',
        confidence: 0.95,
        timestamp: '2024-01-20T10:30:00',
        status: 'PENDING',
        imageUrl: '/api/images/detection1.jpg'
      },
      {
        id: 2,
        cameraId: 2,
        detectedPerson: 'Nguyễn Văn Nam',
        confidence: 0.87,
        timestamp: '2024-01-20T14:15:00',
        status: 'VERIFIED',
        imageUrl: '/api/images/detection2.jpg'
      },
      {
        id: 3,
        cameraId: 1,
        detectedPerson: 'Lê Thị Hoa',
        confidence: 0.92,
        timestamp: '2024-01-20T16:45:00',
        status: 'FALSE_POSITIVE',
        imageUrl: '/api/images/detection3.jpg'
      }
    ];

    setCameras(mockCameras);
    setReports(mockReports);
    setLoading(false);
  }, []);

  const handleCameraStatusUpdate = (cameraId, newStatus) => {
    setCameras(cameras.map(c => 
      c.id === cameraId ? { ...c, status: newStatus } : c
    ));
  };

  const handleReportStatusUpdate = (reportId, newStatus) => {
    setReports(reports.map(r => 
      r.id === reportId ? { ...r, status: newStatus } : r
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'MAINTENANCE':
        return 'bg-yellow-100 text-yellow-800';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-blue-100 text-blue-800';
      case 'VERIFIED':
        return 'bg-green-100 text-green-800';
      case 'FALSE_POSITIVE':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'Hoạt động';
      case 'MAINTENANCE':
        return 'Bảo trì';
      case 'INACTIVE':
        return 'Không hoạt động';
      case 'PENDING':
        return 'Chờ xác minh';
      case 'VERIFIED':
        return 'Đã xác minh';
      case 'FALSE_POSITIVE':
        return 'Báo động sai';
      default:
        return 'Không xác định';
    }
  };

  const filteredReports = reports.filter(report => {
    if (filter === 'ALL') return true;
    return report.status === filter;
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
              <h1 className="text-3xl font-bold text-gray-900">Quản lý CCTV</h1>
              <p className="mt-2 text-gray-600">Quản lý hệ thống camera và báo cáo phát hiện</p>
            </div>
            <div className="flex space-x-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Thêm camera
              </button>
              <Link
                to="/cctv-reports"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Xem báo cáo
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">TC</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Tổng camera</dt>
                    <dd className="text-lg font-medium text-gray-900">{cameras.length}</dd>
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
                    <span className="text-white text-sm font-bold">AC</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Camera hoạt động</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {cameras.filter(c => c.status === 'ACTIVE').length}
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
                    <span className="text-white text-sm font-bold">TD</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Tổng phát hiện</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {cameras.reduce((sum, c) => sum + c.detectionCount, 0)}
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
                    <span className="text-white text-sm font-bold">PR</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Báo cáo chờ xử lý</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {reports.filter(r => r.status === 'PENDING').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Camera Management */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Danh sách Camera</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên camera
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vị trí
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số phát hiện
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bảo trì cuối
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cameras.map((camera) => (
                    <tr key={camera.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {camera.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {camera.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(camera.status)}`}>
                          {getStatusText(camera.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {camera.detectionCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(camera.lastMaintenance).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleCameraStatusUpdate(camera.id, 'ACTIVE')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Kích hoạt
                        </button>
                        <button
                          onClick={() => handleCameraStatusUpdate(camera.id, 'MAINTENANCE')}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          Bảo trì
                        </button>
                        <button
                          onClick={() => handleCameraStatusUpdate(camera.id, 'INACTIVE')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Tắt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Detection Reports */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Báo cáo phát hiện</h3>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="ALL">Tất cả</option>
                <option value="PENDING">Chờ xác minh</option>
                <option value="VERIFIED">Đã xác minh</option>
                <option value="FALSE_POSITIVE">Báo động sai</option>
              </select>
            </div>
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
                  {filteredReports.map((report) => {
                    const camera = cameras.find(c => c.id === report.cameraId);
                    return (
                      <tr key={report.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {report.detectedPerson}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {camera?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(report.confidence * 100).toFixed(1)}%
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
                          <button
                            onClick={() => handleReportStatusUpdate(report.id, 'VERIFIED')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Xác minh
                          </button>
                          <button
                            onClick={() => handleReportStatusUpdate(report.id, 'FALSE_POSITIVE')}
                            className="text-red-600 hover:text-red-900"
                          >
                            Báo sai
                          </button>
                          <button className="text-blue-600 hover:text-blue-900">
                            Xem ảnh
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CCTVManagement;

