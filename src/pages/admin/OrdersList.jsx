import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Eye, Trash2, Search, Filter, Download, ShoppingBag, Clock, CheckCircle, Calendar, User, CreditCard } from 'lucide-react';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const navigate = useNavigate();

  const formatOrderId = (id) => {
    return id.toString().padStart(6, '0');
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:3000/orders");
        if (res.data.success) {
          setOrders(res.data.data);
          setFilteredOrders(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    let result = orders;

    if (statusFilter !== 'All') {
      result = result.filter(order => 
        order.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(order => {
        const formattedId = formatOrderId(order.id); 
        return (
          order.customer_name.toLowerCase().includes(lowerTerm) ||
          order.id.toString().includes(lowerTerm) || 
          formattedId.includes(lowerTerm)            
        );
      });
    }

    setFilteredOrders(result);
  }, [searchTerm, statusFilter, orders]);

  const handleViewDetail = (order) => {
    navigate(`/admin/orderdetails/${order.id}`);
  };

 const handleDelete = async (id) => {
    const result = await Swal.fire({
        title: 'คุณต้องการลบคำสั่งซื้อนี้หรือไม่?',
        text: "ข้อมูลนี้จะไม่สามารถกู้คืนได้!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก'
        
    });

    if (result.isConfirmed) {
        try {
            const res = await axios.delete(`http://localhost:3000/orders/${id}`);
            
            if (res.data.success) {
                setOrders(prev => prev.filter(order => order.id !== id));
                setFilteredOrders(prev => prev.filter(o => o.id !== id));
                Swal.fire('ลบเรียบร้อย!', 'คำสั่งซื้อถูกลบแล้ว', 'success');
            } else {
                Swal.fire('ล้มเหลว!', 'ไม่สามารถลบได้ โปรดตรวจสอบ Server', 'error');
            }
        } catch (err) {
            console.error("Error deleting order:", err);
        }
    }
};

  const getStatusColor = (status) => {
    const s = status ? status.toLowerCase() : '';
    if (s === 'paid') return 'bg-teal-100 text-teal-800';
    if (s === 'pending') return 'bg-yellow-100 text-yellow-800';
    if (s === 'cancelled') return 'bg-red-100 text-red-800';
    if (s === 'completed') return 'bg-green-100 text-green-800';
    if (s === 'shipped') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const totalRevenue = orders.reduce((acc, curr) => acc + parseFloat(curr.total_price || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">จัดการคำสั่งซื้อ</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">ตรวจสอบและจัดการรายการสั่งซื้อทั้งหมด</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Card 1 */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg flex-shrink-0"><ShoppingBag size={24} /></div>
              <div className="min-w-0">
                  <p className="text-xs md:text-sm text-gray-500 truncate">คำสั่งซื้อทั้งหมด</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-800 truncate">{orders.length}</p>
              </div>
          </div>
          {/* Card 2 */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
              <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg flex-shrink-0"><Clock size={24} /></div>
              <div className="min-w-0">
                  <p className="text-xs md:text-sm text-gray-500 truncate">รอดำเนินการ</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-800 truncate">{pendingOrders}</p>
              </div>
          </div>
          {/* Card 3 */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-lg flex-shrink-0"><CheckCircle size={24} /></div>
              <div className="min-w-0">
                  <p className="text-xs md:text-sm text-gray-500 truncate">ยอดขายรวม</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-800 truncate">฿{totalRevenue.toLocaleString()}</p>
              </div>
          </div>
        </div>

        {/* --- Search & Filter --- */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row justify-between gap-4 items-center">
          <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input 
                  type="text" 
                  placeholder="ค้นหาชื่อ หรือ เลข Order..." 
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
          <div className="w-full md:w-auto">
              <div className="relative w-full">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                  <select 
                      className="w-full md:w-auto pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer text-sm font-medium text-gray-700"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                  >
                      <option value="All">ทุกสถานะ</option>
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                  </select>
              </div>
          </div>
        </div>

        <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <table className="min-w-full leading-normal">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order No.</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 text-sm text-gray-900 font-medium">{formatOrderId(order.id)}</td>
                    <td className="px-5 py-4 text-sm text-gray-700">{order.customer_name}</td>
                    <td className="px-5 py-4 text-sm text-gray-700 font-medium">฿{parseFloat(order.total_price).toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700">{order.payment_method}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString('th-TH')}</td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex justify-center items-center gap-3">
                        <button onClick={() => handleViewDetail(order)} className="p-2 rounded-full text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition duration-200" title="ดูรายละเอียด">
                          <Eye size={20} />
                        </button>
                        <button onClick={() => handleDelete(order.id)} className="p-2 rounded-full text-gray-500 hover:bg-red-50 hover:text-red-500 transition duration-200" title="ลบข้อมูล">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-16 text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Search size={48} className="text-gray-300 mb-2" />
                      <p>ไม่พบข้อมูลคำสั่งซื้อ</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="md:hidden space-y-4">
          {filteredOrders.length > 0 ? (
             filteredOrders.map((order) => (
               <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 relative">
                  {/* Card Header: Order ID & Status */}
                  <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-100">
                     <div>
                        <span className="font-bold text-lg text-gray-800">#{formatOrderId(order.id)}</span>
                        <div className="flex items-center text-gray-400 text-xs mt-1 gap-1">
                           <Calendar size={12}/>
                           {new Date(order.created_at).toLocaleDateString('th-TH', { 
                              year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' 
                           })}
                        </div>
                     </div>
                     <span className={`px-2 py-1 text-[10px] font-semibold rounded-full capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                     </span>
                  </div>

                  <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User size={16} className="text-gray-400"/>
                          <span className="font-medium text-gray-700">{order.customer_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CreditCard size={16} className="text-gray-400"/>
                          <span className="capitalize">{order.payment_method}</span>
                      </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                      <div>
                          <p className="text-xs text-gray-500">ยอดรวม</p>
                          <p className="text-lg font-bold text-blue-600">฿{parseFloat(order.total_price).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                          <button 
                            onClick={() => handleViewDetail(order)} 
                            className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium"
                          >
                             <Eye size={16} /> รายละเอียด
                          </button>
                          <button 
                            onClick={() => handleDelete(order.id)} 
                            className="p-2 bg-red-50 text-red-500 rounded-lg"
                          >
                             <Trash2 size={16} />
                          </button>
                      </div>
                  </div>
               </div>
             ))
          ) : (
            <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-gray-200">
                <Search size={40} className="mx-auto mb-2 opacity-30" />
                <p>ไม่พบข้อมูลคำสั่งซื้อ</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default OrdersList;