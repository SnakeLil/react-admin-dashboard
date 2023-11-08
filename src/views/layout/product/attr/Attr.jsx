import React, { useState,  useEffect } from 'react'
import './attr.scss'
import { Card, Button, message, Table,  Form,  Tag,Input,  Popconfirm } from 'antd';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux';
import Category from '../../../../components/category/Category';
import { getAttrInfoList, deleteAttr, addOrUpdateAttr } from '../../../../api/product/category';
import MySpin from '../../../../components/spin/MySpin';
import { setCategory2Id ,setCategory3Id,getC1,setC2Arr,setC3Arr,setCategory1Id, clearCategory} from '../../../../store/category/categorySlice';

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
                    <Button onClick={() => { handleModifyAttr(record) }}>修改</Button>
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
            dataIndex: 'valueName',
            key: 'valueName',
            width: 250,
            align: 'center',
            render:(value,record)=>{
                return <div style={{width:'100%',height:'100%',display:'flex',justifyContent:'center'}}>
                {record.flag?
                <Input placeholder="请输入属性值" value={value} style={{width:"200px"}} autoFocus={true} 
                onBlur={(e)=>{inputOnBlur(record)}}
                onChange={(e)=> {setAttrValueList(pre=>pre.map(item=>{
                    if(item.key === record.key) {
                        item.valueName =e.target.value
                        return item
                    }else {
                        return item
                    }
                })
                   
                //     {
                //     pre[pre.length-1]={...pre[pre.length-1],valueName:e.target.value}
                //     return [...pre]
                // }
                )}}/>
                :
                <span >{value}</span>}
                </div>
            }
        },

        {
            title: '操作',
            key: 'action',
            align: 'center',
            width: 150,
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <Button onClick={()=>{handleAttrValueModify(record)}}>修改</Button>
                    <Popconfirm
                        description={`确定删除属性值: ${record.valueName} 吗?`}
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
    const [attrList, setAttrList] = useState([])//属性列表
    const [attrValueList, setAttrValueList] = useState([]) //属性值列表
    const categoryStore = useSelector(state => state.category) //获取分类仓库
    const [spinning, setSpinning] = useState(false)
    const dispatch = useDispatch()
    const [attr, setAttr] = useState({
        id: '',
        attrName: '',
        categoryId: '',
        categoryLevel: 3,
        attrValueList: []
    })
    // 发请求获取属性数据
    const getAttrList = async () => {
        setSpinning(true)

        try {
            let res = await getAttrInfoList(categoryStore.category1Id, categoryStore.category2Id, categoryStore.category3Id)
            if (res.code === 200) {
                setSpinning(false)
                setAttrList(res.data.map(item => {
                    return { ...item, key: item.id }
                }))
            } else {
                setSpinning(false)
                console.log(res.message)
            }
        } catch (err) {
            setSpinning(false)
            message.error('网络错误')
        }

    }
    useEffect(() => {
        if (categoryStore.category3Id) {
            getAttrList()
        }
        // return ()=>{

        // }
    }, [categoryStore.category3Id])

    useEffect(()=>{ //组件第一次渲染时清空仓库中的分类数据，以及属性列表
        dispatch( clearCategory())
        setAttrValueList([])
        setAttrList((pre)=>[])
    },[])

    // 点击添加属性
    const addAttrHandler = () => {
        setAttr(pre=> {
            return {id: '',attrName: '',categoryId: categoryStore.category3Id,categoryLevel: 3,attrValueList: []}
        })
        setAttrValueList([])
        // 显示添加/修改页
        setScene(pre => !pre)
        
        
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
    const handleDelAttrValueOk = (attrValue) => {
        console.log(attrValue)
        setAttrValueList(pre=> pre.filter(item => item.id !== attrValue.id))
    }
    // 点击修改属性
    const handleModifyAttr = (record) => {
        setAttr({id: '',attrName: '',categoryId: '',categoryLevel: 3,attrValueList: []})
        setScene(pre => !pre)
        setAttr(pre => { return Object.assign(pre, JSON.parse(JSON.stringify(record))) })
        setAttrValueList(record.attrValueList.map(item=>{
            return {...item,key:item.id}
        }))


    }
    // 点击添加属性值按钮
    const handleClickAddAttrValue =()=>{
        setAttrValueList([...attrValueList,{id:'',key:Date.now(),attrId:'',valueName:'',flag:true}])
    }

    // 点击保存，添加/修改属性
    const save = async ()=>{
        setSpinning(true)
        try {
            let res = await addOrUpdateAttr({
                ...attr,
                attrValueList:attrValueList
            })
            if(res.code === 200) {
                getAttrList()
                setSpinning(false)
                message.success(attr.id?'修改成功':'添加成功')
                setScene(pre => !pre)
            }else {
                setSpinning(false)
                message.error('保存失败')
                
            }
        }catch(err) {
            setSpinning(false)
            message.error('网络超时！')
        }

    }
    // 属性值失去焦点
    const inputOnBlur = (value)=>{
        console.log(value)
        if(value.valueName.trim().length === 0) {
            // 没有输入属性值，删除此行
            setAttrValueList(pre=>pre.filter(item=>item.key!==value.key))
            message.info('属性值不能为空')
        }else {
            // 有属性值，且不为空、
            setAttrValueList(pre=>pre.map(item=>{
                if(item.key === value.key) {
                    item.flag = false
                    return item
                }else {
                    return item
                }
            }))
        }
    }
    // 点击修改属性值
    const handleAttrValueModify = (value)=>{
        setAttrValueList(pre=>pre.map(item=>{
            if(item.key === value.key) {
                item.flag = true
                return item
            }else {
                return item
            }
           
        }))
    }
    // 点击取消
    const cancel = ()=>{
        setAttr(pre=> {
            return {id: '',attrName: '',categoryId: '',categoryLevel: 3,attrValueList: []}
        })
        setScene(pre => !pre) 
    }
   
    
    return (
        <div className='attr'>
            {/* 三级分类 */}
            <Category scene={scene}/>
            {/* 属性列表 */}
            <Card style={{ width: '100 %', marginTop: '30px' }}>
                {scene ?
                    <div>
                        <Form size='large'>
                            <Form.Item label="属性名">
                                <Input placeholder="请输入属性名" value={attr.attrName} style={{ width: '200px' }}
                                 onChange={(e)=>{
                                    setAttr((pre)=> {return {...pre,attrName:e.target.value}})
                            }}/>
                            </Form.Item>
                        </Form>
                        <Button icon={<PlusOutlined />} disabled={attr.attrName.trim().length?false:true} onClick={handleClickAddAttrValue}>添加属性</Button>
                        <Button onClick={ cancel} style={{ marginLeft: '25px' }}>取消</Button>
                        <Table style={{ margin: '30px 0' }} columns={attrColumns} dataSource={attrValueList} bordered pagination={false} />
                        <Button onClick={save} disabled={attr.attrName.trim().length?false:true}>保存</Button>
                        <Button onClick={cancel} style={{ marginLeft: '25px' }}>取消</Button>
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
