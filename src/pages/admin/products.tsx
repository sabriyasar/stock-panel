import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import ProductList, { Product } from '@/components/ProductList'
import axios from 'axios'

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const handleAddProductClick = () => {
    router.push('/admin/addProduct') // Ürün ekleme sayfasına yönlendir
  }

  // Backend'den ürünleri çek
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get<Product[]>('http://localhost:5000/api/products')
        setProducts(res.data)
      } catch (err) {
        console.error('Ürünler alınamadı:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

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
