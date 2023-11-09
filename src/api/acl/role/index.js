// 统一管里项目用户相关的接口

import request from '../../../utils/request'

//请求地址，（定义常量）
const API =  {
    // 角色列表
    getRoleList: '/admin/acl/role/',
    // 新增角色
    addRole:  '/admin/acl/role/save',
    // 修改角色
    updateRole:  '/admin/acl/role/update',
    // 根据角色获取权限
    getRoleMenu:  '/admin/acl/permission/toAssign/',
    // 分配角色菜单权限
    assignRoleMenu:  '/admin/acl/permission/doAssign',
    // 删除角色
    deleteRole:  '/admin/acl/role/remove/',
}
// 暴露请求函数
// 获取所有角色列表
export const getRoleList = (page,limit,roleName) => request.get(API.getRoleList+`${page}/${limit}/?roleName=${roleName}`)

// 新增角色
export const addOrUpdateRole = (role) => {
    if(!role.id) {
        // 没有id，添加
        return request.post(API.addRole,role)
    }else {
        // 携带id，修改
        return request.put(API.updateRole,role)
    }
}
// 根据角色获取菜单
export const getRoleMenu = (id) => request.get(API.getRoleMenu+id)

// 分配角色菜单权限
export const assignRoleMenu = (roleId,permissionIds) => {
    return request.post(API.assignRoleMenu+`?roleId=${roleId}&permissionId=${permissionIds}`)
}
// 删除角色
export const deleteRoleReq = (id) => request.delete(API.deleteRole+id)