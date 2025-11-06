
import React from 'react';

const AccountCard = ({ account }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center">
        <div>
          <p className="text-lg font-semibold text-gray-800">{account.username}</p>
          <p className="text-sm text-gray-600">{account.email}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Detail
        </button>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Reject
        </button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Accept
        </button>
      </div>
    </div>
  );
};

export default AccountCard;
