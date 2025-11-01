'use client'
import { Table, Image, Button, Popconfirm, Space, message } from 'antd'
import axios from 'axios'
import { useState } from 'react'

export interface Product {
  _id: string
  name: string
  price: number
  stock: number
  image?: string
}

interface Props {
  products: Product[]
  onRefresh: () => Promise<void> // ✅ dışarıdan tabloyu yenilemek için callback
}

const ProductList = ({ products, onRefresh }: Props) => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL
  const [loading, setLoading] = useState(false)

  // ✅ Ürün silme işlemi
  const handleDelete = async (id: string) => {
    try {
      setLoading(true)
      await axios.delete(`${backendUrl}/api/products/${id}`)
      message.success('Ürün başarıyla silindi')
      await onRefresh() // tabloyu yenile
    } catch (err) {
      console.error(err)
      message.error('Ürün silinirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  // ✅ Ürün düzenleme işlemi (örnek olarak fiyat + stok güncelleme)
  const handleEdit = async (product: Product) => {
    try {
      const newName = prompt('Yeni ürün adı:', product.name)
      const newPrice = prompt('Yeni fiyat:', String(product.price))
      const newStock = prompt('Yeni stok:', String(product.stock))
      if (!newName || !newPrice || !newStock) return

      setLoading(true)
      await axios.put(`${backendUrl}/api/products/${product._id}`, {
        name: newName,
        price: Number(newPrice),
        stock: Number(newStock),
      })
      message.success('Ürün başarıyla güncellendi')
      await onRefresh()
    } catch (err) {
      console.error(err)
      message.error('Ürün güncellenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      title: 'Fotoğraf',
      dataIndex: 'image',
      key: 'image',
      render: (image: string | undefined) =>
        image ? (
          <Image
            src={`${backendUrl}/uploads/${image}`}
            width={60}
            fallback="/assets/placeholder.jpg"
          />
        ) : (
          <Image src="/assets/placeholder.jpg" width={60} />
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
