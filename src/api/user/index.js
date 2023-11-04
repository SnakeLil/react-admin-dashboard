// 统一管里项目用户相关的接口

import request from '../../utils/request'

//枚举请求地址，（定义常量）
const API =  {
    LOGIN_URL: '/admin/acl/index/login',
    USERINFO_URL: '/admin/acl/index/info',
    LOGOUT_URL: '/admin/acl/index/logout',
}
// 暴露请求函数
// 登录
export const login = (data) => request.post(API.LOGIN_URL, data)

// 获取用户信息
export const getUserInfo = () => request.get(API.USERINFO_URL) 

// 退出登录i
export const logout = () => request.post(API.LOGOUT_URL)