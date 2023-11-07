// 统一管里项目用户相关的接口

import axios from 'axios';
import request from '../../../utils/request'

//枚举请求地址，（定义常量）
const API =  {
    TRADEMARK_LIST: '/admin/product/baseTrademark/',
    ADD_TRADEMARK: '/admin/product/baseTrademark/save',
    UPDATE_TRADEMARK: '/admin/product/baseTrademark/update',
    DELETE_TRADEMARK: '/admin/product/baseTrademark/remove/',
    UPLOAD_FILE:'/admin/product/fileUpload'
}
// 暴露请求函数
// 接口方法
// page:第几页
// limit：第几个
export const TrandemarkList = (page,limit)=>{
    return request.get(API.TRADEMARK_LIST+`${page}/${limit}`);
}
// 添加或修改
export const AddOrUpdateTrademark = (data)=>{
    if(data.id) {// 修改品牌信息
        return request.put(API.UPDATE_TRADEMARK,data);
    }else {// 添加品牌
        return request.post(API.ADD_TRADEMARK,data);
    }
   
}

// 删除
export const deleteTrandemark = (id)=>{
    return request.delete(API.DELETE_TRADEMARK+id);
}
// 上传文件
export const uploadFile = (file)=>{
    return axios.post('http://8.134.64.19:5173/api/admin/product/fileUpload',file);
}