import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Inicial from '../src/pages/inicial'
import Login from './pages/login/login'
import Cadastro from './pages/cadastro/cadastro'
import Home from './pages/home/home'

let router = createBrowserRouter([
  {
    path: "/",
    element: <Inicial/>
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/cadastro",
    element: <Cadastro />
  },
  {
    path: "/home",
    element: <Home />
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
