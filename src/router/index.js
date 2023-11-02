import React from 'react'
import {
    createBrowserRouter,
    RouterProvider,
    Route,
    Link,
    Routes,
  } from "react-router-dom";
import Layout from '../views/layout/Layout';
import Login from '../views/login/Login';
import Home from '../views/layout/home/Home';
import UserList from '../views/layout/user/UserList';
import RoleList from '../views/layout/role/RoleList';
import Permission from '../views/layout/role/Permission';
import NotFound from '../views/404/NotFound';
  
const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      // 重定向到home

      children: [
        {
          path: "/home",
          element: <Home />, 
        },
        {
          path: "/user",
          children:[
            {
              path:'/user/userList',
              element:<UserList/>
            }
          ]
        },
        {
          path: "/role",
          children:[
            {
              path:'/role/roleList',
              element:<RoleList/>
            },
            {
              path:'/role/permission',
              element:<Permission/>
            }
          ]
        },
      ],
    },
    {
        path:'login',
        element:<Login/>,
    },
    {
        path:'*',
        element:<NotFound/>,
    }
  ]);
export default function Router() {
  return (
    
    <RouterProvider router={router} />
  )
}
