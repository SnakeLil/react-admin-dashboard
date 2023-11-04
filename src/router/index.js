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
import { BiHomeAlt2,BiUser,BiSolidUserDetail,BiLock,BiUserPin } from 'react-icons/bi'
import { FiUsers } from 'react-icons/fi'
export const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      // 重定向到home
      
      children: [
        {
          path: "/home",
          name:'首页',
          icon:BiHomeAlt2,
          element: <Home />, 
        },
        {
          path: "/user",
          name:'用户管理',
          icon:BiUser,
          children:[
            {
              name:'用户列表',
              path:'/user/userList',
              icon:FiUsers,
              element:<UserList/>
            }
          ]
        },
        {
          path: "/role",
          name:'角色管理',
          icon:BiUserPin,
          children:[
            {
              name:'角色列表',
              path:'/role/roleList',
              icon:BiSolidUserDetail,
              element:<RoleList/>
            },
            {
              name:'权限列表',
              path:'/role/permission',
              icon:BiLock,
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
export default function Router({children}) {
  return (
    
    <RouterProvider router={router} >
      {children}
    </RouterProvider>
  )
}
