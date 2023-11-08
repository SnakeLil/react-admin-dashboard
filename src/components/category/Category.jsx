import React, { useEffect, useState } from 'react'
import { Card, Button, message, Table, Pagination, Form, Select, Tag,Option } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setCategory1Id,getC1 ,setC2Arr,setCategory2Id,setC3Arr,setCategory3Id} from '../../store/category/categorySlice';
import { getAttrOneList,getAttrTwoList,getAttrThreeList } from '../../api/product/category';

export default function Category({scene,view}) {
    const { Option } = Select;
    const categoryStore = useSelector(state=>state.category)
    const dispatch = useDispatch()
    
    // 获取一级分类
    const getOneAttr = async()=>{
        let res = await getAttrOneList()
        if(res.code === 200){
            // console.log(res)
            dispatch(getC1(res.data))
        }else {
            console.log(res)
        }
    }
    useEffect(()=>{
        getOneAttr()

    },[])
    // 分类一选择
    const c1changeHandler = async (id)=>{
        dispatch(setCategory2Id(''))
        dispatch(setCategory3Id(''))
        dispatch(setC2Arr([]))
        dispatch(setC3Arr([]))
        // console.log(value)
        dispatch(setCategory1Id(id))//将一级id保存到仓库
        // 根据一级id获取二级分类的数据
        let res = await getAttrTwoList(id)
        if(res.code === 200) {
            dispatch(setC2Arr(res.data))
        }else {
            console.log(res)
        }
    }
    // 二级分类选择
    const c2changeHandler = async (id)=>{
        dispatch(setCategory2Id(id))//保存c2Id进仓库
        // 发请求
        let res = await getAttrThreeList(id)
        if(res.code === 200) {
            // 保存c3分类数据进仓库
            dispatch(setC3Arr(res.data))
            
        }else {
            console.log(res)
        }
    }
    // 三级分类选择
    const c3changeHandler = (id)=>{
        dispatch(setCategory3Id(id))//保存c3Id进仓库
    }
    return (
        <div>
            <Card style={{ width: '100 %' }}>
                <Form layout="inline" size='large' style={{ display: 'flex', gap: '20px' }}>

                    <Form.Item label='一级分类'>
                        <Select style={{ width: '200px' }} onChange={c1changeHandler} disabled={scene?true:false}> 

                            {categoryStore.c1Arr?.map(item=>{
                                return <Option value={item.id} key={item.id}>{item.name}</Option>
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item label='二级分类'>
                        <Select style={{ width: '200px' }} onChange={c2changeHandler} disabled={(categoryStore.category1Id&&!scene)?false:true}>
                            {categoryStore.c2Arr.map(item=>{   
                                    return <Option value={item.id} key={item.id}>{item.name}</Option>
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item label='三级分类'>
                        <Select style={{ width: '200px' }} onChange={c3changeHandler}  
                        disabled={categoryStore.category2Id&&!scene&&(view?view===0:true)?false:true}>
                        {categoryStore.c3Arr.map(item=>{   
                                    return <Option value={item.id} key={item.id}>{item.name}</Option>
                            })}
                        </Select>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}
