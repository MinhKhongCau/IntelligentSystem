import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AreaManagement = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingArea, setEditingArea] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    coordinates: '',
    population: '',
    contactPerson: '',
    contactPhone: ''
  });

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockAreas = [
      {
        id: 1,
        name: 'Quận 1',
        description: 'Trung tâm thành phố Hồ Chí Minh',
        coordinates: '10.7769, 106.7009',
        population: '142625',
        contactPerson: 'Nguyễn Văn A',
        contactPhone: '0123456789',
        caseCount: 15,
        activeCases: 3
      },
      {
        id: 2,
        name: 'Quận 3',
        description: 'Khu vực trung tâm với nhiều chợ và trung tâm thương mại',
        coordinates: '10.7829, 106.6881',
        population: '190375',
        contactPerson: 'Trần Thị B',
        contactPhone: '0987654321',
        caseCount: 8,
        activeCases: 2
      },
      {
        id: 3,
        name: 'Quận 5',
        description: 'Khu vực Chợ Lớn với đông đúc dân cư',
        coordinates: '10.7540, 106.6689',
        population: '159073',
        contactPerson: 'Lê Văn C',
        contactPhone: '0369852147',
        caseCount: 12,
        activeCases: 4
      }
    ];

    setAreas(mockAreas);
    setLoading(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingArea) {
        // Update existing area
        setAreas(areas.map(area => 
          area.id === editingArea.id ? { ...area, ...formData } : area
        ));
      } else {
        // Add new area
        const newArea = {
          id: areas.length + 1,
          ...formData,
          caseCount: 0,
          activeCases: 0
        };
        setAreas([...areas, newArea]);
      }
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        coordinates: '',
        population: '',
        contactPerson: '',
        contactPhone: ''
      });
      setShowAddForm(false);
      setEditingArea(null);
    } catch (error) {
      console.error('Error saving area:', error);
    }
  };

  const handleEdit = (area) => {
    setEditingArea(area);
    setFormData({
      name: area.name,
      description: area.description,
      coordinates: area.coordinates,
      population: area.population,
      contactPerson: area.contactPerson,
      contactPhone: area.contactPhone
    });
    setShowAddForm(true);
  };

  const handleDelete = (areaId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khu vực này?')) {
      setAreas(areas.filter(area => area.id !== areaId));
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      coordinates: '',
      population: '',
      contactPerson: '',
      contactPhone: ''
    });
    setShowAddForm(false);
    setEditingArea(null);
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quản lý Khu vực</h1>
              <p className="mt-2 text-gray-600">Quản lý các khu vực và thông tin liên hệ</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Thêm khu vực
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">TA</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Tổng khu vực</dt>
                    <dd className="text-lg font-medium text-gray-900">{areas.length}</dd>
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
                    <span className="text-white text-sm font-bold">TC</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Tổng case</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {areas.reduce((sum, area) => sum + area.caseCount, 0)}
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
                    <span className="text-white text-sm font-bold">AC</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Case đang hoạt động</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {areas.reduce((sum, area) => sum + area.activeCases, 0)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                {editingArea ? 'Chỉnh sửa khu vực' : 'Thêm khu vực mới'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên khu vực *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tọa độ
                    </label>
                    <input
                      type="text"
                      placeholder="lat, lng"
                      value={formData.coordinates}
                      onChange={(e) => setFormData({...formData, coordinates: e.target.value})}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dân số
                    </label>
                    <input
                      type="text"
                      value={formData.population}
                      onChange={(e) => setFormData({...formData, population: e.target.value})}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Người liên hệ
                    </label>
                    <input
                      type="text"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại liên hệ
                    </label>
                    <input
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    {editingArea ? 'Cập nhật' : 'Thêm'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Areas List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Danh sách khu vực</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên khu vực
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mô tả
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dân số
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Người liên hệ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Case/Tổng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {areas.map((area) => (
                    <tr key={area.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {area.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {area.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {area.population ? parseInt(area.population).toLocaleString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <div>{area.contactPerson}</div>
                          <div className="text-xs text-gray-400">{area.contactPhone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <span className="text-red-600 font-medium">{area.activeCases}</span>
                          <span className="text-gray-400">/{area.caseCount}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(area)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(area.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Xóa
                        </button>
                        <Link
                          to={`/area-details/${area.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Chi tiết
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaManagement;
