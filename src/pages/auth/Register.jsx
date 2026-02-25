import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
        Swal.fire({
            icon: 'error',
            title: 'รหัสผ่านไม่ตรงกัน',
            text: 'กรุณาตรวจสอบให้แน่ใจว่ารหัสผ่านและยืนยันรหัสผ่านตรงกัน',
        });
        return; 
    }

    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });
        
        const data = await response.json();

        if (response.ok && data.success) {
            Swal.fire({
                icon: 'success', 
                title: 'สมัครสมาชิกสำเร็จ!',
                text: data.message || "คุณสามารถเข้าสู่ระบบได้แล้ว.",
                showConfirmButton: false, 
                timer: 2000 
            }).then(() => {
                navigate('/login'); 
            });

        } else {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด!',
                text: data.message || "การลงทะเบียนไม่สำเร็จ",
            });
        }

    } catch (error) {
        console.error("Network error:", error);
        Swal.fire({
            icon: 'error',
            title: 'การเชื่อมต่อล้มเหลว',
            text: 'Network error or server unavailable.',
        });
    }
};

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-100'>
            <form onSubmit={handleSubmit} className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md'>
                <h2 className='text-2xl font-bold mb-6 text-center'>สร้างบัญชีผู้ใช้ใหม่</h2>

                {/* Name Field */}
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2'>Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700' required />
                </div>

                {/* Email Field */}
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2'>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700' required />
                </div>

                {/* Password Field */}
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2'>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700' required />
                </div>

                {/* Confirm Password Field */}
                <div className='mb-6'>
                    <label className='block text-gray-700 text-sm font-bold mb-2'>Confirm Password:</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700' required />
                </div>
                
                <button type="submit" className='w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
                    Register
                </button>
                
                <div className='text-center mt-4'>
                    <Link to="/login" className='text-sm text-blue-500 hover:text-blue-800'>
                        มีบัญชีอยู่แล้วใช่ไหม? เข้าสู่ระบบที่นี่
                    </Link>
                </div>
            </form>
        </div>
    )
}

export default Register;