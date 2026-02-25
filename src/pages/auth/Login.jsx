import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { useAuth } from '../../context/AuthContext';
import Logo from '../../assets/Logo.png';
import Swal from 'sweetalert2'; 

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/admin', { replace: true }); 
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const result = await login(email, password);
            
            if (!result.success) {
                Swal.fire({
                    icon: 'error',
                    title: 'เข้าสู่ระบบไม่สำเร็จ',
                    text: result.message || "Invalid email or password.",
                });
            }
            
        } catch (error) {
            console.error("Login error:", error);
             Swal.fire({
                icon: 'error',
                title: 'การเชื่อมต่อล้มเหลว',
                text: 'Network error or server unavailable.',
            });
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
            <form onSubmit={handleSubmit} className='w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-lg border border-gray-100'>
                <div className='flex justify-center mb-4'>
                    <img src={Logo} alt="Admin Logo"  className='h-40 w-auto '/>
                </div>
                
                <h2 className='text-2xl font-bold text-center text-gray-800'>
                    Admin Login
                </h2>

                <div>
                    <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-1'>
                        Email Address
                    </label>
                    <input 
                        id="email"
                        name="email"
                        type="email" 
                        autoComplete="email"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-indigo-500 sm:text-sm transition duration-150 ease-in-out' 
                        required 
                    />
                </div>

                <div>
                    <label htmlFor="password" className='block text-sm font-medium text-gray-700 mb-1'>
                        Password
                    </label>
                    <input 
                        id="password"
                        name="password"
                        type="password" 
                        autoComplete="current-password"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-indigo-500 sm:text-sm transition duration-150 ease-in-out' 
                        required 
                    />
                </div>

                <div className='mt-4 text-center'>
                    <p className="text-sm">
                        หากยังไม่มีบัญชีผู้ใช้
                        <Link to="/register" className='font-medium text-indigo-600 hover:text-indigo-500 ml-1'>
                            Register Now
                        </Link>
                    </p>
                </div>

                <button 
                    type="submit"
                    className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out'
                >
                    Login
                </button>
            </form>
        </div>
    )
}

export default Login;