import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import ProductList, { Product } from '@/components/ProductList'
import axios from 'axios'
import { API_URL } from '@/utils/api' // <-- API_URL import

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const handleAddProductClick = () => {
    router.push('/admin/products/addProduct') // Path prod ve local uyumlu
  }

  // Backend'den ürünleri çek
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get<Product[]>(`${API_URL}/api/products`) // <-- API_URL kullan
        setProducts(res.data)
      } catch (err) {
        console.error('Ürünler alınamadı:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <DashboardLayout>
        <p>Yükleniyor...</p>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Ürünler</title>
      </Head>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Ürün ekleme butonu */}
        <button
          style={{
            padding: '8px 16px',
            backgroundColor: '#1890ff',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            alignSelf: 'flex-start',
          }}
          onClick={handleAddProductClick}
        >
          Ürün Ekle
        </button>

        {/* Ürün listesi */}
        <ProductList products={products} />
      </div>
    </DashboardLayout>
  )
}
