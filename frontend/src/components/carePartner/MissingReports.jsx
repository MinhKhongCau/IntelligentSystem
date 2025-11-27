import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const MissingReports = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [missingDocument, setMissingDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMissingDocument();
        fetchReports();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchMissingDocument = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/missing-documents/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Không thể tải thông tin người mất tích');
            }

            const data = await response.json();
            setMissingDocument(data);
        } catch (err) {
            console.error('Error fetching missing document:', err);
            setError(err.message);
        }
    };

    const fetchReports = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/missing-documents/reports/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Không thể tải danh sách báo cáo');
            }

            const data = await response.json();
            setReports(data);
        } catch (err) {
            console.error('Error fetching reports:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateTime) => {
        if (!dateTime) return 'N/A';
        const date = new Date(dateTime);
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'px-3 py-1 rounded-full text-xs font-semibold uppercase bg-yellow-100 text-yellow-800';
            case 'verified':
                return 'px-3 py-1 rounded-full text-xs font-semibold uppercase bg-green-100 text-green-800';
            case 'rejected':
                return 'px-3 py-1 rounded-full text-xs font-semibold uppercase bg-red-100 text-red-800';
            default:
                return 'px-3 py-1 rounded-full text-xs font-semibold uppercase bg-gray-200 text-gray-700';
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-5 bg-gray-50 min-h-screen">
                <div className="flex justify-center items-center min-h-[400px] text-xl text-gray-600">
                    Đang tải...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto p-5 bg-gray-50 min-h-screen">
                <div className="bg-white rounded-lg p-10 text-center text-red-600 text-lg">
                    <p>Lỗi: {error}</p>
                    <button 
                        onClick={() => navigate(-1)} 
                        className="mt-5 px-5 py-2.5 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-5 bg-gray-50 min-h-screen">
            <div className="flex items-center gap-5 mb-8">
                <button 
                    onClick={() => navigate(-1)} 
                    className="px-5 py-2.5 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-base"
                >
                    ← Quay lại
                </button>
                <h1 className="text-3xl font-bold text-gray-800 m-0">Báo cáo phát hiện</h1>
            </div>

            {missingDocument && (
                <div className="bg-white rounded-lg p-5 mb-8 shadow-md">
                    <div className="flex gap-5 items-start">
                        <img 
                            src={`http://localhost:8080${missingDocument.facePictureUrl}`} 
                            alt={missingDocument.name}
                            className="w-40 h-40 object-cover rounded-lg border-4 border-gray-300"
                            onError={(e) => {
                                e.target.src = '/default-avatar.png';
                            }}
                        />
                        <div className="flex-1">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{missingDocument.name}</h2>
                            <p className="my-2 text-gray-700 text-base">
                                <strong>Giới tính:</strong> {missingDocument.gender}
                            </p>
                            <p className="my-2 text-gray-700 text-base">
                                <strong>Ngày sinh:</strong> {formatDateTime(missingDocument.birthday)}
                            </p>
                            <p className="my-2 text-gray-700 text-base">
                                <strong>Thời gian mất tích:</strong> {formatDateTime(missingDocument.missingTime)}
                            </p>
                            <p className="my-2 text-gray-700 text-base">
                                <strong>Trạng thái:</strong> <span className={getStatusBadgeClass(missingDocument.caseStatus)}>{missingDocument.caseStatus}</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-5">Danh sách báo cáo ({reports.length})</h2>
                
                {reports.length === 0 ? (
                    <div className="bg-white rounded-lg p-10 text-center text-gray-600 text-lg">
                        <p>Chưa có báo cáo nào cho bài đăng này</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {reports.map((report) => (
                            <div key={report.id} className="bg-white rounded-lg p-5 shadow-md hover:-translate-y-1 hover:shadow-lg transition-all">
                                <div className="flex justify-between items-start mb-4 pb-4 border-b-2 border-gray-100">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Báo cáo #{report.id}</h3>
                                        <p className="text-sm text-gray-600 m-0">
                                            Người báo: <strong>{report.volunteerName}</strong>
                                        </p>
                                    </div>
                                    <span className={getStatusBadgeClass(report.reportStatus)}>
                                        {report.reportStatus || 'Pending'}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div className="text-sm text-gray-600">
                                        <strong>Thời gian báo cáo:</strong> {formatDateTime(report.reportTime)}
                                    </div>

                                    {report.sightingPicture && (
                                        <div className="w-full rounded-lg overflow-hidden">
                                            <img 
                                                src={`http://localhost:8080${report.sightingPicture}`}
                                                alt="Hình ảnh phát hiện"
                                                className="w-full h-48 object-cover"
                                                onError={(e) => {
                                                    e.target.src = '/default-image.png';
                                                }}
                                            />
                                        </div>
                                    )}

                                    {report.description && (
                                        <div className="text-gray-700">
                                            <strong className="block mb-1 text-gray-800">Mô tả:</strong>
                                            <p className="m-0 leading-relaxed">{report.description}</p>
                                        </div>
                                    )}

                                    {report.sightingArea && (
                                        <div className="text-sm text-gray-700">
                                            <strong className="block mb-1 text-gray-800">Địa điểm phát hiện:</strong>
                                            <p className="my-1">
                                                {report.sightingArea.commune && `${report.sightingArea.commune}, `}
                                                {report.sightingArea.district && `${report.sightingArea.district}, `}
                                                {report.sightingArea.province && `${report.sightingArea.province}, `}
                                                {report.sightingArea.country}
                                            </p>
                                            {(report.latitude && report.longitude) && (
                                                <p className="text-xs text-gray-500 italic">
                                                    Tọa độ: {report.latitude}, {report.longitude}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MissingReports;
