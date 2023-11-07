// 统一管里项目用户相关的接口

import axios from 'axios';
import request from '../../../utils/request'

//枚举请求地址，（定义常量）
const API =  {
    SPU_LIST: '/admin/product/',
    SPU_ADD: '/admin/product/saveSpuInfo', 
    SPU_UPDATE: '/admin/product/updateSpuInfo',
    SPU_DELETE: '/admin/product/deleteSpu/',

    SPU_INFO: '/admin/product/getSpuById/{spuId}',

    ALL_TRADEMARK_LIST: '/admin/product/baseTrademark/getTrademarkList',
    SPU_IMAGE_LIST: '/admin/product/spuImageList/',
    SPU_SALE_LIST: '/admin/product/spuSaleAttrList/',
    ALL_SALE_ATTR_LIST: '/admin/product/baseSaleAttrList',
    ADD_SKU_FOR_SPU: '/admin/product/saveSkuInfo',
    SKU_INFO_BY_SPU: '/admin/product/findBySpuId/',
}
// 暴露请求函数
// 获取spu列表（根据页码，每页数）
export const getSpuList = (page, limit,category3Id) => {
    return request.get(API.SPU_LIST+page+'/'+limit+'?category3Id='+category3Id);
}
// 获取全部品牌哦
export const getAllTrademarkList = () => {
    return request.get(API.ALL_TRADEMARK_LIST);
}
// 获取某个spu下的所有sku图片列表
export const getSpuImageList = (spuId) => {
    return request.get(API.SPU_IMAGE_LIST+spuId);
}
// 根据id获取某个spu的销售属性列表
export const getSpuSaleList = (spuId) => {
    return request.get(API.SPU_SALE_LIST+spuId);
}
// 获取全部销售属性
export const getAllSaleAttrList = () => {
    return request.get(API.ALL_SALE_ATTR_LIST);
}
// 添加spu,// 修改/更新spu
export const addOrUpdateSpu = (spuInfo) => {
    if(spuInfo.id) {
        return request.post(API.SPU_UPDATE,spuInfo);
    }else {
        return request.post(API.SPU_ADD,spuInfo);
    }
}
// 为某个spu添加sku(参数：3级分类id，spuid，品牌id，sku)
export const addSkuForSpu = (data) => {
    return request.post(API.ADD_SKU_FOR_SPU,data); 
}
// 查看某个spu下的所有sku
export const getSkuListBySpu = (spuId) => {
    return request.get(API.SKU_INFO_BY_SPU+spuId);
}
// 删除spu
export const deleteSpu = (spuId) => {
    return request.delete(API.SPU_DELETE+spuId);
}