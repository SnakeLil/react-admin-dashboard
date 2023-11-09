// 统一管里项目用户相关的接口

import axios from 'axios';
import request from '../../../utils/request'

//枚举请求地址，（定义常量）
const API =  {
    // sku列表
    SKU_LIST: '/admin/product/list/',

    // 商品上架
    SKU_ON_SALE: '/admin/product/onSale/',
    //商品下架
    SKU_OFF_SALE: '/admin/product/cancelSale/',
    // 根据商品sku id 拿商品信息
    SKU_INFO: '/admin/product/getSkuInfo/',
    // 删除sku
    SKU_DEL: '/admin/product/deleteSku/',
}
// 暴露请求函数
// 获取sku列表
export const getSkuList = (page,limit) => request.get(API.SKU_LIST+`${page}/${limit}`);
// 上架
export const onSale = (skuId) => request.get(API.SKU_ON_SALE+skuId);
//下架
export const offSale = (skuId) => request.get(API.SKU_OFF_SALE+skuId);
//  根据商品sku id 拿商品信息
export const getSkuInfo = (skuId) => request.get(API.SKU_INFO+skuId);
// 删除sku
export const delSku = (skuId) => request.delete(API.SKU_DEL+skuId);