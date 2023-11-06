import React, { useState, useRef, useEffect } from 'react'
import './attr.scss'
import { Card, Button, message, Table, Pagination, Form, Select, Tag, Modal, Input, Upload, Popconfirm } from 'antd';
import { PlusOutlined, LoadingOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux';
import Category from '../../../../components/category/Category';
import { getAttrInfoList, deleteAttr } from '../../../../api/product/category';
import MySpin from '../../../../components/spin/MySpin';
import FormItem from 'antd/es/form/FormItem';
export default function Attr() {
    const [scene, setScene] = useState(false)
    // 属性列表
    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            width: 150,
            align: 'center'
        },
        {
            title: '属性名',
            dataIndex: 'attrName',
            key: 'attrName',
            width: 250,
            align: 'center'
        },
        {
            title: '属性值名',
            dataIndex: 'attrValueList',
            key: 'attrValueList',
            align: 'center',
            render: (value) => {
                return <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {value.map(item => {
                        return <Tag key={item.id} color="#55acee">{item.valueName}</Tag>
                    })}

                </div>
            }
        },
        {
            title: '操作',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <Button onClick={handleModifyAttr}>修改</Button>
                    <Popconfirm
                        description={`确定删除属性: ${record.attrName} 吗?`}
                        okText="确认"
                        cancelText="取消"
                        placement="left"
                        icon={<QuestionCircleOutlined style={{ color: 'gray' }} />}
                        onConfirm={(e) => { handleDelAttrOk(record) }}>
                        <Button >删除</Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];
    const attrColumns = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            width: 50,
            align: 'center'
        },
        {
            title: '属性值',
            dataIndex: 'attrValueName',
            key: 'attrValueName',
            width: 250,
            align: 'center'
        },

        {
            title: '操作',
            key: 'action',
            align: 'center',
            width: 150,
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <Button>修改</Button>
                    <Popconfirm
                        description={`确定删除属性: ${record.attrName} 吗?`}
                        okText="确认"
                        cancelText="取消"
                        placement="left"
                        icon={<QuestionCircleOutlined style={{ color: 'gray' }} />}
                        onConfirm={(e) => { handleDelAttrValueOk(record) }}>
                        <Button >删除</Button>
                    </Popconfirm>
                </div>
            ),
        },
    ]
    const [attrList, setAttr] = useState([])//属性列表
    const [attrValueList, setAttrValue] = useState([]) //属性值列表
    const categoryStore = useSelector(state => state.category) //获取分类仓库
    const [spinning, setSpinning] = useState(false)
    // 发请求获取属性数据
    const getAttrList = async () => {
        setSpinning(true)
        
        try{
            let res = await getAttrInfoList(categoryStore.category1Id, categoryStore.category2Id, categoryStore.category3Id)
            if (res.code === 200) {
                setSpinning(false)
                setAttr(res.data.map(item => {
                    return { ...item, key: item.id }
                }))
            } else {
                setSpinning(false)
                console.log(res.message)
            }
        }catch(err) {
            setSpinning(false)
            message.error('网络错误')
        }

    }
    useEffect(() => {
        if (categoryStore.category3Id) {
            getAttrList()
        }
    }, [categoryStore.category3Id])

    // 点击添加属性
    const addAttrHandler = () => {
        // 显示添加/修改页
        setScene(pre=>!pre)
    }

    // 图片上传前置守卫
    const beforeUpload = () => {

    }
    // 图片上传change
    const handleChange = () => {

    }
    // 点击确认删除属性
    const handleDelAttrOk = async (attr) => {
        let res = await deleteAttr(attr.id)
        if (res.code === 200) {
            message.success('删除成功')
            getAttrList()
        } else {
            message.error('删除失败')
        }
    }
    // 点击确认删除属性值
    const handleDelAttrValueOk = (attrValue)=>{

    }
    // 点击修改属性
    const handleModifyAttr = (attr)=>{
        setScene(pre=>!pre)
    }
    return (
        <div className='attr'>
            {/* 三级分类 */}
            <Category />
            {/* 属性列表 */}
            <Card style={{ width: '100 %', marginTop: '30px' }}>
                {scene ?
                    <div>
                        <Form size='large'>
                            <Form.Item label="属性名">
                                <Input placeholder="请输入属性名" style={{width:'200px'}}/>
                            </Form.Item>
                        </Form>
                        <Button icon={<PlusOutlined/>} >添加属性</Button>
                        <Button  onClick={()=>{setScene(pre=>!pre)}} style={{marginLeft:'25px'}}>取消</Button>
                        <Table style={{margin:'30px 0'}} columns={attrColumns} dataSource={attrValueList} bordered pagination={false} />
                        <Button >保存</Button>
                        <Button  onClick={()=>{setScene(pre=>!pre)}} style={{marginLeft:'25px'}}>取消</Button>
                    </div>
                    :
                    <>
                        <Button icon={<PlusOutlined />} onClick={addAttrHandler} disabled={!categoryStore.category3Id}>添加属性</Button>

                        <div style={{ width: '100%', marginTop: '30px' }}>

                            <Table columns={columns} dataSource={attrList} bordered pagination={false} />
                        </div>
                    </>
                }
            </Card>
            <MySpin spinning={spinning} />
        </div>
    )
}
