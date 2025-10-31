import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import ProductList, { Product } from '@/components/ProductList'

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleAddProductClick = () => {
    router.push('/admin/products/addProduct')
  }

  useEffect(() => {
    const fetchProducts = async () => {
      const api = process.env.NEXT_PUBLIC_API_URL
      try {
        const res = await fetch(`${api}/api/products`)
        if (!res.ok) {
          const errData = await res.json()
          throw new Error(errData.error || 'Ürünler alınamadı')
        }
        const data = await res.json()
        setProducts(data as Product[])
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Bilinmeyen bir hata oluştu')
        }
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

  if (error) {
    return (
      <DashboardLayout>
        <p style={{ color: 'red' }}>Hata: {error}</p>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Ürünler</title>
      </Head>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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

        <ProductList products={products} />
      </div>
    </DashboardLayout>
  )
}
