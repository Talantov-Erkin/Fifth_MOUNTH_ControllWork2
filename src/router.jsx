import { createBrowserRouter } from 'react-router-dom';
import { Spin } from 'antd';
import { productAPI } from './API/api';
import MainLayout from './Layouts/MainLayout';
import ProductsPage from './Pages/Products/ProductsPage';
import ProductPage from './Pages/Product/ProductPage';
import FavoritesPage from './Pages/Favorites/FavoritesPage';
import NotFoundPage from './Pages/NotFound/NotFoundPage';
import ErrorPage from './Pages/Error/ErrorPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    HydrateFallback: () => (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    ),
    children: [
      {
        index: true,
        element: <ProductsPage />,
        loader: () => productAPI.getProducts({ page: 1, limit: 6 }),
      },
      {
        path: 'product/:id',
        element: <ProductPage />,
        loader: ({ params }) => productAPI.getProductById(params.id),
      },
      {
        path: 'favorites',
        element: <FavoritesPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);