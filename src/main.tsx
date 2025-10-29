import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/layout/Layout.tsx';
import Home from './components/Home.tsx';
import Menu from './components/Menu.tsx';
import About from './components/About.tsx';
import AvisoLegal from './components/AvisoLegal.tsx';


// Define todas tus rutas
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // Layout con Header y Footer se aplica a todas las rutas hijas
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'menu',
        element: <Menu />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'aviso-legal',
        element: <AvisoLegal />,
      }
    ],
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
