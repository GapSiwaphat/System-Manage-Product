import React, { useState, useEffect } from 'react';
import Logo from '../../assets/Logo.png';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaHome, 
  FaUsers, 
  FaList, 
  FaBoxOpen, 
  FaShoppingCart, 
  FaChartLine, 
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaStore,
  FaChevronLeft,
  FaChevronRight,
  FaCrosshairs
} from 'react-icons/fa';

const SoftGraySidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = (e) => {
    e.preventDefault(); 
    logout(); 
    closeMobileMenu(); 
    navigate('/login', { replace: true }); 
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const menuItems = [
    { 
      name: 'Dashboard', 
      path: '/', 
      icon: <FaHome />, 
      color: 'text-slate-700',
      bgColor: 'bg-slate-100',
      hoverColor: 'hover:bg-slate-200',
      activeColor: 'bg-slate-200 border-slate-300'
    },
    { 
      name: 'Users Management', 
      path: '/admin/UserManagement', 
      icon: <FaUsers />, 
      color: 'text-slate-700',
      bgColor: 'bg-slate-100',
      hoverColor: 'hover:bg-slate-200',
      activeColor: 'bg-slate-200 border-slate-300'
    },
    { 
      name: 'CategoriesManagement', 
      path: '/admin/CategoriesManagement', 
      icon: <FaList />, 
      color: 'text-slate-700',
      bgColor: 'bg-slate-100',
      hoverColor: 'hover:bg-slate-200',
      activeColor: 'bg-slate-200 border-slate-300'
    },
    { 
      name: 'ProductsManagement', 
      path: '/admin/ProductsManagement', 
      icon: <FaBoxOpen />, 
      color: 'text-slate-700',
      bgColor: 'bg-slate-100',
      hoverColor: 'hover:bg-slate-200',
      activeColor: 'bg-slate-200 border-slate-300'
    },
    { 
      name: 'Orders', 
      path: '/admin/OrdersList', 
      icon: <FaShoppingCart />, 
      color: 'text-slate-700',
      bgColor: 'bg-slate-100',
      hoverColor: 'hover:bg-slate-200',
      activeColor: 'bg-slate-200 border-slate-300'
    },
    { 
      name: 'Location Management', 
      path: '/admin/location', 
      icon: <FaCrosshairs />, 
      color: 'text-slate-700',
      bgColor: 'bg-slate-100',
      hoverColor: 'hover:bg-slate-200',
      activeColor: 'bg-slate-200 border-slate-300'
    },
  ];

  const logoutItem = { 
    name: 'Logout', 
    path: '/logout', 
    icon: <FaSignOutAlt />, 
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    hoverColor: 'hover:bg-red-100',
    activeColor: 'bg-red-100 border-red-200'
  };

  const closeMobileMenu = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-3 bg-slate-50 text-slate-700 rounded-2xl shadow-lg hover:bg-slate-100 transition-all duration-200 border border-slate-200"
          >
            <FaBars className="text-lg" />
          </button>
        </div>
      )}

      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/30 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div className="flex min-h-screen bg-slate-50">
        {/* Sidebar */}
        <div className={`
          ${isMobile 
            ? `fixed top-0 left-0 z-50 h-full transition-transform duration-300 ${
                isMobileOpen ? 'translate-x-0' : '-translate-x-full'
              }`
            : 'relative'
          }
          ${isCollapsed && !isMobile ? 'w-20' : 'w-72'} 
          ${isMobile ? 'w-72' : ''}
          transition-all duration-300 ease-in-out 
          bg-slate-100 border-r border-slate-200
          text-slate-700 flex flex-col shadow-xl
        `}>
          
          {/* Header */}
          <div className="p-6 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br rounded-2xl flex items-center justify-center ">
                  <img src={Logo} alt="" />
                </div>
                {(!isCollapsed || isMobile) && (
                  <div>
                    <h1 className="text-xl font-bold text-slate-800">
                      Better View
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">Admin Panel</p>
                  </div>
                )}
              </div>
              
              {/* Desktop Toggle Button */}
              {!isMobile && (
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="p-2 rounded-xl hover:bg-slate-200 transition-all duration-200 text-slate-500 hover:text-slate-700"
                >
                  {isCollapsed ? 
                    <FaChevronRight className="text-lg" /> : 
                    <FaChevronLeft className="text-lg" />
                  }
                </button>
              )}
              
              {/* Mobile Close Button */}
              {isMobile && (
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-xl hover:bg-slate-200 transition-colors duration-200 text-slate-500"
                >
                  <FaTimes className="text-lg" />
                </button>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto minimal-sidebar-nav">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={`
                    minimal-menu-item group relative flex items-center gap-4 p-4 rounded-2xl 
                    transition-all duration-200 border border-transparent
                    ${isActive 
                      ? `${item.activeColor} ${item.color} soft-shadow` 
                      : `text-slate-600 ${item.hoverColor} hover:text-slate-800`
                    }
                  `}
                >
                  {/* Icon Container */}
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-xl 
                    transition-all duration-200 icon-hover-rotate
                    ${isActive 
                      ? `${item.bgColor} ${item.color}` 
                      : 'text-slate-500 group-hover:text-slate-700 group-hover:bg-slate-200'
                    }
                  `}>
                    {item.icon}
                  </div>
                  
                  {/* Text */}
                  {(!isCollapsed || isMobile) && (
                    <div className="flex-1">
                      <span className="font-medium text-sm">
                        {item.name}
                      </span>
                    </div>
                  )}

                  {/* Active indicator */}
                  {isActive && (
                    <div className="w-3 h-3 bg-slate-600 rounded-full gentle-pulse" />
                  )}

                  {/* Tooltip for collapsed desktop state */}
                  {isCollapsed && !isMobile && (
                    <div className="absolute left-full ml-4 px-4 py-2 bg-slate-800 text-white text-sm rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50">
                      {item.name}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 w-3 h-3 bg-slate-800 rotate-45" />
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Section */}
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <div className={`flex items-center gap-3 p-4 rounded-2xl bg-slate-200 ${(!isCollapsed || isMobile) ? '' : 'justify-center'}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              {(!isCollapsed || isMobile) && (
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">Admin User</p>
                  <p className="text-xs text-slate-600">admin@mystore.com</p>
                </div>
              )}
            </div>
          </div>

          {/* Logout Button */}
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <a 
              href="#" 
              onClick={handleLogout}
              className="group relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 text-slate-600 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-100"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl text-slate-500 group-hover:text-red-600 transition-all duration-200 icon-hover-rotate">
                {logoutItem.icon}
              </div>
              
              {(!isCollapsed || isMobile) && (
                <span className="font-medium text-sm group-hover:text-red-600 transition-colors duration-200">
                  {logoutItem.name}
                </span>
              )}

              {/* Tooltip for collapsed desktop state */}
              {isCollapsed && !isMobile && (
                <div className="absolute left-full ml-4 px-4 py-2 bg-slate-800 text-white text-sm rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50">
                  {logoutItem.name}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 w-3 h-3 bg-slate-800 rotate-45" />
                </div>
              )}
            </a>
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 bg-white min-h-screen transition-all duration-300 ${isMobile && isMobileOpen ? 'blur-sm' : ''}`}>
          <div className={`p-8 ${isMobile ? 'pt-20' : ''}`}>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default SoftGraySidebar;