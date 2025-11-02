'use client'
import { Table, Image, Button, Popconfirm, Space } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useState } from 'react'

export interface Product {
  _id: string
  name: string
  price: number
  stock: number
  image?: string // <-- artık string, direkt data URL
}

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
      render: (image: string | undefined) => (
        <Image
          src={image || '/assets/placeholder.jpg'}
          width={60}
          fallback="/assets/placeholder.jpg"
        />
      ),
    },
    { title: 'Ürün Adı', dataIndex: 'name', key: 'name' },
    {
      title: 'Fiyat',
      dataIndex: 'price',
      key: 'price',
      render: (price?: number) => `${(price ?? 0).toLocaleString('tr-TR')} ₺`,
    },
    {
      title: 'Stok',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock?: number) => (stock ?? 0).toLocaleString('tr-TR'),
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
