// 统一管里项目用户相关的接口

import request from '../../../utils/request'

//枚举请求地址，（定义常量）
const API =  {
    ATTR_ONE_LIST: '/admin/product/getCategory1',
    ATTR_TWO_LIST: '/admin/product/getCategory2/',
    ATTR_THREE_LIST: '/admin/product/getCategory3/',
    ADD_UPDATE_ATTR: '/admin/product/saveAttrInfo',
    UPDATE_ATTR: '',
    DELETE_ATTR: '/admin/product/deleteAttr/',
    ATTR_INFO_LIST: '/admin/product/attrInfoList/',
}
// 暴露请求函数
// 获取一级分类列表
export const getAttrOneList = () => request.get(API.ATTR_ONE_LIST);
// 获取二级分类
export const getAttrTwoList = (category1Id) => request.get(API.ATTR_TWO_LIST + category1Id);
// 获取三级分类
export const getAttrThreeList = (category2Id) => request.get(API.ATTR_THREE_LIST + category2Id);
// 根据三个分类获取商品属性
export const getAttrInfoList = (category1Id, category2Id, category3Id) =>
request.get(API.ATTR_INFO_LIST + category1Id + '/' + category2Id + '/' + category3Id);
// 新增或修改属性
export const addOrUpdateAttr = (data) =>
request.post(API.ADD_UPDATE_ATTR, data);

// 删除属性
export const deleteAttr = (id)=>request.delete(API.DELETE_ATTR+id)