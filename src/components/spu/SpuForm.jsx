import React, { useEffect, useRef, useState } from 'react'
import { Card, Button, message, Table, Form, Modal, Upload, Input, Popconfirm, Select, Tag } from 'antd';
import { DeleteOutlined, EyeOutlined, PlusOutlined, EditOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { uploadFile } from '../../api/product/brand';
import { useSelector } from 'react-redux';
import { getAllTrademarkList, getAllSaleAttrList, getSpuSaleList, getSpuImageList, addOrUpdateSpu } from '../../api/product/spu';
import MySpin from '../spin/MySpin';
export default function SpuForm({ setSence, spu,getAllSpu }) {
    const [spinning, setSpinning] = useState(false)
    const { Option } = Select;
    const { TextArea } = Input;
    const [flag, setFlag] = useState(false)
    const [saleList, setSaleList] = useState([])
    const [fileList, setFileList] = useState([])//上传图片列表
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const categoryStore = useSelector(state => state.category)
    const [allSaleAttr, setAllSaleAttr] = useState([])
    const [saleAttrList, setSaleAttrList] = useState([])//所有销售属性
    const [saleAttr, setSaleAttr] = useState('')//选择框的当前销售属性
    // spu对象
    const [spuData, setSpuData] = useState({
        id: '',
        spuName: '',
        tmId: '',
        description: '',
        category3Id: '',
        spuImageList: [],
        spuSaleAttrList: []
    })
    const spuInfo = useRef({
        id: '',
        spuName: '',
        tmId: '',
        description: '',
        category3Id: '',
        spuImageList: [],
        spuSaleAttrList: []
    })
    const [brandList, setBrandList] = useState([])
    // spu图片列表
    const [spuSaleAttrList, setSpuSaleAttrList] = useState([]) //当前spu的销售属性列表
    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            width: 150,

        },
        {
            title: '属性名',
            dataIndex: 'saleAttrName',
            key: 'saleAttrName',
            align: 'center',
            width: 200,
        },
        {
            title: '销售属性值',
            dataIndex: 'spuSaleAttrValueList',
            key: 'spuSaleAttrValueList',
            align: 'center',
            ellipsis: true,
            render: (value, record, index) => {
                return <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
                    {value?.map(item => {
                        return item.flag ? <Input onBlur={() => { onTagBlur(item, value) }} onChange={(e) => { onTagInputChange(e, item, value) }} autoFocus value={item.saleAttrValueName} style={{ width: '50px', height: '23px' }} />
                            :
                            <Tag closable={true} onClose={(e) => { onTagClose(item) }} key={item.id}>{item.saleAttrValueName}</Tag>
                    })}
                    <Tag icon={<PlusOutlined />} onClick={() => { handleAddSaleAttrValue(value, record) }}>添加</Tag>
                </div>
            }

        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            width: 300,
            render: (value, record) => (
                <div style={{ width: '100%', height: '100%', display: 'flex', gap: '50px', justifyContent: 'center', alignItems: 'center' }}>
                    {/* <Button icon={<PlusOutlined />} title='编辑' ></Button> */}
                    <Popconfirm
                        description={`确定删除吗?`}
                        okText="确认"
                        cancelText="取消"
                        placement="left"
                        icon={<QuestionCircleOutlined style={{ color: 'gray' }} />}
                        onConfirm={() => { handleClickDelSaleAttr(record) }}>
                        <Button icon={<DeleteOutlined />} >删除</Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];
    // 获取某个spu下的所有sku图片列表
    const getImageListById = async () => {
        let res = await getSpuImageList(spu.id)
        if (res.code === 200) {
            setFileList(res.data.map(item => {
                return { ...item, url: item.imgUrl }
            }))
        } else {
            message.error(res.message)
        }
    }

    // 获取所有销售属性
    const getAllSaleAttr = async () => {
        let res = await getAllSaleAttrList()
        if (res.code === 200) {
            setSaleAttrList(res.data)
            setAllSaleAttr(res.data)

        }
    }
    // 根据id获取spu的销售属性列表
    const getSpuSaleAttrList = async () => {
        let res = await getSpuSaleList(spu.id)
        if (res.code === 200) {
            console.log(res)
            setSpuSaleAttrList(res.data.map(item => {
                return { ...item, key: item.id }
            }))
        } else {
            message.error(res.message)
        }
    }
    // 获取所有品牌数据
    const getAllBrand = async () => {
        let res = await getAllTrademarkList()
        if (res.code === 200) {
            setBrandList(res.data)
        } else {
            message.error(res.message)
        }
    }
    useEffect(() => {
        getAllBrand()
        getAllSaleAttr()
        if (spu.id) {//修改时，使用传过来的spu对象
            getSpuSaleAttrList() //根据id获取spu的销售属性列表展示
            getImageListById()//根据id获取spu的图片列表展示
            setFlag(pre => !pre)
            setSpuData(pre => ({
                ...pre,
                id: spu.id,
                category3Id: categoryStore.category3Id,
                spuName: spu.spuName,
                description: spu.description,
                tmId: spu.tmId
            }))
        } else {//添加时，无spu对象
            setSpuData(pre => ({ ...pre, category3Id: categoryStore.category3Id }))
        }
        setFlag(pre => !pre)
    }, [])
    useEffect(() => {
        if (spu.id) {
            setSaleAttrList(pre => allSaleAttr.filter(item => {
                return spuSaleAttrList.every(item1 => item1.baseSaleAttrId !== item.id)
            }))
        }else {
            setSaleAttrList(pre => allSaleAttr.filter(item => {
                return spuSaleAttrList?.every(item1 => item1.baseSaleAttrId !== item.id)
            }))
        }
    }, [spuSaleAttrList, spu.id, flag])
    // 图片集change事件
    const handleChange = async (file) => {
        if(file.file.status === 'removed') {
            setFileList(pre=>(pre.filter(item=>item.id !== file.file.id)))
            return
        }else {
            const formData = new FormData();
            formData.append('file', file.file.originFileObj);
            if (!file.file.url && !file.file.preview) {
                file.file.preview = await getBase64(file.file.originFileObj);
            }
            console.log(file)
            // 发请求
            let res = await uploadFile(formData)
            // console.log(res)
            if (res.data.code === 200) {
                // 实现图片预览
                setPreviewImage(file.file.url || file.file.preview);//用base64设置图片路径，展示预览图片
                message.success('上传成功')
                setFileList(pre => [...pre, { imgUrl: res.data.data, imgName: file.file.name, spuId: spu.id, url: res.data.data }])
            } else {
                message.info('上传失败')
            }
        }


    }
    // 转base64
    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    // 点击取消按钮
    const handleClickCancel = () => {
        setSence(0)
        setSpuData({ id: '', spuName: '', tmId: '', description: '', category3Id: '', spuImageList: [], spuSaleAttrList: [] })
        setSpuSaleAttrList([])
        setFileList([])
    }
    // 品牌选择change事件
    const branOnchange = (id) => {
        setSpuData(pre => ({ ...pre, tmId: id }))
    }
    // spu名称输入框change'事件
    const onSpuNameChange = (value) => {
        setSpuData(pre => ({ ...pre, spuName: value }))
    }
    // spu描述输入change事件
    const onSpuDescChange = (value) => {
        setSpuData(pre => ({ ...pre, description: value }))
    }
    // 销售属性选择 change事件
    const onSaleAttrChange = (id) => {
        console.log(id)
        setSaleAttr(id)
    }
    // 点击添加属性按钮
    const handleClickAddAttr = () => {
        let name
        saleAttrList.forEach(item => {
            if (item.id === saleAttr) {
                name = item.name
            }
        })
        setSpuSaleAttrList(pre => [...pre, { key: Date.now(), baseSaleAttrId: saleAttr, saleAttrName: name, spuSaleAttrValueList: [] }])
        setSaleAttr('')
    }
    // 标签删除事件
    const onTagClose = (value) => {
        // e.preventDefault()
        console.log(value)
        setSpuSaleAttrList(pre => pre.map(item => {
            if (item.baseSaleAttrId === value.baseSaleAttrId) {
                item.spuSaleAttrValueList = item.spuSaleAttrValueList.filter(item1 => {
                    if (value.key) {
                        return item1?.key !== value.key
                    }
                    return item1.id !== value.id
                })
                return item
            }
            return item
        }))
    }
    // 点击添加销售属性值的按钮
    const handleAddSaleAttrValue = (value, record) => {
        console.log(record)
        setSpuSaleAttrList(pre => pre.map(item => {
            if (item?.baseSaleAttrId === record?.baseSaleAttrId) {
                item.spuSaleAttrValueList.push({
                    baseSaleAttrId: record.baseSaleAttrId,
                    saleAttrValueName: '',
                    flag: true,
                    key: Date.now(),
                })
                return item
            }
            return item
        }))
    }
    // 添加标签的输入框change事件
    const onTagInputChange = (e, titem, value) => {
        console.log(value)
        setSpuSaleAttrList(pre => pre.map(item => {
            if (item.baseSaleAttrId === value[0].baseSaleAttrId) {
                item.spuSaleAttrValueList.map(item1 => {
                    if (item1?.key === titem.key) {
                        item1.saleAttrValueName = e.target.value
                        return item1
                    }
                    return item1
                })
                return item
            }
            return item
        }))
    }
    const onTagBlur = (titem, value) => {
        console.log(titem)
        setSpuSaleAttrList(pre => pre.map(item => {
            if (item.baseSaleAttrId === value[0].baseSaleAttrId) {
                item.spuSaleAttrValueList.map(item1 => {
                    if (item1?.key === titem.key) {
                        item1.flag = false
                        return item1
                    }
                    return item1
                })
                return item
            }
            return item
        }))
    }
    // 点击删除销售属性
    const handleClickDelSaleAttr = (value) => {
        console.log(value)
        setSpuSaleAttrList(pre => pre.filter(item => item.baseSaleAttrId !== value.baseSaleAttrId))
        setFlag(pre => !pre)
    }
    // 文件上传前置
    const beforeUpload = (file) => {
        if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'image/gif' && file.type !== 'image/webp') {
            message.info('上传的图片格式只能是jpeg/png/jpg/gif/webp')
            return false
        }
        if (file.size > 1024 * 1024 * 3) {
            message.info('上传的图片大小不能超过3M')
            return false
        }
        // console.log(file)

    }
    //   点击保存按钮，收集数据发送请求
    const save = async () => {
        setSpinning(true)
        setSpuData(pre=>({...pre,spuImageList:fileList,spuSaleAttrList:spuSaleAttrList}))
        spuInfo.current = {...spuData,spuImageList:fileList,spuSaleAttrList:spuSaleAttrList}
        // 为什么修改后为空？，两个列表合并时状态没有同步？
        try {
            let res = await addOrUpdateSpu(spuInfo.current)
            if (res.code === 200) {
                setSence(0)
                getAllSpu()
                setSpinning(false)
                message.success(spu.id?'修改成功':'添加成功')
                setSpuData({ id: '', spuName: '', tmId: '', description: '', category3Id: '', spuImageList: [], spuSaleAttrList: [] })
                setSpuSaleAttrList([])
                setFileList([])
                spuInfo.current = { id: '', spuName: '', tmId: '', description: '', category3Id: '', spuImageList: [], spuSaleAttrList: []}
            } else {
                setSpinning(false)
                message.error(res.message)
            }
        } catch (err) {
            message.error(err.message)
        }

    }
    return (
        <Card style={{ width: '100 %', marginTop: '30px' }}>
            <Form size='large'>
                <Form.Item label='SPU名称'>
                    <Input placeholder='请输入SPU名称' value={spuData.spuName} style={{ width: '200px ' }} onChange={(e) => { onSpuNameChange(e.target.value) }} />
                </Form.Item>
                <Form.Item label='SPU品牌'>
                    <Select placeholder='请选择品牌' value={spuData.tmId} onChange={(e) => { branOnchange(e) }} style={{ width: '200px ' }}>
                        {brandList.map(item => {
                            return <Option value={item.id} key={item.id}>{item.tmName}</Option>
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label='SPU描述'>
                    <TextArea rows={4} value={spuData.description} onChange={(e) => { onSpuDescChange(e.target.value) }} placeholder='请输入SPU描述' style={{ width: '600px ' }} />
                </Form.Item>
                <Form.Item label='SPU图片'>
                    <Upload
                        action="http://8.134.64.19:5173/api/admin/product/fileUpload"
                        listType="picture-card"
                        fileList={fileList}
                        // onPreview={handlePreview}
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                        // onRemove  ={(file) => { handleRemove(file)}
                    >
                        <PlusOutlined />
                    </Upload>
                    <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => { console.log(1)}}>
                        <img
                            alt="img"
                            style={{
                                width: '100%',
                            }}
                            src={previewImage}
                        />
                    </Modal>
                </Form.Item>
                {/* 销售属性 */}
                <Form.Item label='SPU销售属性'>
                    <Select placeholder='请选择销售属性' value={saleAttr} onChange={(e) => { onSaleAttrChange(e) }} style={{ width: '200px ' }}>
                        {saleAttrList.map(item => {
                            return <Option key={item.id} value={item.id}>{item.name}</Option>
                        })}
                    </Select>
                    <Button style={{ marginLeft: '20px' }} onClick={handleClickAddAttr} disabled={!saleAttr || !saleAttrList.length}>添加属性</Button>
                </Form.Item>
                <Table columns={columns} dataSource={spuSaleAttrList} bordered pagination={false} style={{ margin: '30px 0' }} />
                <Button onClick={save} disabled={!(spuData.spuName?.trim().length && spuData?.tmId && spuData?.description.trim().length)}>保存</Button>
                <Button style={{ marginLeft: '20px' }} onClick={handleClickCancel}>取消</Button>
            </Form>
            <MySpin spinning={spinning} />
        </Card>
    )
}
