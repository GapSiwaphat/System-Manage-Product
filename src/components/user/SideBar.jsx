import React, { useState, useEffect } from 'react'; 
import { NavLink, useParams } from 'react-router-dom';
import Swal from 'sweetalert2'; 
import axios from 'axios';
import { FaHome, FaShoppingBasket, FaHistory, FaBell, FaTimes, FaMapMarkerAlt} from 'react-icons/fa';
import Logo from'../../assets/Logo.png';

const SideBar = ({ isOpen, onClose }) => {
    const { locationId } = useParams();
    const [locationName, setLocationName] = useState();

    useEffect(() => {
        const fetchLocationName = async () => {
            if (!locationId) {
                setLocationName('กรุณาสแกน QR ใหม่');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:3000/location/${locationId}`);
                
                if (response.data && response.data.success) {
                    setLocationName(response.data.data.name); 
                }
            } catch (err) {
                console.error("Error fetching location name:", err);
                setLocationName('ไม่พบข้อมูลสถานที่');
            }
        };

        fetchLocationName();
    }, [locationId]);

    const menuItems = [
        { 
            path: `/location/${locationId}`, 
            icon: <FaHome size={20} />, 
            label: 'หน้าแรก (เมนู)' 
        },
        { 
            path: `/location/${locationId}/cart`, 
            icon: <FaShoppingBasket size={20} />, 
            label: 'ตะกร้าของฉัน' 
        },
    ];

    const handleCallStaff = () => {
        onClose(); 
        Swal.fire({
            title: 'ต้องการความช่วยเหลือ?',
            text: `ยืนยันเรียกพนักงานมาที่: ${locationName}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33', 
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'ใช่, เรียกพนักงาน',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'แจ้งเรียบร้อย!',
                    'พนักงานกำลังเดินทางไปหาคุณครับ',
                    'success'
                );
            }
        });
    };

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
                    isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                onClick={onClose}
            ></div>

            {/* Sidebar Container */}
            <aside 
                className={`fixed top-0 left-0 h-full w-[280px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Header Section */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <img src={Logo} className='h-15 w-auto' alt="" />
                        <span>Better View</span>
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Location Info */}
                <div className="p-4 mx-4 mt-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="bg-white p-2 rounded-full shadow-sm text-indigo-600">
                            <FaMapMarkerAlt size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mb-0.5">
                                ตำแหน่งของคุณ
                            </p>
                            <p className="text-lg font-bold text-gray-800 leading-tight">
                                {locationName}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">บริการส่งถึงหน้าเต็นท์</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="p-4 space-y-2 mt-2">
                    {menuItems.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.path}
                            onClick={onClose} 
                            className={({ isActive }) => 
                                `flex items-center gap-4 p-3.5 rounded-xl transition-all duration-200 group ${
                                    isActive 
                                    ? 'bg-green-100 text-green-700 font-bold shadow-sm' 
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`
                            }
                        >
                            <span className={({ isActive }) => isActive ? 'text-green-700' : 'text-gray-400 group-hover:text-gray-600'}>
                                {item.icon}
                            </span>
                            <span className="text-sm">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Footer Button */}
                <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-100 bg-gray-50">
                    <button 
                        onClick={handleCallStaff}
                        className="w-full flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 py-3 rounded-xl font-semibold shadow-sm hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200 active:scale-95"
                    >
                        <FaBell className="animate-pulse" /> 
                        <span>เรียกพนักงานด่วน</span>
                    </button>
                    
                    <p className="text-center text-[10px] text-gray-400 mt-4">
                        Better Scan System v1.0
                    </p>
                </div>
            </aside>
        </>
    )
}

export default SideBar;