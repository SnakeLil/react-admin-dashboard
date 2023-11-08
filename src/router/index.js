import React from 'react'
import {
    createBrowserRouter,
    RouterProvider,
    Route,
    Link,
    Routes,
    Navigate ,
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
import Brand from '../views/layout/product/brand/Brand'
import Spu from '../views/layout/product/spu/Spu'
import Sku from '../views/layout/product/sku/Sku'
import {ProfileOutlined,BoldOutlined,PartitionOutlined,ReconciliationOutlined,TagsFilled} from '@ant-design/icons'
import Attr from '../views/layout/product/attr/Attr';
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
          // element:<Navigate to="/role/roleList" />,
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
        {
          path:'/product',
          name:'商品管理',
          icon:ProfileOutlined,
          // element:<Navigate to="/product/attr"/>,

          children:[
            {
              name:'属性管理',
              path:'/product/attr',
              icon:TagsFilled,
              element:<Attr/>
            },
            {
              name:'品牌管理',
              path:'/product/brand',
              icon:BoldOutlined,
              element:<Brand/>
            },
            {
              name:'spu管理',
              path:'/product/spu',
              icon:PartitionOutlined,
              element:<Spu/>
            },
            {
              name:'sku管理',
              path:'/product/sku',
              icon:ReconciliationOutlined,
              element:<Sku/>
            }
          ]
        }
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
