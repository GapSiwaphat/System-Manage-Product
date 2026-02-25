import React from 'react'
import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaTimes, FaBoxOpen, FaTag, FaInfoCircle, FaDollarSign, FaLayerGroup, FaImage, FaSave } from 'react-icons/fa';

const Addproduct = () => {
    const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    image: ''
  });

  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files) {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("price", formData.price);
      form.append("quantity", formData.quantity);
      form.append("category_id", formData.category);  
      form.append("image", formData.image); 

      const res = await axios.post("http://localhost:3000/products", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        console.log("New Product:", res.data.product);
        setIsOpen(false);
        setFormData({
          name: '',
          description: '',
          price: '',
          quantity: '',
          category: '',
          image: null
        });
        
        Swal.fire({
            title: 'เพิ่มสินค้าสำเร็จ!',
            text: `สินค้า "${formData.name}" ถูกเพิ่มแล้ว`,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        });

      } else {
        Swal.fire({
            title: 'เกิดข้อผิดพลาด!', 
            text: 'ไม่สามารถเพิ่มสินค้าได้ กรุณาลองอีกครั้ง', 
            icon: 'error'
        });
      }
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:3000/categories'); 
        if (res.data.success && Array.isArray(res.data.data)) {
          setCategories(res.data.data);
        } else {
          console.error('Invalid categories data format');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className='max-w-6xl mx-auto p-6 space-y-6'>
      {/* ปุ่มเปิด Popup */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
        >
          + เพิ่มสินค้าใหม่
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl relative">
            
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
            >
              <FaTimes size={20} />
            </button>

            <form onSubmit={handleSubmit} className="overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 rounded-t-2xl">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <FaBoxOpen className="text-gray-600" />
                  ข้อมูลสินค้า
                </h2>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FaTag className="text-gray-500" />
                    ชื่อสินค้า<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="กรอกชื่อสินค้า"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FaInfoCircle className="text-gray-500" />
                    รายละเอียดสินค้า<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="กรอกรายละเอียดสินค้า"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
                    required
                  />
                </div>

                {/* Price & Quantity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <FaDollarSign className="text-gray-500" />
                      ราคา (บาท)<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <FaLayerGroup className="text-gray-500" />
                      จำนวนสินค้า<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FaLayerGroup className="text-gray-500" />
                    หมวดหมู่สินค้า<span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                    required
                  >
                    <option value="">เลือกหมวดหมู่สินค้า</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FaImage className="text-gray-500" />
                    รูปภาพสินค้า<span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="file" 
                    name="image" 
                    accept="image/*" 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:justify-end rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 font-medium"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 font-medium flex items-center justify-center gap-2 shadow-lg"
                >
                  <FaSave className="text-sm" />
                  บันทึกสินค้า
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Addproduct
