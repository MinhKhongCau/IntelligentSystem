import React from 'react';

const AccountCard = ({ account, onEdit, onDelete, onAccept }) => {
  const getStatusBadge = () => {
    if (account.accountStatus) {
      return <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Active</span>;
    }
    return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">Pending</span>;
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <p className="text-lg font-semibold text-gray-800">{account.fullName || account.username}</p>
          {getStatusBadge()}
        </div>
        <p className="text-sm text-gray-600">{account.email}</p>
        <p className="text-xs text-gray-500 mt-1">
          Type: <span className="font-medium">{account.accountType || 'N/A'}</span>
        </p>
      </div>
      <div className="flex gap-2">
        {onEdit && (
          <button 
            onClick={() => onEdit(account)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Edit
          </button>
        )}
        {!account.accountStatus && onAccept && (
          <button 
            onClick={() => onAccept(account.id)}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Accept
          </button>
        )}
        {onDelete && (
          <button 
            onClick={() => onDelete(account.id)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default AccountCard;
