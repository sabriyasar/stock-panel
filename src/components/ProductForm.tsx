import { useState } from 'react'
import { Form, Input, InputNumber, Button, Upload, message } from 'antd'
import type { RcFile, UploadFile } from 'antd/es/upload/interface'
import { UploadOutlined } from '@ant-design/icons'
import { Product } from '@/types'

interface Props {
  onAddProduct: (product: Product & { imageFile: File }) => void
}

// Form değerleri için tip
interface ProductFormValues {
  name: string
  price: number
  stock: number
}

const ProductForm = ({ onAddProduct }: Props) => {
  const [form] = Form.useForm<ProductFormValues>()
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const onFinish = (values: ProductFormValues) => {
    if (fileList.length === 0) {
      message.error('Lütfen bir ürün fotoğrafı seçin')
      return
    }

    const imageFile = fileList[0].originFileObj as RcFile

    // Parent component’e veriyi gönder
    onAddProduct({
      ...values,
      imageFile,
    })

    form.resetFields()
    setFileList([])
    message.success('Form başarıyla gönderildi!')
  }

  const handleBeforeUpload = (file: RcFile) => {
    setFileList([{ uid: file.uid, name: file.name, status: 'done', originFileObj: file }])
    return false // otomatik upload'u engelle
  }

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Ürün Adı"
        name="name"
        rules={[{ required: true, message: 'Lütfen ürün adını girin' }]}
      >
        <Input placeholder="Ürün Adı" />
      </Form.Item>

      <Form.Item
        label="Fiyat"
        name="price"
        rules={[{ required: true, message: 'Lütfen fiyat girin' }]}
      >
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="Stok"
        name="stock"
        rules={[{ required: true, message: 'Lütfen stok adedi girin' }]}
      >
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="Ürün Fotoğrafı">
        <Upload
          beforeUpload={handleBeforeUpload}
          fileList={fileList}
          onRemove={() => setFileList([])}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Fotoğraf Seç</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Ürün Ekle
        </Button>
      </Form.Item>
    </Form>
  )
}

export default ProductForm
