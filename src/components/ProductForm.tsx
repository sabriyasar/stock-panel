'use client'

import { useState, useEffect } from 'react'
import { Form, Input, Button, Upload, message, Modal } from 'antd'
import type { RcFile, UploadFile } from 'antd/es/upload/interface'
import { UploadOutlined, QrcodeOutlined } from '@ant-design/icons'
import BarcodeScannerComponent from 'react-qr-barcode-scanner'

export interface Product {
  _id: string
  name: string
  price: number
  stock: number
  image?: string
  barcode?: string
}

interface Props {
  product?: Product
  onAddProduct: (product: Product & { imageFile?: File }) => void
  isEdit?: boolean
}

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
  const [priceInput, setPriceInput] = useState<string>('')

  // ⚙️ Formu doldur - React 19 uyarısına uygun hale getirildi
  useEffect(() => {
    if (product) {
      // React’in önerisine göre state set işlemini mikrotask’a erteledik
      queueMicrotask(() => {
        form.setFieldsValue({
          name: product.name,
          stock: product.stock,
          barcode: product.barcode || '',
        })

        setPriceInput(product.price.toString().replace('.', ','))

        if (product.image) {
          setFileList([
            {
              uid: '-1',
              name: 'image.jpg',
              status: 'done',
              url: product.image,
            },
          ])
        }
      })
    }
  }, [product, form])

  const handleBeforeUpload = (file: RcFile) => {
    setFileList([{ uid: file.uid, name: file.name, status: 'done', originFileObj: file }])
    return false
  }

  // ✅ Tip düzeltildi, any kaldırıldı
  const onFinish = (values: ProductFormValues) => {
    const imageFile = fileList[0]?.originFileObj as RcFile | undefined

    // Fiyat virgül veya noktalı olabilir
    const numericPrice = parseFloat(priceInput.replace(',', '.'))

    onAddProduct({
      ...values,
      price: numericPrice,
      _id: product?._id ?? '',
      imageFile,
    })

    if (!isEdit) {
      form.resetFields()
      setFileList([])
      setPriceInput('')
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
          required
          tooltip="Virgül veya nokta kullanabilirsiniz (örn: 12,50)"
        >
          <Input
            type="text"
            value={priceInput}
            onChange={(e) => {
              const value = e.target.value
              // Sadece rakam, nokta ve virgül izinli
              if (/^[0-9.,]*$/.test(value)) {
                setPriceInput(value)
              }
            }}
            placeholder="örn: 12,50 veya 12.50"
          />
        </Form.Item>

        <Form.Item
          label="Stok"
          name="stock"
          rules={[{ required: true, message: 'Lütfen stok adedi girin' }]}
        >
          <Input type="number" min={0} />
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
