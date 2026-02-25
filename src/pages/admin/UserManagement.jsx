import React, { useEffect, useState } from "react";
import { FaEdit, FaSave, FaTimes, FaTrash, FaInfoCircle, FaUser, FaEnvelope, FaUserTag } from "react-icons/fa";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [editData, setEditData] = useState({ name: "", email: "", role: "" });
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "" });

  // ดึงข้อมูลผู้ใช้
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/users");
      if (res.data.success && Array.isArray(res.data.data)) {
        setUsers(res.data.data);
      } else {
        console.error("Invalid users data format");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // กดแก้ไข
  const handleEdit = (user) => {
    setEditRowId(user.id);
    setEditData({ name: user.name, email: user.email, role: user.role });
  };

  // เปลี่ยนค่าในช่อง input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // ยกเลิกแก้ไข
  const handleCancel = () => {
    setEditRowId(null);
    setEditData({ name: "", email: "", role: "" });
  };

  // บันทึกการแก้ไข
  const handleSave = async (id) => {
    try {
      const res = await axios.put(`http://localhost:3000/users/${id}`, editData);
      if (res.status === 200) {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === id ? { ...user, ...editData } : user
          )
        );
        setEditRowId(null);
      }
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  // ลบผู้ใช้
  const handleDelete = async (id) => {
    if (!window.confirm("คุณต้องการลบผู้ใช้นี้หรือไม่?")) return;
    try {
      const res = await axios.delete(`http://localhost:3000/users/${id}`);
      if (res.status === 200) {
        setUsers((prev) => prev.filter((user) => user.id !== id));
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // เปิด popup เพิ่มผู้ใช้
  const handleAddUser = () => setShowAddPopup(true);

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleClosePopup = () => {
    setShowAddPopup(false);
    setNewUser({ name: "", email: "", role: "" });
  };

  const handleAddSave = async () => {
    try {
      const res = await axios.post("http://localhost:3000/users", newUser);
      if (res.status === 200) {
        setUsers((prev) => [...prev, res.data.user]);
        handleClosePopup();
      }
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 min-h-screen">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 mb-6">
        <FaInfoCircle className="text-blue-500 text-lg mt-0.5 flex-shrink-0" />
        <div className="text-blue-800 text-sm">
          <p className="font-medium mb-1">ข้อมูลที่จำเป็น:</p>
          <p>ตรวจสอบชื่อ อีเมล และบทบาทผู้ใช้ให้ถูกต้องก่อนบันทึก</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">จัดการผู้ใช้งาน</h1>
        <button
          className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out flex justify-center items-center gap-2"
          onClick={handleAddUser}
        >
          <span>+</span> เพิ่มผู้ใช้ใหม่
        </button>
      </div>

      {showAddPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClosePopup}
          ></div>
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10 animate-fade-in-up">
            <button
              onClick={handleClosePopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1"
            >
              <FaTimes size={16} />
            </button>

            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
              เพิ่มผู้ใช้ใหม่
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้ใช้</label>
                <input
                  type="text"
                  name="name"
                  value={newUser.name}
                  onChange={handleAddChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="ระบุชื่อ"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleAddChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">บทบาท</label>
                <input
                  type="text"
                  name="role"
                  value={newUser.role}
                  onChange={handleAddChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="admin / user"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleClosePopup}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleAddSave}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg shadow transition-colors"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="hidden md:block bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
        <table className="min-w-full leading-normal">
          <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">No</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                  
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {editRowId === user.id ? (
                      <input type="text" name="name" value={editData.name} onChange={handleChange} className="border border-blue-300 px-2 py-1 rounded w-full outline-none focus:ring-1 focus:ring-blue-500" />
                    ) : user.name}
                  </td>
                  
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {editRowId === user.id ? (
                      <input type="email" name="email" value={editData.email} onChange={handleChange} className="border border-blue-300 px-2 py-1 rounded w-full outline-none focus:ring-1 focus:ring-blue-500" />
                    ) : user.email}
                  </td>
                  
                  <td className="px-6 py-4 text-sm">
                    {editRowId === user.id ? (
                      <input type="text" name="role" value={editData.role} onChange={handleChange} className="border border-blue-300 px-2 py-1 rounded w-24 outline-none focus:ring-1 focus:ring-blue-500" />
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                        {user.role}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-sm text-center">
                    <div className="flex justify-center items-center gap-3">
                      {editRowId === user.id ? (
                        <>
                          <button onClick={() => handleSave(user.id)} className="text-green-600 hover:bg-green-100 p-2 rounded-full transition"><FaSave /></button>
                          <button onClick={handleCancel} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition"><FaTimes /></button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(user)} className="text-blue-600 hover:bg-blue-100 p-2 rounded-full transition"><FaEdit /></button>
                          <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:bg-red-100 p-2 rounded-full transition"><FaTrash /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">ไม่พบข้อมูลผู้ใช้</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4 pb-20">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 relative">
              
              {editRowId === user.id ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-blue-600">แก้ไขข้อมูล</h3>
                    <button onClick={handleCancel} className="text-gray-400"><FaTimes /></button>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">ชื่อ</label>
                    <input type="text" name="name" value={editData.name} onChange={handleChange} className="w-full border rounded-lg p-2 mt-1 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">อีเมล</label>
                    <input type="email" name="email" value={editData.email} onChange={handleChange} className="w-full border rounded-lg p-2 mt-1 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">บทบาท</label>
                    <input type="text" name="role" value={editData.role} onChange={handleChange} className="w-full border rounded-lg p-2 mt-1 text-sm" />
                  </div>
                  <div className="pt-2">
                     <button onClick={() => handleSave(user.id)} className="w-full bg-green-500 text-white py-2 rounded-lg font-medium shadow-sm">บันทึกการแก้ไข</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <FaUser />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-lg leading-tight">{user.name}</h3>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                {user.role}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex gap-1">
                        <button onClick={() => handleEdit(user)} className="p-2 text-blue-500 bg-blue-50 rounded-lg active:scale-95 transition-transform">
                           <FaEdit size={16} />
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="p-2 text-red-500 bg-red-50 rounded-lg active:scale-95 transition-transform">
                           <FaTrash size={16} />
                        </button>
                    </div>
                  </div>
                  
                  <div className="mt-2 pt-3 border-t border-dashed border-gray-200 flex items-center text-gray-600 text-sm gap-2">
                      <FaEnvelope className="text-gray-400"/>
                      <span className="truncate">{user.email}</span>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-dashed">
            <p>ไม่พบข้อมูลผู้ใช้</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default UserManagement;