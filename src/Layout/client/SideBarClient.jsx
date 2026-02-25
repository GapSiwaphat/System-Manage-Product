import React, { useState, useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { FaBars, FaShoppingBasket } from 'react-icons/fa';
import SideBar from '../../components/user/SideBar';
import axios from 'axios';

const SideBarClient = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { locationId } = useParams();
  const [locationName, setLocationName] = useState('กำลังโหลด...');


  useEffect(() => {
    const fetchLocationName = async () => {
      try {
        if (!locationId) return;
        const response = await axios.get(`http://localhost:3000/location/${locationId}`);
        console.log("Location fetch response:", response);

        if (response.data && response.data.name) {
             setLocationName(response.data.name);
        } else if (response.data.data && response.data.data.name) {
             setLocationName(response.data.data.name); 
        }

      } catch (err) {
        console.error("Error fetching location:", err);
        setLocationName('ไม่พบสถานที่');
      }
    };

    fetchLocationName();
  }, [locationId]); 


  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <header className="sticky top-0 z-30 bg-white px-4 py-3 shadow-sm flex justify-between items-center">

        <button 
          onClick={() => setIsSidebarOpen(true)} 
          className="text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <FaBars size={24} />
        </button>

        <h1 className="text-lg font-bold text-gray-800">
          Better View {locationName ? `(${locationName})` : ''}
        </h1>

        <button className="relative p-2 text-gray-700">
             <FaShoppingBasket size={24} />
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">

                </span>
        </button>
      </header>

      <SideBar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <main className="p-4 animate-fadeIn">
        <Outlet /> 
      </main>

    </div>
  );
};

export default SideBarClient;