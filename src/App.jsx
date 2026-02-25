import './App.css'
import React from 'react';
import router from './routes/AppRoutes';   
import { RouterProvider } from 'react-router-dom';

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App;
