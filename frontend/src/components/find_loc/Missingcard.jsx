import React from 'react';
import mapimg from './Capture.PNG';

const Missingcard = (props) => {
  return (
    <div className="mx-12">
      <div className="flex justify-center my-5 ">
        <div className="flex flex-col md:flex-row md:max-w-xl rounded-lg bg-white shadow-lg ">
          <img className="w-full h-96 md:h-auto object-cover md:w-40 rounded-t-lg md:rounded-none md:rounded-l-lg" src={mapimg} alt={props.name || 'map'} />
          <div className="p-4 flex flex-col justify-start ">
            <div className="flex ">
              <h5 className="text-gray-900 text-xl font-medium mb-2">{props.name}</h5>
              <h6 className="ml-5 text-gray-700 text-l font-medium mb-2">{props.adhaar}</h6>
            </div>
            <div className="text-gray-700 text-base mb-4">
              <span className="text-gray-900 text-m font-medium mb-2 mx-1">Found:</span> {props.date}
            </div>
            <div className="text-gray-700 text-base ">
              <div className="text-gray-700 text-base">
                <span className="text-gray-900 text-m font-medium mb-2 mx-1">Region:</span> {props.region}
              </div>
              <div className="flex">
                <p className="text-gray-700 text-base ">
                  <span className="text-gray-900 text-m font-medium mb-2 mx-1">Latitude:</span> {props.latitude}
                </p>
                <p className="text-gray-700 text-base  ml-2">
                  <span className="text-gray-900 text-m font-medium mb-2 mx-1">Longitude:</span>{props.longitude}
                </p>
              </div>
              <div className="flex">
                <p className="text-gray-700 text-base mb-4">
                  <span className="text-gray-900 text-m font-medium mb-2 mx-1">Country:</span>{props.country}
                </p>
                <p className="text-gray-700 text-base mb-4 ml-2">
                  <span className="text-gray-900 text-m font-medium mb-2 mx-1">City:</span> {props.state}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Missingcard;