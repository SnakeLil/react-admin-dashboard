import React, { useState, useRef, useEffect } from 'react'
import './brand.scss'
import { Card, Button, message, Table, Pagination, Form, Upload, Modal, Input ,Popconfirm} from 'antd';
import { LoadingOutlined, PlusOutlined, EditOutlined, DeleteOutlined,QuestionCircleOutlined } from '@ant-design/icons'
import { TrandemarkList, AddOrUpdateTrademark, deleteTrandemark, uploadFile ,} from '../../../../api/product/brand';
import MySpin from '../../../../components/spin/MySpin';
export default function Brand() {
  const [spinning, setSpinning] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);// 对话框
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [brand, setBrand] = useState(
    {//品牌对象

      id: '',
      tmName: '',
      logoUrl: '',
    })
  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      render: (value) => {
        return <div style={{ textAlign: 'center', lineHeight: '60px' }}>{value}</div>
      }
    },
    {
      title: '品牌名',
      dataIndex: 'tmName',
      key: 'tmName',
      align: 'center',
    },
    {
      title: 'logo',
      dataIndex: 'logoUrl',
      key: 'logoUrl',
      align: 'center',
      width: 400,
      render: (value) => {
        return <div style={{ width: '100%', height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src={value} alt="" style={{ width: '50px', height: '50px' }} />
        </div>
      }
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      width: 400,
      render: (_, record) => (
        <div style={{ width: '100%', height: '100%', display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
          <Button icon={<EditOutlined />} onClick={() => handleModifyBrand(record)}>修改</Button>
          {/* <Button icon={<DeleteOutlined />} onClick={() => handleDelBrand(record)}>删除</Button> */}
          <Popconfirm
            description={`确定删除吗?`}
            okText="确认"
            cancelText="取消"
            placement="left"
            icon={<QuestionCircleOutlined style={{ color: 'gray' }} />}
            onConfirm={() => { handleDelBrand(record) }}>
            <Button >删除</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];
  const [brandList, setBranList] = useState([])

  // 分页器
  const pagination = useRef({
    current: 1,
    pageSize: 8,
    total: 0,
  })
  // 获取所有品牌品牌列表
  const getAllBrand = async () => {
    setSpinning(true)
    try {
      let res = await TrandemarkList(pagination.current.current, pagination.current.pageSize)
      if (res.code === 200) {
        setSpinning(false)
        setBranList(res.data.records.map(item => {
          return { ...item, key: item.id }
        }))
        pagination.current.total = res.data.total
      } else {
        setSpinning(false)
        message.error(res.message)
      }
    } catch (err) {
      setSpinning(false)
      message.error(err.message)
    }
  }
  // 组件挂载时获取数据
  useEffect(() => {
    getAllBrand()
  }, [])

  // 分页器每页条数变化
  const onShowSizeChange = (current, size) => {
    // setTableParams(pre => { return { ...pre, pageSize: size, current: current } })
    pagination.current.current = current
    pagination.current.pageSize = size
    getAllBrand()
  }
  // 分页器页码变化事件
  const onChange = (page, pageSize) => {
    // setTableParams(pre => { return { ...pre, current: page, pageSize: pageSize } })
    pagination.current.current = page
    pagination.current.pageSize = pageSize
    getAllBrand()
  }

  // 点击添加品牌按钮
  const handleAddBrand = () => {
    setBrand({ id: '', tmName: '', logoUrl: '', })
    setModalOpen(true)
  }
  // 文件上传
  const beforeUpload = (file) => {
    if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'image/gif' && file.type !== 'image/webp') {
      message.info('上传的图片格式只能是jpeg/png/jpg/gif/webp')
      return false
    }
    // console.log(file)

  }
  const handleChange = async (file) => {
    // 实现图片预览
    if (!file.file.url && !file.file.preview) {
      file.file.preview = await getBase64(file.file.originFileObj);
    }
    setPreviewImage(file.file.url || file.file.preview);//用base64设置图片路径，展示预览图片
    console.log(file)
    // 
    // 图片请求返回201失败，问题尚未解决，拿不到图片的logoUrl
    // 图片请求返回201失败，问题尚未解决，拿不到图片的logoUrl
    // 图片请求返回201失败，问题尚未解决，拿不到图片的logoUrl
    // 
    if (file.file?.response?.code === 200) {
      setBrand(pre => ({ ...brand, imgUrl: file.file.response.data }))
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
  // 点击修改品牌按钮
  const handleModifyBrand = (record) => {
    console.log(record)
    setBrand({ id: '', tmName: '', logoUrl: '', })
    setModalOpen(true)
    setBrand(pre => ({ ...pre, id: record.id, tmName: record.tmName, logoUrl: record.logoUrl, }))
  }
  // 点击确认添加/修改品牌
  const save = async () => {
    setBrand({ id: '', tmName: '', logoUrl: '', })
    try {
      let res = await AddOrUpdateTrademark(brand)
      if (res.code === 200) {
        console.log(res)
        message.success(brand.id ? '修改成功' : '添加成功')
        setModalOpen(false)
        setBrand({ id: '', tmName: '', logoUrl: '', })
      } else {
        setModalOpen(false)
        setBrand({ id: '', tmName: '', logoUrl: '', })
        message.error(brand.id ? '修改失败' : '添加失败')
      }
    } catch (err) {
      setModalOpen(false)
      setBrand({ id: '', tmName: '', logoUrl: '', })
      message.error(brand.id ? '修改品牌失败' : '添加品牌失败')
    }
  }
  // 点击删除
  const handleDelBrand = async (record) => {
    try {
      let res = await deleteTrandemark(record.id)
      if (res.code === 200) {
        message.success('删除成功')
        getAllBrand()
      }
    } catch (err) {
      message.error(err.message)
    }
  }

  return (
    <div className='brand'>
      <Card style={{ width: '100 %' }}>
        <Button icon={<PlusOutlined />} onClick={handleAddBrand}>添加品牌</Button>
        <div style={{ width: '100%', marginTop: '30px' }}>

          <Table columns={columns} dataSource={brandList} bordered pagination={false} />
          <Pagination
            style={{ marginTop: '30px' }}
            showSizeChanger
            onShowSizeChange={onShowSizeChange}
            total={pagination.current.total}
            current={pagination.current.current}
            pageSize={pagination.current.pageSize}
            onChange={onChange}

            pageSizeOptions={[1, 2, 5, 10, 15, 20, 25, 30]}
            showQuickJumper
          />
        </div>
      </Card>
      {/* 对话框组件 */}
      <Modal
        width={800}
        style={{}}
        title={brand?.id ? '修改品牌' : "添加品牌"}
        centered
        open={modalOpen}
        onOk={save}
        onCancel={() => setModalOpen(false)}
      >
        <Form style={{ minHeight: '200px', marginTop: '50px' }} size='large'>
          <Form.Item label="品牌名称" >
            <Input value={brand?.tmName} placeholder='请输入品牌名称' style={{ width: '200px' }}
              onChange={(e) => setBrand(pre => { return { ...pre, tmName: e.target.value } })} />
          </Form.Item>
          <Form.Item label="品牌图片" >
            <Upload
              // onPreview={handlePreview}
              maxCount={1}
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action='http://sph-api.atguigu.cn/admin/product/fileUpload'
              // {async(file)=>{
              //   // console.log(file)
              //   let res = await uploadFile(file)
              //   console.log(res)
              //   return res

              // }}
              beforeUpload={beforeUpload}
              onChange={(e) => { handleChange(e) }}
            >
              {previewImage || brand.logoUrl ? (
                <img
                  src={brand.logoUrl || previewImage}
                  alt="avatar"
                  style={{
                    width: '100%',
                  }}
                />
              ) : (
                <div>
                  {loading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div
                    style={{
                      marginTop: 8,
                    }}
                  >
                    Upload
                  </div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <MySpin spinning={spinning} />
    </div>
  )
}
