import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const VolunteerDashboard = () => {
  const [stats, setStats] = useState({
    casesHelping: 0,
    reportsSubmitted: 0,
    areasCovered: 0,
    hoursVolunteered: 0
  });
  const [assignedCases, setAssignedCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API calls
    setStats({
      casesHelping: 3,
      reportsSubmitted: 8,
      areasCovered: 5,
      hoursVolunteered: 24
    });

    setAssignedCases([
      { id: 1, name: 'Trần Thị Mai', area: 'Quận 1', priority: 'HIGH', assignedDate: '2024-01-15' },
      { id: 2, name: 'Lê Văn Nam', area: 'Quận 3', priority: 'MEDIUM', assignedDate: '2024-01-14' },
      { id: 3, name: 'Nguyễn Thị Hoa', area: 'Quận 5', priority: 'LOW', assignedDate: '2024-01-13' }
    ]);

    setLoading(false);
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Đang tải dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">Volunteer Dashboard</h1>
          <p className="mt-2 text-gray-600">Support search and report information about missing persons</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">CH</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Cases Helping</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.casesHelping}</dd>
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
                    <span className="text-white text-sm font-bold">RS</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Reports Submitted</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.reportsSubmitted}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">AC</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Areas Covered</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.areasCovered}</dd>
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
                    <span className="text-white text-sm font-bold">HV</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Volunteer Hours</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.hoursVolunteered}h</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/search"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-center font-medium"
              >
                Search Cases
              </Link>
              <Link
                to="/volunteer-coordination"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-center font-medium"
              >
                Coordinate with Team
              </Link>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-center font-medium">
                Report Finding
              </button>
            </div>
          </div>
        </div>

        {/* Assigned Cases */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Case được phân công</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khu vực
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ưu tiên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày phân công
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assignedCases.map((caseItem) => (
                    <tr key={caseItem.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {caseItem.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {caseItem.area}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(caseItem.priority)}`}>
                          {getPriorityText(caseItem.priority)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(caseItem.assignedDate).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          to={`/case-details/${caseItem.id}`}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Xem chi tiết
                        </Link>
                        <button className="text-green-600 hover:text-green-900">
                          Báo cáo
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Volunteer Guidelines */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-green-900 mb-2">Hướng dẫn tình nguyện viên</h3>
          <ul className="text-green-800 space-y-2">
            <li>• Luôn ưu tiên an toàn cá nhân khi tham gia tìm kiếm</li>
            <li>• Báo cáo ngay lập tức nếu phát hiện thông tin quan trọng</li>
            <li>• Tuân thủ hướng dẫn của cảnh sát và người điều phối</li>
            <li>• Cập nhật trạng thái hoạt động thường xuyên</li>
          </ul>
          <div className="mt-4">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium">
              Xem hướng dẫn chi tiết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
