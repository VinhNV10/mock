import { lazy } from "react";
import { Navigate } from 'react-router-dom';

import AdminLayout from './components/Layout/Amin/AdminLayout';
import HostLayout from "components/Layout/Host/HostLayout";
import GuestLayout from "components/Layout/Guest/GuestLayout";

const ProfileAdmin = lazy(() => import ('./pages/ProfileAdmin'));
const Order = lazy(() => import ('./pages/Order'));
const OrderDetail = lazy(() => import ('./pages/OrderDetail'));
const Product = lazy(() => import ('./pages/Product'));
const AddProduct = lazy(() => import ('./pages/AddProduct'));
const ProductDetail = lazy(() => import ('./pages/ProductDetail'));
const LoginShop = lazy(() => import ('./pages/LoginShop'));
const RegisterShop = lazy(() => import ('./pages/RegisterShop'));

const ShopHost = lazy(() => import ('./pages/ShopHost'));
const Tracking = lazy(() => import ('./pages/Tracking'));
const LoginHost = lazy(() => import ('./pages/LoginHost'));
const RegisterHost = lazy(() => import ('./pages/RegisterHost'));

const ShopGuest = lazy(() => import ('./pages/ShopGuest'));
const LoginGuest = lazy(() => import ('./pages/LoginGuest'));
const RegisterGuest = lazy(() => import ('./pages/RegisterGuest'));

const NotFound = lazy(() => import ('./pages/NotFound'));

const routes = [
  {
    path: '/host/admin',
    element: <AdminLayout />,
    children: [
      { path: 'profile', element: <ProfileAdmin /> },
      { path: 'order', element: <Order /> },
      { path: 'order/:id', element: <OrderDetail /> },
      { path: 'product', element: <Product /> },
      { path: 'product/add', element: <AddProduct /> },
      { path: 'product/:id', element: <ProductDetail /> },
      { path: 'login', element: <LoginShop /> },
      { path: 'register', element: <RegisterShop /> },
      { path: '', element: <Navigate to="/host/admin/product" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/host/shop/:id',
    element: <HostLayout />,
    children: [
      { path: '', element: <ShopHost /> },
      { path: '404', element: <NotFound /> },
      { path: 'login', element: <LoginHost /> },
      { path: 'register', element: <RegisterHost /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/host/cart/:id',
    element: <GuestLayout />,
    children: [
      { path: '', element: <ShopGuest /> },
      { path: '404', element: <NotFound /> },
      { path: 'login', element: <LoginGuest /> },
      { path: 'register', element: <RegisterGuest /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/host/tracking/:id',
    children: [
      { path: '', element: <Tracking /> },
    ]
  },
  {
    path: '/',
    children: [
      { path: '404', element: <NotFound /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
]

export default routes;
