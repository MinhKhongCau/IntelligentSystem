import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const VolunteerCoordination = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [cases, setCases] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockVolunteers = [
      { id: 1, name: 'Nguyễn Văn A', area: 'Quận 1', status: 'ACTIVE', skills: ['Tìm kiếm', 'Giao tiếp'] },
      { id: 2, name: 'Trần Thị B', area: 'Quận 3', status: 'ACTIVE', skills: ['Tìm kiếm', 'Chụp ảnh'] },
      { id: 3, name: 'Lê Văn C', area: 'Quận 5', status: 'BUSY', skills: ['Tìm kiếm', 'Lái xe'] },
      { id: 4, name: 'Phạm Thị D', area: 'Quận 7', status: 'ACTIVE', skills: ['Tìm kiếm', 'Y tế'] }
    ];

    const mockCases = [
      { id: 1, name: 'Trần Thị Mai', area: 'Quận 1', priority: 'HIGH', status: 'MISSING' },
      { id: 2, name: 'Lê Văn Nam', area: 'Quận 3', priority: 'MEDIUM', status: 'MISSING' },
      { id: 3, name: 'Nguyễn Thị Hoa', area: 'Quận 5', priority: 'LOW', status: 'MISSING' }
    ];

    const mockAssignments = [
      { id: 1, caseId: 1, volunteerId: 1, assignedDate: '2024-01-15', status: 'ACTIVE' },
      { id: 2, caseId: 2, volunteerId: 2, assignedDate: '2024-01-14', status: 'ACTIVE' },
      { id: 3, caseId: 3, volunteerId: 3, assignedDate: '2024-01-13', status: 'COMPLETED' }
    ];

    setVolunteers(mockVolunteers);
    setCases(mockCases);
    setAssignments(mockAssignments);
    setLoading(false);
  }, []);

  const handleAssignVolunteer = (caseId, volunteerId) => {
    const newAssignment = {
      id: assignments.length + 1,
      caseId,
      volunteerId,
      assignedDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE'
    };
    setAssignments([...assignments, newAssignment]);
  };

  const handleUnassignVolunteer = (assignmentId) => {
    setAssignments(assignments.filter(a => a.id !== assignmentId));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'BUSY':
        return 'bg-yellow-100 text-yellow-800';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'Hoạt động';
      case 'BUSY':
        return 'Bận';
      case 'INACTIVE':
        return 'Không hoạt động';
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
          <h1 className="text-3xl font-bold text-gray-900">Phối hợp Tình nguyện viên</h1>
          <p className="mt-2 text-gray-600">Quản lý và phân công tình nguyện viên cho các case</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">TV</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Tổng tình nguyện viên</dt>
                    <dd className="text-lg font-medium text-gray-900">{volunteers.length}</dd>
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
                    <span className="text-white text-sm font-bold">HA</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Đang hoạt động</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {volunteers.filter(v => v.status === 'ACTIVE').length}
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
                    <span className="text-white text-sm font-bold">PA</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Đã phân công</dt>
                    <dd className="text-lg font-medium text-gray-900">{assignments.length}</dd>
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
                    <span className="text-white text-sm font-bold">UC</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Case chưa phân công</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {cases.filter(c => !assignments.some(a => a.caseId === c.id && a.status === 'ACTIVE')).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cases and Volunteers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cases */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Cases cần phân công</h3>
              <div className="space-y-4">
                {cases.map((caseItem) => {
                  const caseAssignments = assignments.filter(a => a.caseId === caseItem.id && a.status === 'ACTIVE');
                  const assignedVolunteers = caseAssignments.map(a => 
                    volunteers.find(v => v.id === a.volunteerId)
                  ).filter(Boolean);

                  return (
                    <div key={caseItem.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-medium text-gray-900">{caseItem.name}</h4>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(caseItem.priority)}`}>
                          {getPriorityText(caseItem.priority)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">Khu vực: {caseItem.area}</p>
                      
                      {assignedVolunteers.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-medium text-gray-700 mb-1">Tình nguyện viên đã phân công:</p>
                          <div className="flex flex-wrap gap-1">
                            {assignedVolunteers.map((volunteer) => (
                              <span key={volunteer.id} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                {volunteer.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <button className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded">
                          Phân công TV
                        </button>
                        <Link
                          to={`/case-details/${caseItem.id}`}
                          className="text-xs bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Volunteers */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Danh sách Tình nguyện viên</h3>
              <div className="space-y-4">
                {volunteers.map((volunteer) => (
                  <div key={volunteer.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-medium text-gray-900">{volunteer.name}</h4>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(volunteer.status)}`}>
                        {getStatusText(volunteer.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">Khu vực: {volunteer.area}</p>
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-700 mb-1">Kỹ năng:</p>
                      <div className="flex flex-wrap gap-1">
                        {volunteer.skills.map((skill, index) => (
                          <span key={index} className="inline-flex px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded">
                        Xem profile
                      </button>
                      <button className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded">
                        Phân công
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Current Assignments */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Phân công hiện tại</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Case
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tình nguyện viên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày phân công
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
                  {assignments.map((assignment) => {
                    const caseItem = cases.find(c => c.id === assignment.caseId);
                    const volunteer = volunteers.find(v => v.id === assignment.volunteerId);
                    
                    return (
                      <tr key={assignment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {caseItem?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {volunteer?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(assignment.assignedDate).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(assignment.status)}`}>
                            {getStatusText(assignment.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleUnassignVolunteer(assignment.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Hủy phân công
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

export default VolunteerCoordination;

