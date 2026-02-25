import React, { useState, useEffect } from 'react';
import { FaQrcode, FaEdit, FaTrash, FaTimes, FaDownload } from 'react-icons/fa';
import Swal from 'sweetalert2';
import LocationForm from '../../components/admin/locationForm.jsx'; 
import { QRCodeCanvas } from 'qrcode.react';

const Location = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false); 
    const [currentLocation, setCurrentLocation] = useState(null); 
    const [qrLocation, setQrLocation] = useState(null);
    
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch('http://localhost:3000/location'); 
                
                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(`HTTP error! Status: ${response.status}. Response: ${text.substring(0, 100)}`);
                }
                
                const result = await response.json();
                
                if (result.success) {
                    const cleanData = Array.isArray(result.data) 
                        ? result.data.filter(item => item && item.id) 
                        : [];
                    setLocations(cleanData);
                } else {
                    setError(result.message || "Failed to fetch data.");
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Error fetching location data: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, []);
    
    const handleDelete = async (id, name) => {
        const result = await Swal.fire({
            title: 'ยืนยันการลบ?',
            text: `คุณต้องการลบ: ${name}  หรือไม่?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`http://localhost:3000/location/${id}`, {
                    method: 'DELETE',
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
                }
                setLocations(prev => prev.filter(loc => loc?.id !== id));
                Swal.fire('ลบสำเร็จ!', `รายการ ${name} ถูกลบแล้ว`, 'success');

            } catch (err) {
                console.error("Delete error:", err);
                Swal.fire('เกิดข้อผิดพลาด!', `ไม่สามารถลบรายการ ${name} ได้: ${err.message}`, 'error');
            }
        }
    };

    const handleEdit = (location) => {
        if (!location) return;
        setCurrentLocation(location); 
        setIsFormOpen(true);          
    };

    const handleCreateNew = () => {
        setCurrentLocation(null);
        setIsFormOpen(true);     
    };

    const handleSave = (savedLocation) => {
        if (!savedLocation || !savedLocation.id) {
            console.error("Save failed: Invalid data received", savedLocation);
            return;
        }

        if (currentLocation) {
            setLocations(prevLocations => prevLocations.map(loc => {
                if (!loc || typeof loc !== 'object') return loc;
                if (loc.id === savedLocation.id) {
                    return savedLocation;
                }
                return loc;
            }));
        } else {
            setLocations(prevLocations => [...prevLocations, savedLocation]);
        }
    };

    const handleShowQR = (location) => {
        setQrLocation(location);
    }

    const handleCloseQr = () => {
        setQrLocation(null);
    };

    const downloadQRCode = () => {
        const canvas = document.querySelector('canvas');

        if (canvas){
            const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

            let downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = `QR_${qrLocation.name}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    }

    if (loading) {
        return <div className="p-4 text-center">Loading locations...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="p-4 md:p-8 min-h-screen"> 
            {qrLocation && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    {/* ปรับความกว้าง: มือถือ w-[90%], จอใหญ่ max-w-sm */}
                    <div className="bg-white p-6 rounded-xl shadow-2xl flex flex-col items-center w-[90%] max-w-sm relative animate-fadeIn">
                        <button 
                            onClick={handleCloseQr}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors p-1"
                        >
                            <FaTimes size={20} />
                        </button>
                        
                        <h3 className="text-xl font-bold mb-2 text-gray-800 text-center pr-6">{qrLocation.name}</h3>
                        <p className="text-gray-500 text-sm mb-4">สแกนเพื่อสั่งสินค้า</p>
                        
                        <div className="p-4 border border-gray-100 shadow-inner rounded-lg bg-white">
                            <QRCodeCanvas 
                                id="qr-gen"
                                value={`${window.location.origin}/location/${qrLocation.id}`} 
                                size={200}
                                level={"H"}
                                includeMargin={true}
                                className="w-full h-auto" 
                            />
                        </div>

                        <button 
                            onClick={downloadQRCode} 
                            className='w-full justify-center text-sm font-medium bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition duration-150 flex items-center space-x-2 mt-5 shadow-sm'
                        >
                            <FaDownload /> 
                            <span>บันทึกรูปภาพ</span>
                        </button>
                    </div>
                </div>
            )}

            {isFormOpen && (
                <LocationForm 
                    locationData={currentLocation} 
                    onClose={() => setIsFormOpen(false)}
                    onSave={handleSave}                
                />
            )}
            <div className='flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0'>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center md:text-left">
                    จัดการข้อมูลสถานที่
                </h1>
                <button 
                    onClick={handleCreateNew} 
                    className="w-full md:w-auto text-base font-medium bg-green-600 text-white px-6 py-2.5 rounded-lg shadow-md hover:bg-green-700 transition duration-150 active:scale-95"
                >
                    + เพิ่มรายการใหม่
                </button>
            </div>
        
            <p className='hidden md:block text-gray-600 mt-2 mb-6 text-sm md:text-base border-l-4 border-indigo-500 pl-3 bg-indigo-50 p-3 rounded-r-md'> 
                หน้านี้ใช้สำหรับ **เพิ่ม ลบ แก้ไข และดูรายละเอียด** ของสถานที่
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {locations.map((loc) => {
                    if (!loc?.id) return null;

                    return (
                        <div 
                            key={loc.id} 
                            className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition duration-200 flex flex-col justify-between h-full"
                        >
                            <div>
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900 truncate pr-2">
                                        {loc.name}
                                    </h3>
                                </div>

                                <p className="text-gray-600 mt-2 text-sm md:text-base line-clamp-3 min-h-[3rem]">
                                    {loc.description || "ไม่มีรายละเอียด"}
                                </p>
                            </div>
                    
                            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap justify-between items-center gap-2"> 
                                <button 
                                    onClick={() => handleShowQR(loc)} 
                                    className='flex-1 md:flex-none justify-center flex items-center space-x-1 text-sm font-semibold bg-amber-500 text-white px-3 py-2 rounded-lg shadow-sm hover:bg-amber-600 transition duration-200' 
                                >
                                    <FaQrcode className="w-4 h-4" /> 
                                    <span>QR</span>
                                </button>
                            
                                <div className='flex flex-1 md:flex-none space-x-2 justify-end'>
                                    <button 
                                        onClick={() => handleEdit(loc)}
                                        className="flex-1 md:flex-none justify-center text-sm font-medium bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition duration-150 flex items-center space-x-1"
                                    >
                                        <FaEdit /> <span>Edit</span>
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(loc.id, loc.name)} 
                                        className="flex-1 md:flex-none justify-center text-sm font-medium bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition duration-150 flex items-center space-x-1"
                                    >
                                        <FaTrash /> <span>Del</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default Location;