import React, { useEffect } from 'react'
import { Card, Button, message, Table, Pagination, Form, Select, Tag,Option } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setCategory1Id } from '../../store/category/categorySlice';

export default function Category() {
    const { Option } = Select;
    const categoryStore = useSelector(state=>state.category)
    const dispatch = useDispatch()
    console.log(categoryStore)

    useEffect(()=>{
        // dispatch(setCategory1Id())
    },[])
    // 分类一选择
    const c1changeHandler = ()=>{
        
    }
    return (
        <div>
            <Card style={{ width: '100 %' }}>
                <Form layout="inline" size='large' style={{ display: 'flex', gap: '20px' }}>

                    <Form.Item label='一级分类'>
                        <Select style={{ width: '200px' }} onChange={c1changeHandler}>

                            {categoryStore?.c1Arr?.map(item=>{
                                return <Option value={item.id} key={item.id}>{item.name}</Option>
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item label='二级分类'>
                        <Select style={{ width: '200px' }}>

                            <Option value="2">222</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label='三级分类'>
                        <Select style={{ width: '200px' }}>

                            <Option value="2">222</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}
