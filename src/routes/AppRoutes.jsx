import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';

// Pages
import Dashboard from '../pages/admin/Dashboard';
import ProductsManagement from '../pages/admin/ProductsManagement'
import UserManagement from '../pages/admin/UserManagement'
import CategoriesManagement from '../pages/admin/CategoriesManagement'
import OrderDetails from '../pages/admin/OrderDetails'
import OrdersList from '../pages/admin/OrdersList'
import Location from '../pages/admin/Location.jsx'
import Home from '../pages/client/Home.jsx';
import Cart from '../pages/client/Cart.jsx';

// Layout
import SideBarAdmin from '../Layout/Admin/SideBarAdmin';
import SideBarClient from '../Layout/client/SideBarClient.jsx';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

import PrivateRoute from '../routes/PrivateRoute';


const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />, 
  },

  {
    path: '/register', 
    element: <Register />, 
  },

  {
    path: '/',
    element: <Navigate to="/admin" />,
  },

  {
    element: <PrivateRoute />, 
    children: [
        {
            path: '/admin',
            element: <SideBarAdmin />,
            children: [
              { index: true, element: <Dashboard /> },
              { path: 'UserManagement', element: <UserManagement /> },
              { path: 'CategoriesManagement', element: <CategoriesManagement /> },
              { path: 'OrdersList', element: <OrdersList /> },
              { path: 'orderdetails/:id', element: <OrderDetails /> },
              { path: 'ProductsManagement', element: <ProductsManagement /> },
              { path: 'location', element: <Location /> },
            ],
        },
    ],
  },

  {
    path: '/location/:locationId',
    element: <SideBarClient />,
    children: [
      { index: true, element: <Home /> },
      { path: 'cart', element: <Cart /> },
    ],
  },
]);


export default router;