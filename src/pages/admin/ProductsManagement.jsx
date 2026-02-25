import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { FaBoxOpen, FaLayerGroup, FaSave, FaTimes, FaEdit, FaTrash, FaSearch, FaExclamationTriangle, FaImage, FaFilter } from 'react-icons/fa';
import axios from 'axios';
import Addproduct from '../../components/admin/Addproduct';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [editData, setEditData] = useState({});
  const [editImage, setEditImage] = useState(null);
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.quantity < 5).length; 
  const outOfStockProducts = products.filter(p => p.quantity === 0).length;

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    let result = [...products]; 

    if (selectedCategory !== 'all') {
      result = result.filter(p => 
        String(p.category_id) === selectedCategory
      );
    }

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(product =>
        product.name.toLowerCase().includes(lowerTerm) ||
        (product.description && product.description.toLowerCase().includes(lowerTerm))
      );
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, products]); 


  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:3000/categories");
      const result = await response.json();
      setCategories(result.data || []); 
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:3000/products');
      if (res.data.success && Array.isArray(res.data.data)) {
        setProducts(res.data.data);
        setFilteredProducts(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching Product:', err);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setEditImage(e.target.files[0]);
    }
  };

  const handleEdit = (product) => {
    setEditRowId(product.id);
    setEditData({
      ...product,
      category_id: product.category_id, 
      category_name: product.category_name
    });
  };

  const handleCancel = () => {
    setEditRowId(null);
    setEditData({});
    setEditImage(null);
  };

  const handleSave = async (id) => {
    try {
        const form = new FormData();
        form.append("name", editData.name);
        form.append("description", editData.description || "");
        form.append("price", editData.price);
        form.append("quantity", editData.quantity); 
        form.append("category_id", editData.category_id); 
        if (editImage) form.append("image", editImage);
  
        const res = await axios.put(`http://localhost:3000/products/${id}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        if (res.data.success) {
          fetchProducts();
          handleCancel();

          Swal.fire({
            title: 'บันทึกสำเร็จ!',
            text: 'ข้อมูลสินค้าได้รับการอัปเดตแล้ว',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
          
        } else {
          Swal.fire({
            title: 'ไม่สามารถบันทึกได้!', 
            text: 'กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง', 
            icon: 'error'
          });
        }
      } catch (err) {
        console.error("Error saving product:", err);
        Swal.fire({
            title: 'เกิดข้อผิดพลาด!',
            text: 'ไม่สามารถเชื่อมต่อ Server เพื่อบันทึกข้อมูลได้',
            icon: 'error'
        });
      }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
        title: 'คุณต้องการลบรายการสินค้าหรือไม่?',
        text: "คุณแน่ใจหรือไม่ว่าต้องการลบสินค้าชิ้นนี้!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonText: 'ยกเลิก',
        confirmButtonText: 'ยืนยัน'
    });

    if (result.isConfirmed) {
        try {
            const res = await axios.delete(`http://localhost:3000/products/${id}`); 
            if (res.data.success) {
                fetchProducts();
                Swal.fire('ลบเรียบร้อย!', 'สินค้าถูกลบแล้ว', 'success');
            } else {
                Swal.fire('ล้มเหลว!', 'ไม่สามารถลบสินค้าได้ โปรดตรวจสอบ Server', 'error');
            }
        } catch (err) {
            console.error("Error deleting product:", err);
            Swal.fire('เกิดข้อผิดพลาด!', 'ไม่สามารถเชื่อมต่อ Server ได้', 'error');
        }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "category_id") {
      const selectedCat = categories.find(c => String(c.id) === String(value));
      setEditData(prev => ({
        ...prev,
        category_id: value,
        category_name: selectedCat ? selectedCat.name : ""
      }));
    } else {
      setEditData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen ">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FaLayerGroup className="text-blue-600"/> คลังสินค้า
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              จัดการสินค้าและสต็อก (ทั้งหมด {totalProducts} รายการ / แสดง {filteredProducts.length})
            </p>
          </div>
          <div className="w-full md:w-auto">
             <Addproduct />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
           <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs">สินค้าทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-800">{totalProducts}</p>
            </div>
            <FaBoxOpen className="text-blue-200 text-3xl" />
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-yellow-500 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs">ใกล้หมด</p>
              <p className="text-2xl font-bold text-yellow-600">{lowStockProducts}</p>
            </div>
            <FaExclamationTriangle className="text-yellow-200 text-3xl" />
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-500 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs">หมดสต็อก</p>
              <p className="text-2xl font-bold text-red-600">{outOfStockProducts}</p>
            </div>
            <FaTimes className="text-red-200 text-3xl" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-6 sticky top-0 z-10 md:static pt-2 md:pt-0">
          <div className="bg-white p-3 rounded-lg shadow-sm flex items-center gap-3 border border-gray-200 flex-1">
            <FaSearch className="text-gray-400 text-lg shrink-0" />
            <input 
              type="text"
              placeholder="ค้นหาชื่อสินค้า..."
              className="w-full outline-none text-gray-700 text-sm bg-transparent min-w-0" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 relative md:w-64 shrink-0">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
               <FaFilter className="text-gray-400" />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full p-3 pl-10 rounded-lg text-sm text-gray-700 bg-transparent outline-none appearance-none cursor-pointer hover:bg-gray-50 transition"
            >
              <option value="all">หมวดหมู่ทั้งหมด</option>
              {categories.map((cat) => (
                <option key={cat.id} value={String(cat.id)}> 
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
        
        <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-16">No</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">ชื่อสินค้า</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-1/4">รายละเอียด</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">ราคา</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">คงเหลือ</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">หมวดหมู่</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">รูปภาพ</th>
                  <th className="px-5 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-24">จัดการ</th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p, index) => (
                    <tr key={p.id} className="hover:bg-blue-50 transition duration-150">
                      <td className="px-5 py-4 text-sm text-gray-500">{index + 1}</td>
                      
                      <td className="px-5 py-4 text-sm font-medium text-gray-900">
                        {editRowId === p.id ? (
                          <input type="text" name="name" value={editData.name} onChange={handleInputChange} className="border border-blue-400 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"/>
                        ) : p.name}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-500 truncate max-w-xs">
                        {editRowId === p.id ? (
                          <input type="text" name="description" value={editData.description} onChange={handleInputChange} className="border border-blue-400 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-200"/>
                        ) : p.description}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-900 font-semibold">
                        {editRowId === p.id ? (
                          <input type="number" name="price" value={editData.price} onChange={handleInputChange} className="border border-blue-400 rounded px-2 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-blue-200"/>
                        ) : `฿${parseFloat(p.price).toLocaleString()}`}
                      </td>

                      <td className="px-5 py-4 text-sm">
                        {editRowId === p.id ? (
                          <input type="number" name="quantity" value={editData.quantity} onChange={handleInputChange} className="border border-blue-400 rounded px-2 py-1 w-20 focus:outline-none focus:ring-2 focus:ring-blue-200"/>
                        ) : (
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.quantity === 0 ? 'bg-red-100 text-red-700' : p.quantity < 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                            {p.quantity}
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {editRowId === p.id ? (
                        <select name="category_id" value={editData.category_id || ""} onChange={handleInputChange} className="border border-blue-400 px-2 py-1 rounded w-full text-sm">
                            <option value="">เลือกหมวดหมู่</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                        ) : <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{p.category_name}</span>}
                      </td>

                      <td className="px-5 py-4">
                        {editRowId === p.id ? (
                          <input type="file" onChange={handleImageChange} className="text-xs w-40" />
                        ) : (
                          p.image_url ? (
                            <div className="w-10 h-10 rounded overflow-hidden border border-gray-200">
                                <img src={`http://localhost:3000${p.image_url}`} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                          ) : <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-300"><FaImage/></div>
                        )}
                      </td>

                      <td className="px-5 py-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          {editRowId === p.id ? (
                            <>
                              <button onClick={() => handleSave(p.id)} className="text-green-600 hover:bg-green-100 p-2 rounded-full transition"><FaSave /></button>
                              <button onClick={handleCancel} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition"><FaTimes /></button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleEdit(p)} className="text-blue-600 hover:bg-blue-100 p-2 rounded-full transition"><FaEdit /></button>
                              <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:bg-red-100 p-2 rounded-full transition"><FaTrash /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-5 py-10 text-center text-gray-500" colSpan="8">
                        <FaBoxOpen className="text-4xl text-gray-300 mb-2 mx-auto"/>
                        <p>ไม่พบข้อมูลสินค้า</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="block md:hidden space-y-4 pb-12">
          {filteredProducts.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 w-full">
              
              {editRowId === p.id ? (
                
                <div className="flex flex-col gap-3 animate-fade-in">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-bold text-blue-600">แก้ไขสินค้า</h3>
                    <button onClick={handleCancel} className="text-gray-400"><FaTimes /></button>
                  </div>
                  
                  <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500">ชื่อสินค้า</label>
                      <input type="text" name="name" value={editData.name} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 outline-none"/>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500">ราคา</label>
                        <input type="number" name="price" value={editData.price} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 outline-none"/>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500">จำนวน</label>
                        <input type="number" name="quantity" value={editData.quantity} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 outline-none"/>
                      </div>
                  </div>

                  <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500">หมวดหมู่</label>
                      <select name="category_id" value={editData.category_id || ""} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white">
                          <option value="">เลือกหมวดหมู่</option>
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                  </div>
                  
                  <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500">รายละเอียด</label>
                      <textarea name="description" value={editData.description} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 outline-none" rows="2"/>
                  </div>

                  <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500">อัปเดตรูปภาพ</label>
                      <input type="file" onChange={handleImageChange} className="text-xs w-full text-gray-500"/>
                  </div>

                  <button onClick={() => handleSave(p.id)} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm mt-2 shadow-sm active:bg-blue-700">
                    บันทึกการแก้ไข
                  </button>
                </div>
              ) : (
                
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 relative">
                    {p.image_url ? (
                      <img src={`http://localhost:3000${p.image_url}`} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300"><FaImage size={24} /></div>
                    )}
                    <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5 truncate px-1">
                        {p.category_name}
                    </span>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start">
                          <h3 className="font-bold text-gray-800 text-base truncate pr-2">{p.name}</h3>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-1">{p.description}</p>
                    </div>
                    
                    <div className="flex justify-between items-end mt-3">
                      <div>
                        <p className="text-blue-600 font-bold text-lg leading-tight">฿{parseFloat(p.price).toLocaleString()}</p>
                        <p className={`text-xs font-medium mt-1 flex items-center gap-1 ${p.quantity === 0 ? 'text-red-500' : p.quantity < 5 ? 'text-yellow-600' : 'text-green-600'}`}>
                            {p.quantity === 0 ? <FaTimes size={10}/> : <FaBoxOpen size={10}/>}
                            {p.quantity === 0 ? 'สินค้าหมด' : `เหลือ ${p.quantity}`}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                            onClick={() => handleEdit(p)} 
                            className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded-full hover:bg-blue-50 hover:text-blue-600 transition"
                        >
                            <FaEdit size={14}/>
                        </button>
                        <button 
                            onClick={() => handleDelete(p.id)} 
                            className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition"
                        >
                            <FaTrash size={14}/>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <FaBoxOpen className="text-5xl mb-3 opacity-20"/>
                  <p>ไม่พบรายการสินค้า</p>
              </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProductsManagement;