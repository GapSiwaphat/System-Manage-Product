import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Package, User, MapPin, CreditCard, ArrowLeft } from 'lucide-react';

const OrderDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // ดึงข้อมูล
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const itemsRes = await axios.get(`http://localhost:3000/orders/${id}/items`);
        if (itemsRes.data.success) {
          setItems(itemsRes.data.data);
        }

        try {
           const orderRes = await axios.get(`http://localhost:3000/orders/${id}`);
           if (orderRes.data.success) {
             setOrder(orderRes.data.data); 
           }
        } catch (err) {
           console.log("Fetching specific order failed...", err);
           const allOrdersRes = await axios.get(`http://localhost:3000/orders`);
           if (allOrdersRes.data.success) {
             const foundOrder = allOrdersRes.data.data.find(o => o.id.toString() === id);
             setOrder(foundOrder);
           }
        }

      } catch (err) {
        console.error("Error fetching details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);


  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      const res = await axios.put(`http://localhost:3000/orders/${id}`, {
        status: newStatus
      });

      if (res.data.success) {
        setOrder(prev => ({ ...prev, status: newStatus }));
       Swal.fire({
            icon: 'success',
            title: 'อัปเดตสถานะเรียบร้อย!',
            text: `คำสั่งซื้อได้รับการเปลี่ยนสถานะเป็น "${newStatus}" แล้ว`,
            confirmButtonText: 'ตกลง',
            timer: 2000, 
            timerProgressBar: true,
        });
      }
    } catch (err) {
      console.error("Error updating status:", err);
      Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถอัปเดตสถานะได้ กรุณาลองใหม่อีกครั้ง',
          confirmButtonText: 'ตกลง'
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleGeneratePdf = async () => {
    try {
      Swal.fire({
        title: 'กำลังสร้างใบเสร็จ...',
        text: 'โปรดรอสักครู่',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      const res = await axios.get(`http://localhost:3000/orders/${id}/generate-pdf`, {
        responseType: 'blob', 
      });
      
      Swal.close();

      const fileBlob = new Blob([res.data], { type: 'application/pdf' });
      const fileUrl = window.URL.createObjectURL(fileBlob);
      
      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', `Invoice_Order_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(fileUrl); 

      Swal.fire('สำเร็จ!', 'ดาวน์โหลดใบเสร็จเรียบร้อยแล้ว', 'success');

    } catch (err) {
      console.error("Error generating PDF:", err);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถสร้างใบเสร็จ PDF ได้',
      });
    }
  };


  // สีสถานะ
  const getStatusColor = (status) => {
    switch (status) {
        case 'ชำระเงินเรียบร้อย': return 'bg-green-100 text-green-700 border-green-200';
        case 'ยังไม่ชำระ': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">กำลังโหลดข้อมูล...</div>;
  if (!order) return <div className="p-10 text-center text-red-500">ไม่พบข้อมูลคำสั่งซื้อ ID: {id}</div>;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => navigate('/admin/OrdersList')} 
          className="mb-6 flex items-center gap-2 px-4 py-2 rounded-lg text-gray-500 transition-all duration-200 
                     hover:bg-white hover:text-blue-600 hover:shadow-md"
        >
          <ArrowLeft size={20} /> กลับไปหน้ารายการ
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 mt-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              Order #{id}
            </h1>
            <p className="text-gray-500 mt-1">สั่งซื้อเมื่อ: {new Date(order.created_at).toLocaleDateString('th-TH')}</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Select สถานะ */}
            <span className="text-sm text-gray-500 font-medium">สถานะ:</span>
            <div className="relative">
                <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={updating}
                    className={`appearance-none cursor-pointer pl-4 pr-10 py-2 rounded-full text-sm font-bold border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors
                        ${getStatusColor(order.status)}`}
                >
                    <option value="ยังไม่ชำระ">ยังไม่ชำระ</option>
                    <option value="ชำระเงินเรียบร้อย">ชำระเงินเรียบร้อย</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd" />
                    </svg>
                </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="font-semibold text-gray-700 flex items-center gap-2">
                  <Package size={20} className="text-blue-600" /> รายการสินค้า ({items.length})
                </h2>
              </div>
              <table className="min-w-full text-left">
                <thead className="bg-white text-gray-500 text-xs uppercase font-medium">
                  <tr>
                    <th className="px-6 py-3">สินค้า</th>
                    <th className="px-6 py-3 text-center">ราคา</th>
                    <th className="px-6 py-3 text-center">จำนวน</th>
                    <th className="px-6 py-3 text-right">รวม</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                         {item.image_url ? (
                             <img 
                                src={`http://localhost:3000${item.image_url}`} 
                                alt="" 
                                className="w-12 h-12 rounded-lg object-cover border border-gray-200" 
                             />
                         ) : (
                             <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                <Package size={20} />
                             </div>
                         )}
                         {item.product_name || item.name}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-600">฿{item.price}</td>
                      <td className="px-6 py-4 text-center text-gray-600">x {item.quantity}</td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">
                        ฿{(item.price * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-4 items-center">
                 <span className="text-gray-600">ยอดรวมสินค้า</span>
                 <span className="text-xl font-bold text-blue-600">฿{order.total_price}</span>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User size={20} className="text-gray-500" /> ข้อมูลลูกค้า
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs uppercase">ชื่อลูกค้า</p>
                  <p className="font-medium text-gray-900">{order.customer_name}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase">เบอร์โทรศัพท์</p>
                  <p className="font-medium text-gray-900">{order.customer_phone || '-'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-gray-500" /> ที่อยู่จัดส่ง
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {order.address || "ไม่ระบุที่อยู่จัดส่ง"}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard size={20} className="text-gray-500" /> การชำระเงิน
              </h3>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">วิธีชำระเงิน:</span>
                <span className="font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded">
                  {order.payment_method}
                </span>
              </div>
            </div>
            <div>
              <button
                  onClick={handleGeneratePdf}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold transition hover:bg-blue-700 shadow-md"
                  disabled={loading || updating}
              >
                  พิมพ์ใบเสร็จชำระเงิน
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetails;