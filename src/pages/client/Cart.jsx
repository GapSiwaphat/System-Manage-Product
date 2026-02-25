import React from 'react';
import { useCart } from '../../context/useCart'; 

const API_BASE_URL = "http://localhost:3000"; 

const PlaceholderIcon = (props) => (
  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
);


const Cart = () => {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } = useCart(); 
  console.log("Cart Items Loaded:", cartItems);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => 
        total + (Number(item.price) * Number(item.quantity)), 0
    );
  };

  return (
    <div className="cart-page min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* --- Header --- */}
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
            ตะกร้าสินค้า
            <svg className="w-8 h-8 ml-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-xl shadow-md">
            <p className="text-lg text-gray-500">ไม่มีสินค้าในตะกร้า</p>
            <p className="text-sm text-gray-400 mt-2">เพิ่มสินค้าจากหน้าหลักเพื่อเริ่มต้น</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 items-center"
                >
                  
                  {/* ส่วนแสดงรูปภาพ  */}
                  <div className="w-20 h-20 shrink-0 mr-4 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
                    {item.image_url ? (
                      <img 
                        src={`${API_BASE_URL}${item.image_url}`} 
                        alt={item.name} 
                        // className="w-full h-full object-cover"
                      />
                    ) : (
                      <PlaceholderIcon /> 
                    )}
                  </div>

                  <div className="flex-grow">
                    <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      ราคาต่อชิ้น: ฿{Number(item.price).toFixed(2)}
                    </p>
                    
                    <div className="flex items-center space-x-2 mt-2">
                        <button
                            onClick={() => decreaseQuantity(item.id)}
                            className="w-7 h-7 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors flex items-center justify-center text-xl pb-1"
                        >
                            -
                        </button>
                        <span className="font-medium text-gray-800 w-4 text-center">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => increaseQuantity(item.id)}
                            className="w-7 h-7 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors flex items-center justify-center text-xl pb-1"
                        >
                            +
                        </button>
                    </div>

                  </div>
                
                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <span className="font-extrabold text-xl text-black">
                      ฿{(Number(item.price) * Number(item.quantity)).toFixed(2)}
                    </span>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:bg-red-50 hover:text-red-800 p-2 rounded-lg transition-all duration-200 text-sm font-medium"
                    >
                      <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      ลบ
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary*/}
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg h-fit sticky top-6">
              <h2 className="text-xl font-bold mb-4 border-b pb-2">สรุปคำสั่งซื้อ</h2>
              
              <div className="flex justify-between text-gray-600 mb-2">
                <span>ราคาสินค้ารวม:</span>
                <span>฿{calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 mb-4 border-b pb-4">
                <span>ค่าจัดส่ง:</span>
                <span className="text-green-600">ฟรี</span>
              </div>

              <div className="flex justify-between font-extrabold text-2xl text-gray-900 mt-4">
                <span>รวมทั้งหมด:</span>
                <span>฿{calculateTotal().toFixed(2)}</span>
              </div>

              <button 
                className="w-full bg-green-600 text-white py-3 rounded-lg text-xl font-bold hover:bg-green-700 transition-colors mt-6"
              >
                ดำเนินการชำระเงิน
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;