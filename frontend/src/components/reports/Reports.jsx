import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState({
    from: '',
    to: ''
  });

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockReports = [
      {
        id: 1,
        title: 'Báo cáo tháng 1/2024',
        type: 'MONTHLY',
        generatedDate: '2024-02-01',
        generatedBy: 'Hệ thống',
        description: 'Báo cáo tổng hợp các case trong tháng 1/2024',
        status: 'COMPLETED',
        fileUrl: '/reports/monthly-2024-01.pdf',
        statistics: {
          totalCases: 45,
          resolvedCases: 33,
          activeCases: 12,
          newCases: 8
        }
      },
      {
        id: 2,
        title: 'Báo cáo CCTV Detection',
        type: 'CCTV',
        generatedDate: '2024-01-20',
        generatedBy: 'AI System',
        description: 'Báo cáo phát hiện từ hệ thống CCTV',
        status: 'COMPLETED',
        fileUrl: '/reports/cctv-detection-2024-01-20.pdf',
        statistics: {
          totalDetections: 25,
          verifiedDetections: 8,
          falsePositives: 17,
          accuracy: 0.32
        }
      },
      {
        id: 3,
        title: 'Báo cáo tình nguyện viên',
        type: 'VOLUNTEER',
        generatedDate: '2024-01-15',
        generatedBy: 'Admin',
        description: 'Báo cáo hoạt động của tình nguyện viên',
        status: 'PENDING',
        fileUrl: null,
        statistics: {
          totalVolunteers: 25,
          activeVolunteers: 18,
          totalHours: 240,
          casesHelped: 12
        }
      },
      {
        id: 4,
        title: 'Báo cáo theo khu vực',
        type: 'AREA',
        generatedDate: '2024-01-10',
        generatedBy: 'Police Officer',
        description: 'Báo cáo case theo từng khu vực',
        status: 'COMPLETED',
        fileUrl: '/reports/area-report-2024-01-10.pdf',
        statistics: {
          totalAreas: 12,
          highRiskAreas: 3,
          totalPopulation: 1500000,
          casesPerArea: 3.75
        }
      }
    ];

    setReports(mockReports);
    setLoading(false);
  }, []);

  const handleGenerateReport = async (reportType) => {
    try {
      // Mock report generation - replace with actual API call
      const newReport = {
        id: reports.length + 1,
        title: `Báo cáo ${reportType} - ${new Date().toLocaleDateString('vi-VN')}`,
        type: reportType,
        generatedDate: new Date().toISOString().split('T')[0],
        generatedBy: 'Current User',
        description: `Báo cáo ${reportType} được tạo tự động`,
        status: 'GENERATING',
        fileUrl: null,
        statistics: {}
      };

      setReports([newReport, ...reports]);

      // Simulate report generation
      setTimeout(() => {
        setReports(reports.map(r =>
          r.id === newReport.id
            ? { ...r, status: 'COMPLETED', fileUrl: `/reports/${reportType}-${Date.now()}.pdf` }
            : r
        ));
      }, 3000);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'GENERATING':
        return 'bg-blue-100 text-blue-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'PENDING':
        return 'Chờ xử lý';
      case 'GENERATING':
        return 'Đang tạo';
      case 'FAILED':
        return 'Thất bại';
      default:
        return 'Không xác định';
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'MONTHLY':
        return 'Báo cáo tháng';
      case 'CCTV':
        return 'Báo cáo CCTV';
      case 'VOLUNTEER':
        return 'Báo cáo tình nguyện viên';
      case 'AREA':
        return 'Báo cáo khu vực';
      case 'CUSTOM':
        return 'Báo cáo tùy chỉnh';
      default:
        return 'Không xác định';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesFilter = filter === 'ALL' || report.type === filter;
    const matchesDateRange = (!dateRange.from || report.generatedDate >= dateRange.from) &&
                           (!dateRange.to || report.generatedDate <= dateRange.to);
    return matchesFilter && matchesDateRange;
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
              <h1 className="text-3xl font-bold text-gray-900">Report</h1>
              <p className="mt-2 text-gray-600">Xem và tạo các báo cáo hệ thống</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => handleGenerateReport('MONTHLY')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Tạo báo cáo tháng
              </button>
              <button
                onClick={() => handleGenerateReport('CCTV')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Tạo báo cáo CCTV
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">TR</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Tổng báo cáo</dt>
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
                    <span className="text-white text-sm font-bold">CR</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Hoàn thành</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {reports.filter(r => r.status === 'COMPLETED').length}
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
                    <span className="text-white text-sm font-bold">PR</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Chờ xử lý</dt>
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
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-bold">GR</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Đang tạo</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {reports.filter(r => r.status === 'GENERATING').length}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại báo cáo
                </label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="ALL">Tất cả</option>
                  <option value="MONTHLY">Báo cáo tháng</option>
                  <option value="CCTV">Báo cáo CCTV</option>
                  <option value="VOLUNTEER">Báo cáo tình nguyện viên</option>
                  <option value="AREA">Báo cáo khu vực</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Từ ngày
                </label>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đến ngày
                </label>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Danh sách báo cáo</h3>
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div key={report.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{report.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                      {getStatusText(report.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Loại:</span>
                      <span className="ml-2 text-sm text-gray-500">{getTypeText(report.type)}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Ngày tạo:</span>
                      <span className="ml-2 text-sm text-gray-500">
                        {new Date(report.generatedDate).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Tạo bởi:</span>
                      <span className="ml-2 text-sm text-gray-500">{report.generatedBy}</span>
                    </div>
                  </div>

                  {/* Statistics */}
                  {Object.keys(report.statistics).length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Thống kê:</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(report.statistics).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className="text-lg font-semibold text-gray-900">
                              {typeof value === 'number' && value < 1 ?
                                `${(value * 100).toFixed(1)}%` :
                                value.toLocaleString()
                              }
                            </div>
                            <div className="text-xs text-gray-500 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4">
                      {report.fileUrl && (
                        <a
                          href={report.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                        >
                          Tải xuống PDF
                        </a>
                      )}
                      <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                        Xem chi tiết
                      </button>
                    </div>

                    {report.status === 'PENDING' && (
                      <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">
                        Xử lý
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredReports.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Không có báo cáo nào phù hợp với bộ lọc.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
