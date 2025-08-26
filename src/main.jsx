import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { CartProvider } from './CartContext.jsx'; 

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Header from './Componets/Navbar.jsx';
import App from './App.jsx';
import RegisterPage from './Componets/Account/Register.jsx';
import Menus from './Componets/Menu.jsx';
import CartPage from './CartPage.jsx';
import CheckoutPage from './CheckoutPage.jsx';
import Login from "../src/Componets/Account/Login";
import AboutContact from './Componets/About.jsx';
import Contact from './Componets/Contact.jsx';
import OrderSuccessPage from "./OrderSucess";
import OrderWaiting from './OrderWaiting.jsx';
import OrderSuccess from './OrderSucess';
import AdminDashboard from './Componets/AdminPanle/AdminDashbord.jsx';
import OrderHistory from './OrderHistory.jsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <BrowserRouter>
      <QueryClientProvider client={queryClient}>
         <Header />
           <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/menu" element={<Menus />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage/>} />
            <Route path="/order-success" element={<OrderSuccessPage/>} />
            <Route path="/about" element={<AboutContact/>} />
            <Route path="/contact" element={<Contact/>} />
             <Route path="/order-waiting" element={<OrderWaiting/>} />
             <Route path="/order-sucess" element={<OrderSuccess/>} />
             <Route path="/orders" element={<OrderHistory/>} />
             <Route path="/admin" element={<AdminDashboard/>} />
            
          </Routes>
    <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </BrowserRouter>
    </CartProvider>
  </StrictMode>
);
