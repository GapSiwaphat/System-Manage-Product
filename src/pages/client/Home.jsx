import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../../context/useCart';

const API_BASE_URL = "http://localhost:3000";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/categories`);
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory !== "all") {
          params.category_id = selectedCategory;
        }
        const res = await axios.get(`${API_BASE_URL}/products`, { params });
        if (res.data.success) {
          setProducts(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  const { addToCart } = useCart();

  const handleAddProductToCart = (product) => {
    const item = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1 ,
        image_url: product.image_url
    };
    
    addToCart(item);
    console.log(`Added ${product.name} to cart.`);
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="pt-8 pb-4 px-4 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800">สินค้า</h1>
        <p className="text-gray-500 text-sm">กรุณาเลือกสินค้าได้ตามหมวดหมู่</p>
      </div>

      <div className="sticky top-0 z-30 bg-gray-50/95 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-3 overflow-x-auto py-4 px-4 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border shadow-sm ${
                selectedCategory === "all"
                  ? "bg-black text-white border-black shadow-lg shadow-gray-400/50 transform scale-105 ring-2 ring-offset-1 ring-black/10" // เพิ่ม ring เพื่อกันขอบตัด
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
              }`}
            >
              สินค้าทั้งหมด
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border shadow-sm ${
                  selectedCategory === cat.id
                     ? "bg-black text-white border-black shadow-lg shadow-gray-400/50 transform scale-105 ring-2 ring-offset-1 ring-black/10"
                     : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                {cat.name}
              </button>
            ))}
            <div className="w-2 shrink-0"></div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        {loading ? (
          <div className="text-center py-20 text-gray-400 animate-pulse">Loading products...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            
            {products.length > 0 ? (
              products.map((product) => (
                <div 
                  key={product.id} 
                  className="group bg-white rounded-2xl p-3 shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 cursor-pointer"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-gray-100 mb-3">
                    {product.image_url ? (
                      <img
                        src={`${API_BASE_URL}${product.image_url}`}
                        alt={product.name}
                        className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-300">
                         <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-gray-900">
                        ฿{product.price} 
                      </p>
                      <button  
                          onClick={(e) => {e.stopPropagation(); handleAddProductToCart(product); }} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400">
                <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                <p>No products found in this category</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;