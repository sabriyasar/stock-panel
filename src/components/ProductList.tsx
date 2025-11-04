'use client'
import { Table, Image, Button, Popconfirm, Space, Select } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useState, useMemo } from 'react'

export interface Product {
  _id: string
  name: string
  price: number
  stock: number
  image?: string
}

interface Props {
  products: Product[]
  onDelete: (id: string) => void
  onEdit: (product: Product) => void
}

const ProductList = ({ products, onDelete, onEdit }: Props) => {
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all')

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

  // ✅ Ürünleri hem filtrele hem ters sırala
  const filteredProducts = useMemo(() => {
    let result = [...products]
    if (filter === 'inStock') result = result.filter((p) => p.stock > 0)
    else if (filter === 'outOfStock') result = result.filter((p) => p.stock === 0)
    return result.reverse() // En son eklenen en üstte
  }, [products, filter])

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
      render: (stock?: number) => (
        <span style={{ color: stock && stock > 0 ? 'green' : 'red' }}>
          {stock ?? 0}
        </span>
      ),
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
    <div>
      {/* ✅ Filtre Seçimi */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Select
          value={filter}
          onChange={(value) => setFilter(value)}
          style={{ width: 200 }}
          options={[
            { value: 'all', label: 'Tüm Ürünler' },
            { value: 'inStock', label: 'Stoktakiler' },
            { value: 'outOfStock', label: 'Stoğu Bitenler' },
          ]}
        />
      </div>

      {/* ✅ Ürün Tablosu */}
      <Table
        dataSource={filteredProducts}
        columns={columns}
        rowKey={(record) => record._id}
        pagination={false}
        loading={loading}
      />
    </div>
  )
}

export default ProductList
