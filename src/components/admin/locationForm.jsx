import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
const LocationForm = ({ locationData, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        ...(locationData || {}) 
    });
    const [isSaving, setIsSaving] = useState(false);
    const isEditMode = !!locationData;

    useEffect(() => {
        if (locationData) {
            setFormData(locationData);
        } else {
            setFormData({ name: '', description: '' });
        }
    }, [locationData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const url = isEditMode 
            ? `http://localhost:3000/location/${formData.id}` 
            : 'http://localhost:3000/location';
        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            onSave(result.data); 
            onClose();

            Swal.fire('บันทึกสำเร็จ!', `รายการ ${formData.name} ถูกบันทึกแล้ว`, 'success');

        } catch (err) {
            console.error("Save error:", err);
            Swal.fire('เกิดข้อผิดพลาด!', `ไม่สามารถบันทึกรายการได้`, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    {isEditMode ? 'แก้ไขสถานที่' : 'เพิ่มสถานที่ใหม่'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">ชื่อสถานที่</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">คำอธิบาย</label>
                        <textarea
                            name="description"
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        ></textarea>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSaving}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {isSaving ? 'กำลังบันทึก...' : isEditMode ? 'บันทึกการแก้ไข' : 'เพิ่มรายการ'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LocationForm;