'use client'
import { Table, Image, Button, Popconfirm, Space, Dropdown, Checkbox, MenuProps, Input } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useState, useMemo } from 'react'
import { FilterOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'

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
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    inStock: false,
    outOfStock: false,
  })
  const [search, setSearch] = useState('')

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

  // ✅ Checkbox filtreleme + arama mantığı
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // stok filtreleri
    if (filters.inStock && !filters.outOfStock) {
      result = result.filter((p) => p.stock > 0)
    } else if (!filters.inStock && filters.outOfStock) {
      result = result.filter((p) => p.stock === 0)
    }

    // arama filtreleri
    if (search.trim() !== '') {
      const s = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.price.toString().includes(s)
      )
    }

    return result.reverse()
  }, [products, filters, search])

  const handleAddProductClick = () => {
    router.push('/user/products/addProduct')
  }

  // ✅ Dropdown menüsü
  const filterMenu: MenuProps = {
    items: [
      {
        key: 'inStock',
        label: (
          <Checkbox
            checked={filters.inStock}
            onChange={(e) =>
              setFilters({ inStock: e.target.checked, outOfStock: false })
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
              setFilters({ outOfStock: e.target.checked, inStock: false })
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
    {
      title: 'Ürün Adı',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <div
          style={{
            maxWidth: 250,
            whiteSpace: 'normal',
            wordBreak: 'break-word',
          }}
        >
          {name}
        </div>
      ),
    },
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
    <div className="product-list">
      <div className="product-list__header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div className="header-buttons" style={{ display: 'flex', gap: 8 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddProductClick}
          >
            Ürün Ekle
          </Button>

          <Dropdown menu={filterMenu} trigger={['click']} placement="bottomRight">
            <Button icon={<FilterOutlined />} style={{ backgroundColor: '#fff' }}>
              Filtrele
            </Button>
          </Dropdown>

          <Input
            placeholder="Ürün adı veya fiyat ara"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
        </div>
      </div>

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
