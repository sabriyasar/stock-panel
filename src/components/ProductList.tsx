'use client'
import { Table, Image, Button, Popconfirm, Space, message } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useState } from 'react'

// ✅ Product tipi
export interface Product {
  _id: string
  name: string
  price: number
  stock: number
  image?: {
    data: string // base64 string
    contentType: string
  }
}

// ✅ Props tipi (onDelete ve onEdit eklendi)
interface Props {
  products: Product[]
  onDelete: (id: string) => void
  onEdit: (product: Product) => void
}

const ProductList = ({ products, onDelete, onEdit }: Props) => {
  const [loading, setLoading] = useState(false)

  const handleDelete = (id: string) => {
    setLoading(true)
    try {
      onDelete(id)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product: Product) => {
    onEdit(product)
  }

  const columns: ColumnsType<Product> = [
    {
      title: 'Fotoğraf',
      dataIndex: 'image',
      key: 'image',
      render: (image: { data: string; contentType: string } | undefined) => (
        <Image
          src={
            image
              ? `data:${image.contentType};base64,${image.data}`
              : '/assets/placeholder.jpg'
          }
          width={60}
          fallback="/assets/placeholder.jpg"
        />
      ),
    },
    {
      title: 'Ürün Adı',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Fiyat',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${price.toLocaleString('tr-TR')} ₺`,
    },
    {
      title: 'Stok',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_: unknown, record: Product) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>
            Düzenle
          </Button>
          <Popconfirm
            title="Bu ürünü silmek istediğinizden emin misiniz?"
            onConfirm={() => handleDelete(record._id)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button type="primary" danger>
              Sil
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Table
      dataSource={products}
      columns={columns}
      rowKey={(record) => record._id}
      pagination={false}
      loading={loading}
    />
  )
}

export default ProductList