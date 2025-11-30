import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, roles, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/logout');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-200 p-5">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white rounded-lg shadow hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-4xl font-bold text-gray-800">My Profile</h1>
          <div className="w-24"></div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section with Gradient */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-48 relative p-8">
            <div className="absolute -bottom-16 left-8">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg overflow-hidden">
                {user?.profilePictureUrl ? (
                  <img 
                    src={user.profilePictureUrl.startsWith('http') ? user.profilePictureUrl : `http://localhost:8080${user.profilePictureUrl}`}
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-5xl font-bold text-white">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 px-8 pb-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{user?.username || 'User'}</h2>
              <div className="flex flex-wrap gap-2">
                {roles && roles.length > 0 ? (
                  roles.map((role, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full"
                    >
                      {role.replace('_', ' ')}
                    </span>
                  ))
                ) : (
                  <span className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full">
                    User
                  </span>
                )}
              </div>
            </div>

            {/* Profile Information */}
            <div className="space-y-6">
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Username */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Username</label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-800 font-medium">{user?.username || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-800 font-medium">{user?.email || 'Not provided'}</p>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-800 font-medium">{user?.fullName || 'Not provided'}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-800 font-medium">{user?.phone || 'Not provided'}</p>
                    </div>
                  </div>

                  {/* Account ID */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Account ID</label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-800 font-mono text-sm">{user?.id || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Account Status</label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="inline-flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-gray-800 font-medium">Active</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-gray-200 pt-6 flex flex-wrap gap-4">
                <button
                  onClick={handleEditProfile}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:bg-red-600 transition-all duration-200 hover:-translate-y-0.5"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-6 bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Role Permissions</h3>
          <div className="space-y-3">
            {roles.includes('POLICE') && (
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <svg className="w-6 h-6 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium text-gray-800">Police Access</p>
                  <p className="text-sm text-gray-600">Manage accounts, missing lists, and surveillance</p>
                </div>
              </div>
            )}
            {roles.includes('CARE_PARTNER') && (
              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                <svg className="w-6 h-6 text-purple-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium text-gray-800">Care Partner Access</p>
                  <p className="text-sm text-gray-600">Submit and manage missing person reports</p>
                </div>
              </div>
            )}
            {(!roles || roles.length === 0) && (
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <svg className="w-6 h-6 text-gray-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium text-gray-800">Standard User</p>
                  <p className="text-sm text-gray-600">View missing persons and tracked locations</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
