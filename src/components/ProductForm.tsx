'use client'

import { useState, useEffect } from 'react'
import { Form, Input, InputNumber, Button, Upload, message, Modal } from 'antd'
import type { RcFile, UploadFile } from 'antd/es/upload/interface'
import { UploadOutlined, QrcodeOutlined } from '@ant-design/icons'
import BarcodeScannerComponent from 'react-qr-barcode-scanner'

// ✅ Product tipi (frontend tüm komponentlerde uyumlu)
export interface Product {
  _id: string
  name: string
  price: number
  stock: number
  image?: string // artık string, direkt data URL
  barcode?: string
}

// ✅ Props tipi
interface Props {
  product?: Product
  onAddProduct: (product: Product & { imageFile?: File }) => void
  isEdit?: boolean
}

// ✅ Form değerleri tipi
interface ProductFormValues {
  name: string
  price: number
  stock: number
  barcode?: string
}

const ProductForm = ({ product, onAddProduct, isEdit }: Props) => {
  const [form] = Form.useForm<ProductFormValues>()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [scannerVisible, setScannerVisible] = useState(false)

  // Formu edit moduna göre doldur
  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        name: product.name,
        price: product.price,
        stock: product.stock,
        barcode: product.barcode || '',
      })

      if (product.image) {
        setTimeout(() => {
          setFileList([
            {
              uid: '-1',
              name: 'image.jpg',
              status: 'done',
              url: product.image,
            },
          ])
        }, 0)
      }
    }
  }, [product, form])

  const handleBeforeUpload = (file: RcFile) => {
    setFileList([{ uid: file.uid, name: file.name, status: 'done', originFileObj: file }])
    return false
  }

  const onFinish = (values: ProductFormValues) => {
    const imageFile = fileList[0]?.originFileObj as RcFile | undefined

    // Barcode ve image artık opsiyonel
    onAddProduct({
      ...values,
      _id: product?._id ?? '',
      imageFile,
    })

    if (!isEdit) {
      form.resetFields()
      setFileList([])
      message.success('Form başarıyla gönderildi!')
    }
  }

  return (
    <>
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

        <Form.Item
          label={
            <span>
              Barkod{' '}
              <Button
                type="link"
                icon={<QrcodeOutlined />}
                onClick={() => setScannerVisible(true)}
              >
                Kameradan okut
              </Button>
            </span>
          }
          name="barcode"
        >
          <Input placeholder="Barkod" />
        </Form.Item>

        <Form.Item label="Ürün Fotoğrafı">
          <Upload
            beforeUpload={handleBeforeUpload}
            fileList={fileList}
            onRemove={() => setFileList([])}
            maxCount={1}
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>
              {isEdit ? 'Fotoğraf Değiştir' : 'Fotoğraf Seç'}
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {isEdit ? 'Güncelle' : 'Ürün Ekle'}
          </Button>
        </Form.Item>
      </Form>

      <Modal
        title="Barkodu okut"
        open={scannerVisible}
        onCancel={() => setScannerVisible(false)}
        footer={null}
      >
        <BarcodeScannerComponent
          width={300}
          height={300}
          onUpdate={(err, result) => {
            if (result) {
              setScannerVisible(false)
              const barcodeValue = result.getText()
              form.setFieldValue('barcode', barcodeValue)
              message.success('Barkod okundu: ' + barcodeValue)

              const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg')
              audio.play()
            }
          }}
        />
      </Modal>
    </>
  )
}

export default ProductForm
