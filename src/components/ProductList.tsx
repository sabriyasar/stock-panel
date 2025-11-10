'use client'

import { Table, Image, Button, Popconfirm, Space, Dropdown, Checkbox, MenuProps, Input } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useState, useMemo } from 'react'
import { FilterOutlined, PlusOutlined, SearchOutlined, CopyOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import axios from 'axios'

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
  const api = process.env.NEXT_PUBLIC_API_URL

  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({ inStock: false, outOfStock: false })
  const [search, setSearch] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [creatingCatalog, setCreatingCatalog] = useState(false)
  const [catalogLink, setCatalogLink] = useState<string | null>(null)

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

  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (filters.inStock && !filters.outOfStock) result = result.filter((p) => p.stock > 0)
    else if (!filters.inStock && filters.outOfStock) result = result.filter((p) => p.stock === 0)

    if (search.trim() !== '') {
      const s = search.toLowerCase()
      result = result.filter(
        (p) => p.name.toLowerCase().includes(s) || p.price.toString().includes(s)
      )
    }

    return result.reverse()
  }, [products, filters, search])

  const handleAddProductClick = () => {
    router.push('/user/products/addProduct')
  }

  const filterMenu: MenuProps = {
    items: [
      {
        key: 'inStock',
        label: (
          <Checkbox
            checked={filters.inStock}
            onChange={(e) => setFilters({ inStock: e.target.checked, outOfStock: false })}
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
            onChange={(e) => setFilters({ outOfStock: e.target.checked, inStock: false })}
          >
            Stoğu Bitenler
          </Checkbox>
        ),
      },
    ],
  }

  const handleSelectForCatalog = (id: string, checked: boolean) => {
    setSelectedProducts((prev) => (checked ? [...prev, id] : prev.filter((pId) => pId !== id)))
  }

  const handleCreateCatalog = async () => {
    if (selectedProducts.length === 0) {
      alert('Lütfen en az bir ürün seçin')
      return
    }
    setCreatingCatalog(true)
    try {
      const res = await axios.post(
        `${api}/api/catalogs`,
        { productIds: selectedProducts },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` },
          withCredentials: true,
        }
      )
      const uuid = res.data.uuid
      setCatalogLink(`${window.location.origin}/catalog/${uuid}`)
    } catch (err) {
      console.error(err)
      alert('Katalog oluşturulamadı')
    } finally {
      setCreatingCatalog(false)
    }
  }

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link)
    alert('Katalog linki kopyalandı!')
  }

  const columns: ColumnsType<Product> = [
    {
      title: 'Seç',
      key: 'select',
      render: (_: Product, record: Product) => (
        <Checkbox
          checked={selectedProducts.includes(record._id)}
          onChange={(e) => handleSelectForCatalog(record._id, e.target.checked)}
        />
      ),
    },
    {
      title: 'Fotoğraf',
      dataIndex: 'image',
      key: 'image',
      render: (_: string | undefined, record: Product) => (
        <Image
          src={record.image || '/assets/placeholder.jpg'}
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
        <div style={{ maxWidth: 250, whiteSpace: 'normal', wordBreak: 'break-word' }}>{name}</div>
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
        <span style={{ color: stock && stock > 0 ? 'green' : 'red' }}>{stock ?? 0}</span>
      ),
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_: Product, record: Product) => (
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
      <div
        className="product-list__header"
        style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddProductClick}>
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

          <Button type="default" onClick={handleCreateCatalog} disabled={creatingCatalog}>
            {creatingCatalog ? 'Oluşturuluyor...' : 'Katalog Oluştur'}
          </Button>

          <Button type="default" onClick={() => router.push('/catalog/catalogs')}>
            Kataloglarım
          </Button>
        </div>
      </div>

      {catalogLink && (
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <p style={{ margin: 0 }}>Katalog linki:</p>
          <a href={catalogLink} target="_blank" rel="noopener noreferrer">
            {catalogLink}
          </a>
          <Button icon={<CopyOutlined />} onClick={() => handleCopyLink(catalogLink)} />
        </div>
      )}

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
