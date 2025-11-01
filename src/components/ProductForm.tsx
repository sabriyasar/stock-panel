'use client'
import { useState, useEffect } from 'react'
import { Form, Input, InputNumber, Button, Upload, message } from 'antd'
import type { RcFile, UploadFile } from 'antd/es/upload/interface'
import { UploadOutlined } from '@ant-design/icons'

// ✅ Product tipi (sadece burada tanımlı)
export interface Product {
  _id: string
  name: string
  price: number
  stock: number
  image?: string
}

// ✅ Props tipi
interface Props {
  product?: Product                 // Düzenleme için mevcut ürün
  onAddProduct: (product: Product & { imageFile?: File }) => void
  isEdit?: boolean
}

// ✅ Form değerleri için tip
interface ProductFormValues {
  name: string
  price: number
  stock: number
}

// ✅ ProductForm bileşeni
const ProductForm = ({ product, onAddProduct, isEdit }: Props) => {
  const [form] = Form.useForm<ProductFormValues>()
  const [fileList, setFileList] = useState<UploadFile[]>([])

  // Edit modunda formu doldur
  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        name: product.name,
        price: product.price,
        stock: product.stock,
      })
    }
  }, [product, form])

  const onFinish = (values: ProductFormValues) => {
    const imageFile = fileList[0]?.originFileObj as RcFile | undefined

    // Parent component’e veriyi gönder
    onAddProduct({
      ...values,
      _id: product?._id ?? '', // edit modunda _id ekle
      imageFile,               // opsiyonel
    })

    if (!isEdit) {
      form.resetFields()
      setFileList([])
      message.success('Form başarıyla gönderildi!')
    }
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
          <Button icon={<UploadOutlined />}>{isEdit ? 'Fotoğraf Değiştir' : 'Fotoğraf Seç'}</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          {isEdit ? 'Güncelle' : 'Ürün Ekle'}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default ProductForm
