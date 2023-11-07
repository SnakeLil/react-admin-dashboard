import React, { useEffect, useState } from 'react'
import { Card, Button, message, Table, Form, Modal, Upload, Input, Popconfirm, Select ,Tag} from 'antd';
import { DeleteOutlined, EyeOutlined, PlusOutlined, EditOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { uploadFile } from '../../api/product/brand';
import { getAllTrademarkList } from '../../api/product/spu';
export default function SpuForm({ setSence }) {
    const { Option } = Select;
    const { TextArea } = Input;
    const [saleList, setSaleList] = useState([])
    const [fileList, setFileList] = useState([])//上传图片列表
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    // spu对象
    const [spuData,setSpuData] = useState({
        id:'',
        spuName: '',
        tmId: '',
        description: '',
        category3Id: '',
        spuImageList:[],
        spuSaleAttrList:[]
    })
    const [brandList,setBrandList] = useState([])
    // spu图片列表
    const [spuImgList,setSpuImgList] = useState([])
    // spu销售属性列表
    const [spuSaleAttrList,setSpuSaleAttrList] = useState([])
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
            dataIndex: 'saleName',
            key: 'saleName',
            align: 'center',
            width: 200,
        },
        {
            title: '销售属性值',
            dataIndex: 'saleValueName',
            key: 'saleValueName',
            align: 'center',
            ellipsis: true,
            render:(value)=>{
                return <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center'}}>
                    <Tag closable={true}>1</Tag>
                    <Tag  icon={<PlusOutlined />} onClick={()=>{}}>添加</Tag>
                </div>
            }

        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            width: 500,
            render: (_, record) => (
                <div style={{ width: '100%', height: '100%', display: 'flex', gap: '50px', justifyContent: 'center', alignItems: 'center' }}>
                    <Button icon={<EditOutlined />} title='编辑'>编辑</Button>
                    <Popconfirm
                        description={`确定删除吗?`}
                        okText="确认"
                        cancelText="取消"
                        placement="left"
                        icon={<QuestionCircleOutlined style={{ color: 'gray' }} />}
                        onConfirm={() => { }}>
                        <Button icon={<DeleteOutlined />}>删除</Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    const getAllBrand = async()=>{
        let res = await getAllTrademarkList()
        if(res.code === 200) {
            console.log(res)
            setBrandList(res.data)
        }
    }
    useEffect(()=>{
        getAllBrand()
    },[])
    // 图片集change事件
    const handleChange = async (file) => {
        const formData = new FormData();
        formData.append('file', file.file.originFileObj);
        if (!file.file.url && !file.file.preview) {
            file.file.preview = await getBase64(file.file.originFileObj);
        }
        // 发请求
        if (file.file.status === 'done') {
            let res = await uploadFile(formData)
            if (res.data.code === 200) {
                // 实现图片预览
                setPreviewImage(file.file.url || file.file.preview);//用base64设置图片路径，展示预览图片
                message.success('上传成功')
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
    }
    // 品牌选择change事件
    const branOnchange = (id) =>{
        console.log(id)//品牌id
        setSpuData(pre=>({...pre,tmId:id}))
    }
    return (
        <Card style={{ width: '100 %', marginTop: '30px' }}>
            <Form size='large'>
                <Form.Item label='SPU名称'>
                    <Input placeholder='请输入SPU名称' style={{ width: '200px ' }} />
                </Form.Item>
                <Form.Item label='SPU品牌'>
                    <Select placeholder='请选择品牌' onChange={(e)=>{branOnchange(e)}}  style={{ width: '200px ' }}>
                        {brandList.map(item=>{
                            return <Option value={item.id} key={item.id}>{item.tmName}</Option>
                            })}
                        <Option value='1'>1</Option>
                    </Select>
                </Form.Item>
                <Form.Item label='SPU描述'>
                    <TextArea rows={4} placeholder='请输入SPU描述' style={{ width: '600px ' }} />
                </Form.Item>
                <Form.Item label='SPU图片'>
                    <Upload
                        action="http://8.134.64.19:5173/api/admin/product/fileUpload"
                        listType="picture-card"
                        fileList={fileList}
                        // onPreview={handlePreview}
                        onChange={handleChange}
                    >
                        <PlusOutlined />
                    </Upload>
                    <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={()=>{}}>
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
                    <Select placeholder='请选择销售属性' style={{ width: '200px ' }}>
                        <Option value='1'>1</Option>
                    </Select>
                        <Button style={{ marginLeft: '20px' }} >添加属性</Button>
                </Form.Item>
                <Table columns={columns} dataSource={saleList} bordered pagination={false} style={{ margin: '30px 0' }} />
                <Button>保存</Button>
                <Button style={{ marginLeft: '20px' }} onClick={handleClickCancel}>取消</Button>
            </Form>
        </Card>
    )
}
