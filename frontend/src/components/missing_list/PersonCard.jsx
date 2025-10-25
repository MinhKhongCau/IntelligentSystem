import React from 'react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const PersonCard = (props) => {
  const deletethis = async (id) => {
    if (!window.confirm(`Delete person with adhaar ${id}?`)) return;
    try {
      const response = await fetch(`${API_BASE}/api/missingpeople/deleteperson/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        alert(`Person ${id} deleted`);
        if (typeof props.onDelete === 'function') props.onDelete(id);
      } else {
        const json = await response.json().catch(() => ({}));
        alert(json.message || 'Delete failed');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  return (
    <div>
      <div className="mx-20 grid my-4">
        <div className="flex flex-row rounded-lg border border-gray-200/80 bg-white p-6">
          <div className="relative">
            <img className="w-40 h-40 rounded-md object-cover" src={props.image} alt={props.name} />
          </div>

          <div className="flex flex-col px-6">
            <div className="flex h-8 flex-row">
              <a href="#" target="_blank" rel="noreferrer">
                <h2 className="text-lg font-semibold">{props.name}</h2>
              </a>
              <div className="mx-4 text-lg">{props.gender}</div>
            </div>

            <div className="my-2 flex flex-row space-x-2">
              <div className="flex flex-row">
                <div className="text-xs text-gray-400/80">{props.adhaar}</div>
              </div>

              <div className="flex flex-row">
                <div className="text-xs text-gray-400/80">{props.address}</div>
              </div>

              <div className="flex flex-row">
                <div className="text-xs text-gray-400/80">{props.email}</div>
              </div>
            </div>

            <div className="mt-2 flex flex-row items-center space-x-5">
              <div className="flex h-20 w-40 flex-col items-center justify-center rounded-md border border-dashed border-gray-200">
                <div className="flex flex-row items-center justify-center">
                  <img src="https://img.icons8.com/material-outlined/24/000000/calendar-13.png" width="20" alt="" />
                  <span className="font-bold text-black-600">{props.date}</span>
                </div>
                <div className="mt-2 text-sm text-black-400">Missing From</div>
              </div>

              <div className="flex h-20 w-40 flex-col items-center justify-center rounded-md border border-dashed border-gray-200">
                <div className="flex flex-row items-center justify-center">
                  <img src="https://img.icons8.com/external-outline-agus-raharjo/64/000000/external-height-healthcare-outline-agus-raharjo.png" width="30" alt="" />
                  <span className="font-bold text-black-600">{props.height}</span>
                </div>
                <div className="mt-2 text-sm text-black-400">Height</div>
              </div>

              <div className="flex h-20 w-40 flex-col items-center justify-center rounded-md border border-dashed border-gray-200">
                <div className="flex flex-row items-center justify-center">
                  <img src="https://img.icons8.com/external-parzival-1997-detailed-outline-parzival-1997/64/000000/external-identification-touchless-society-parzival-1997-detailed-outline-parzival-1997.png" width="30" alt="" />
                  <span className="font-bold text-black-600">{props.identification}</span>
                </div>
                <div className="mt-2 text-sm text-black-400">Identification</div>
              </div>
            </div>
          </div>

          <div className="w-100 flex flex-grow flex-col items-end justify-start">
            <div className="flex flex-row space-x-3">
              <button className="flex rounded-md bg-blue-500 py-2 px-4 text-white" onClick={() => deletethis(props.adhaar)}>
                Delete case
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonCard;