// 统一管里项目用户相关的接口

import request from '../../../utils/request'

//请求地址，（定义常量）
const API =  {
    //获取全部权限
    getPermissionList: '/admin/acl/permission',
    // 新增菜单
    addPermission: '/admin/acl/permission/save',
    // 修改菜单
    updatePermission: '/admin/acl/permission/update',


    // 删除某个权限菜单
    deletePermission: '/admin/acl/permission/remove/',
}
// 暴露请求函数
//获取全部权限
export const getMenuList = () => {
    return request.get(API.getPermissionList)
}
// 删除某个权限菜单
export const deletePermission = (id) => {
    return request.delete(API.deletePermission + id)
}
// 新增菜单/修改
export const addOrUpdatePermission = (data) => {
    if(data.id) {
        // 修改
        return request.put(API.updatePermission,data)
    }else {
        // 新增
        return request.post(API.addPermission,data)
    }
}