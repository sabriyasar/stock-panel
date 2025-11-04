'use client'
import { Table, Image, Button, Popconfirm, Space, Dropdown, Checkbox, MenuProps } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useState, useMemo } from 'react'
import { FilterOutlined, PlusOutlined } from '@ant-design/icons'

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
  const [filters, setFilters] = useState({
    inStock: false,
    outOfStock: false,
  })

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

  // ✅ Checkbox filtreleme mantığı
  const filteredProducts = useMemo(() => {
    let result = [...products]
    if (filters.inStock && !filters.outOfStock) {
      result = result.filter((p) => p.stock > 0)
    } else if (!filters.inStock && filters.outOfStock) {
      result = result.filter((p) => p.stock === 0)
    } else if (!filters.inStock && !filters.outOfStock) {
      result = result // tüm ürünler
    }
    return result.reverse()
  }, [products, filters])

  // ✅ Dropdown menüsü
  const filterMenu: MenuProps = {
    items: [
      {
        key: 'inStock',
        label: (
          <Checkbox
            checked={filters.inStock}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, inStock: e.target.checked }))
            }
          >
            Stoktakiler
          </Checkbox>
        ),
      },
      {
        key: 'outOfStock',
        label: (
          <Checkbox
            checked={filters.outOfStock}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, outOfStock: e.target.checked }))
            }
          >
            Stoğu Bitenler
          </Checkbox>
        ),
      },
    ],
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
      {/* ✅ Üstteki butonlar */}
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => onEdit({ _id: '', name: '', price: 0, stock: 0 })}
          >
            Ürün Ekle
          </Button>

          <Dropdown menu={filterMenu} trigger={['click']} placement="bottomRight">
            <Button icon={<FilterOutlined />} style={{ backgroundColor: '#fff' }}>
              Filtrele
            </Button>
          </Dropdown>
        </div>
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
