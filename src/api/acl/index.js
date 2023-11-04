// 统一管里项目用户相关的接口

import request from '../../utils/request'

//请求地址，（定义常量）
const API =  {
    ALL_USER: '/admin/acl/user/',
    // 新增用户
    ADD_USER: '/admin/acl/user/save',
     // 修改用户
     UPDATE_USER: '/admin/acl/user/update',
     // 获取所有角色
     All_ROLES: '/admin/acl/user/toAssign/',
     // 根据用户分配角色
     ASSIGN_ROLES: '/admin/acl/user/doAssignRole',
     // 删除某个账户
     DELETE_USER: '/admin/acl/user/remove/',
     // 批量删除用户
     DELETE_BATCH_USER: '/admin/acl/user/batchRemove',
}
// 暴露请求函数
// 获取全部用户信息列表（分页）
export const getAllUser = (page,limit,username) => {
    return request.get(API.ALL_USER+`${page}/${limit}/?username=${username}`)
}
// 新增用户
export const addOrUpdateUser = (user) => {
    if(user.id) {
        // 修改
        return request.put(API.UPDATE_USER,user)
    }else {
        return request.post(API.ADD_USER,user)
    }
}
// 获取所有角色信息
export const getAllRoles = (adminId) => {
    return request.get(API.All_ROLES+adminId)
}
 // 根据用户分配角色
 export const assignRoles = (setRoleData) => {
    return request.post(API.ASSIGN_ROLES,setRoleData)
 }
 // 删除某个账户
 export const deleteUser = (id) => {
    return request.delete(API.DELETE_USER+id)
 }
//  批量删除用户
export const deleteBatchUser = (ids) => {
    return request.delete(API.DELETE_BATCH_USER,{data:ids})
}