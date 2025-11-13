import React from 'react';

const Home = () => {
  return (
    <div className="flex items-center h-full bg-cover bg-top bg-no-repeat" 
         style={{ backgroundImage: "url('/hero-bg.png')" }}>
      <div className="mx-10 md:mx-20 lg:mx-40">
        <div className="text-left">
          <h1 className="m-0 text-4xl md:text-5xl lg:text-6xl font-semibold text-[#012970] leading-tight font-['Nunito',sans-serif]">
            Let's stand together and find your close ones with our recognition systems
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Home;
