import React,{useState,useRef} from 'react'
import './attr.scss'
import { Card, Button, message, Table, Pagination, Form, Select, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux';
import Category from '../../../../components/category/Category';

export default function Attr() {
    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            width:150,
            align:'center'
        },
        {
            title: '属性名',
            dataIndex: 'attrName',
            key: 'attrName',
            width:250,
            align:'center'
        },
        {
            title: '属性值名',
            dataIndex: 'attrValueName',
            key: 'attrValueName',
            align:'center',
            render: () => {
                return <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Tag color="#55acee">volcano</Tag>
                </div>
            }
        },
        {
            title: 'Action',
            key: 'action',
            width:150,
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <Button>修改</Button>
                    <Button>删除</Button>
                </div>
            ),
        },
    ];
    const brandList = useState([])
    

    // 
    return (
        <div className='attr'>
            {/* 三级分类 */}
            <Category/>
            {/* 属性列表 */}
            <Card style={{ width: '100 %', marginTop: '30px' }}>
                <Button icon={<PlusOutlined />}>添加属性</Button>

                <div style={{ width: '100%', marginTop: '30px' }}>

                    <Table columns={columns} dataSource={brandList} bordered pagination={false} />
                </div>
            </Card>
        </div>
    )
}
