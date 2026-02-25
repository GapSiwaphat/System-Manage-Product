import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  FaWallet, 
  FaShoppingBag, 
  FaBoxOpen, 
  FaExclamationTriangle, 
  FaClipboardList,
  FaChartLine 
} from 'react-icons/fa';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    lowStockCount: 0,
    avgOrderValue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        axios.get('http://localhost:3000/orders'),
        axios.get('http://localhost:3000/products')
      ]);

      const orders = ordersRes.data.data || [];
      const products = productsRes.data.data || [];
      const validOrders = orders.filter(o => o.status.toLowerCase() !== 'cancelled');
      const totalRevenue = validOrders.reduce((sum, order) => sum + parseFloat(order.total_price), 0);
      
      // คำนวณจำนวนออเดอร์
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(o => o.status.toLowerCase() === 'pending').length;
      
      // คำนวณยอดเฉลี่ยต่อบิล
      const avgOrderValue = validOrders.length > 0 ? totalRevenue / validOrders.length : 0;

      // คำนวณสินค้าใกล้หมด
      const lowStockList = products.filter(p => p.quantity < 5);
      
      // ออเดอร์ล่าสุด 5 รายการ
      const recents = orders.slice(0, 5); 

      setStats({
        totalRevenue,
        totalOrders,
        pendingOrders,
        lowStockCount: lowStockList.length,
        avgOrderValue
      });
      setRecentOrders(recents);
      setLowStockItems(lowStockList.slice(0, 5)); 
      setLoading(false);

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setLoading(false);
    }
  };

  // Helper Function สีสถานะ
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-teal-100 text-teal-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8  min-h-screen">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FaChartLine className="text-blue-600"/> ภาพรวมไร่ Better View (Dashboard)
        </h1>
        <p className="text-gray-500 mt-2">สรุปข้อมูลสถิติและการดำเนินงานประจำวัน</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card Revenue */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">ยอดขายสุทธิ (Net Revenue)</p>
              <h3 className="text-2xl font-bold text-gray-800">฿{stats.totalRevenue.toLocaleString()}</h3>
              <p className="text-xs text-green-600 mt-1">+ รวมออเดอร์ที่สำเร็จแล้ว</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg text-green-600">
              <FaWallet size={24} />
            </div>
          </div>
        </div>

        {/* Card Orders */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">คำสั่งซื้อทั้งหมด (Total Orders)</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.totalOrders}</h3>
              <p className="text-xs text-blue-500 mt-1">เฉลี่ย ฿{stats.avgOrderValue.toFixed(0)} / ออเดอร์</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              <FaShoppingBag size={24} />
            </div>
          </div>
        </div>

        {/* Card Pending */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">รอดำเนินการ (Pending)</p>
              <h3 className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</h3>
              <p className="text-xs text-yellow-600 mt-1">ต้องรีบตรวจสอบ</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg text-yellow-600">
              <FaClipboardList size={24} />
            </div>
          </div>
        </div>

         {/* Card Low Stock */}
         <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">สินค้าใกล้หมด (Low Stock)</p>
              <h3 className="text-2xl font-bold text-red-600">{stats.lowStockCount}</h3>
              <p className="text-xs text-red-500 mt-1">สินค้าน้อยกว่า 5 ชิ้น</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg text-red-600">
              <FaExclamationTriangle size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* --- Recent Orders & Low Stock --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
               <FaBoxOpen className="text-blue-500"/> คำสั่งซื้อล่าสุด
            </h3>
            <button className="text-sm text-blue-600 hover:underline">ดูทั้งหมด</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">ลูกค้า</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">ยอดเงิน</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id.toString().padStart(6, '0')}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.customer_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">฿{parseFloat(order.total_price).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                   <tr><td colSpan="4" className="text-center py-8 text-gray-400">ยังไม่มีคำสั่งซื้อ</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* List: Low Stock Alert  */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
           <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
               <FaExclamationTriangle className="text-red-500"/> สินค้าต้องเติมสต็อก
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
             {lowStockItems.map(item => (
               <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                         {item.image_url && <img src={`http://localhost:3000${item.image_url}`} className="w-full h-full object-cover"/>}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 truncate max-w-[150px]">{item.name}</p>
                        <p className="text-xs text-gray-500">ราคา: ฿{item.price}</p>
                      </div>
                  </div>
                  <div className="text-right">
                     <span className={`text-sm font-bold ${item.quantity === 0 ? 'text-red-600' : 'text-yellow-600'}`}>
                        {item.quantity} ชิ้น
                     </span>
                  </div>
               </div>
             ))}
             {lowStockItems.length === 0 && (
                <div className="p-8 text-center text-green-600">
                    <FaCheckCircle className="mx-auto text-3xl mb-2 opacity-50"/>
                    <p className="text-sm">สต็อกสินค้าปกติ</p>
                </div>
             )}
          </div>
          {lowStockItems.length > 0 && (
             <div className="p-4 bg-gray-50 text-center">
               <button className="text-sm text-red-500 hover:text-red-700 font-medium">ดูสินค้าใกล้หมดทั้งหมด</button>
             </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Dashboard