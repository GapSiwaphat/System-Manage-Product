import React, { useState, useEffect } from 'react';
import { FaEdit, FaSave, FaTimes, FaTrash, FaTags, FaPlus, FaSearch, FaLayerGroup, FaCheckCircle } from "react-icons/fa";

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [editRowId, setEditRowId] = useState(null);
  const [editData, setEditData] = useState({ name: "", description: "" });
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const results = categories.filter(cat =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(results);
  }, [searchTerm, categories]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:3000/categories");
      const result = await response.json();
      if (result.data) {
        setCategories(result.data);
        setFilteredCategories(result.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleEdit = (cat) => {
    setEditRowId(cat.id);
    setEditData({ name: cat.name, description: cat.description });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setEditRowId(null);
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({ ...prev, [name]: value }));
  };

  const handleClosePopup = () => {
    setShowAddPopup(false);
    setNewCategory({ name: '', description: '' });
  };

  const handleAddSave = async () => {
    if (!newCategory.name) return alert("กรุณากรอกชื่อหมวดหมู่");
    
    try {
      const response = await fetch("http://localhost:3000/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });
      
      if (!response.ok) {
        const data = await response.json();
        alert(data.error || "Error adding category");
        return;
      }
      fetchCategories();
      setNewCategory({ name: "", description: "" });
      setShowAddPopup(false);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("ยืนยันการลบ? สินค้าในหมวดนี้อาจได้รับผลกระทบ")) return;

    try {
      const response = await fetch(`http://localhost:3000/categories/${id}`, {
        method: "DELETE"
      });
      
      if (response.ok) {
        setCategories(prev => prev.filter(cat => cat.id !== id));
      } else {
        alert("ไม่สามารถลบได้");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleSave = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        const updated = categories.map(cat =>
            cat.id === id ? { ...cat, ...editData } : cat
        );
        setCategories(updated);
        setEditRowId(null);
      } else {
        alert("Error saving data");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:p-8 space-y-6  min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FaTags className="text-blue-600"/> จัดการหมวดหมู่
          </h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">
            จัดการประเภทสินค้าเพื่อให้ลูกค้าค้นหาได้ง่ายขึ้น
          </p>
        </div>
        <button 
            onClick={() => setShowAddPopup(true)}
            className="w-full md:w-auto flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg shadow-md transition-all active:scale-95"
        >
            <FaPlus /> เพิ่มหมวดหมู่
        </button>
      </div>

      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-blue-500 flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-xs md:text-sm">หมวดหมู่ทั้งหมด</p>
                <p className="text-xl md:text-2xl font-bold text-gray-800">{categories.length} รายการ</p>
            </div>
            <FaLayerGroup className="text-blue-200 text-3xl md:text-4xl" />
        </div>
      </div>

      {/* --- Search Bar --- */}
      <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm flex items-center gap-2 border border-gray-200">
        <FaSearch className="text-gray-400 shrink-0" />
        <input 
          type="text"
          placeholder="ค้นหาหมวดหมู่..."
          className="w-full outline-none text-gray-700 text-sm md:text-base"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    
      <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full leading-normal">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase w-16">ID</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase w-1/4">ชื่อหมวดหมู่</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase">รายละเอียด</th>
              <th className="px-5 py-3 text-center text-xs font-bold text-gray-600 uppercase w-32">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCategories.map((cat, index) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-5 py-4 text-sm text-gray-500">{index + 1}</td>
                <td className="px-5 py-4 text-sm font-medium text-gray-900">
                    {editRowId === cat.id ? (
                        <input type="text" name="name" value={editData.name} onChange={handleChange} className="border border-blue-300 rounded px-2 py-1 w-full"/>
                    ) : cat.name}
                </td>
                <td className="px-5 py-4 text-sm text-gray-600">
                    {editRowId === cat.id ? (
                        <input type="text" name="description" value={editData.description} onChange={handleChange} className="border border-blue-300 rounded px-2 py-1 w-full"/>
                    ) : cat.description}
                </td>
                <td className="px-5 py-4 text-center">
                  <div className="flex justify-center gap-3">
                    {editRowId === cat.id ? (
                      <>
                        <button onClick={() => handleSave(cat.id)} className="text-green-600 hover:bg-green-50 p-2 rounded-full"><FaSave/></button>
                        <button onClick={handleCancel} className="text-red-500 hover:bg-red-50 p-2 rounded-full"><FaTimes/></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(cat)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-full"><FaEdit/></button>
                        <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full"><FaTrash/></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {filteredCategories.map((cat, index) => (
            <div key={cat.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 relative">
                {editRowId === cat.id ? (
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-bold text-gray-500">ชื่อหมวดหมู่</label>
                            <input type="text" name="name" value={editData.name} onChange={handleChange} className="w-full border border-blue-300 rounded p-2 mt-1"/>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500">รายละเอียด</label>
                            <textarea name="description" value={editData.description} onChange={handleChange} className="w-full border border-blue-300 rounded p-2 mt-1" rows="2"/>
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                             <button onClick={handleCancel} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm">ยกเลิก</button>
                             <button onClick={() => handleSave(cat.id)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">บันทึก</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-gray-800 text-lg">{cat.name}</h3>
                            <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">#{index + 1}</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">{cat.description || "ไม่มีรายละเอียด"}</p>
                        
                        <div className="border-t border-gray-100 pt-3 flex justify-end gap-3">
                            <button onClick={() => handleEdit(cat)} className="flex items-center gap-1 text-blue-600 text-sm font-medium p-2 hover:bg-blue-50 rounded-lg">
                                <FaEdit /> แก้ไข
                            </button>
                            <button onClick={() => handleDelete(cat.id)} className="flex items-center gap-1 text-red-500 text-sm font-medium p-2 hover:bg-red-50 rounded-lg">
                                <FaTrash /> ลบ
                            </button>
                        </div>
                    </>
                )}
            </div>
        ))}
        
        {filteredCategories.length === 0 && (
             <div className="text-center py-10 text-gray-400">
                 <FaSearch className="mx-auto text-3xl mb-2 opacity-30"/>
                 <p>ไม่พบข้อมูล</p>
             </div>
        )}
      </div>

      {showAddPopup && (
        <div className="fixed inset-0 flex items-end md:items-center justify-center z-50 p-0 md:p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={handleClosePopup}
          ></div>
          
          <div className="bg-white w-full md:max-w-md md:rounded-xl rounded-t-2xl shadow-2xl relative z-10 animate-in slide-in-from-bottom md:slide-in-from-bottom-10 duration-200">
            <div className="p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaPlus className="text-blue-600"/> เพิ่มหมวดหมู่
                    </h2>
                    <button onClick={handleClosePopup} className="text-gray-400 hover:text-gray-600 p-2">
                        <FaTimes size={20} />
                    </button>
                </div>
                
                <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">ชื่อหมวดหมู่ <span className="text-red-500">*</span></label>
                    <input 
                    type="text" 
                    name="name" 
                    placeholder="เช่น อุปกรณ์เดินป่า" 
                    value={newCategory.name} 
                    onChange={handleAddChange} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50 focus:bg-white"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">รายละเอียด</label>
                    <textarea 
                    name="description" 
                    placeholder="คำอธิบายเพิ่มเติม..." 
                    value={newCategory.description} 
                    onChange={handleAddChange} 
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition resize-none bg-gray-50 focus:bg-white"
                    />
                </div>
                </div>
                
                <div className="flex gap-3 mt-8">
                    <button 
                        className="flex-1 px-5 py-3 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 font-medium transition"
                        onClick={handleClosePopup}
                    >
                        ยกเลิก
                    </button>
                    <button 
                        className="flex-1 px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md transition"
                        onClick={handleAddSave}
                    >
                        บันทึก
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CategoriesManagement;