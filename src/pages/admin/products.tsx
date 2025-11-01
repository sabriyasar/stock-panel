import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import ProductList, { Product } from '@/components/ProductList'

// ✅ ProductList için callback tipleri
interface ProductListCallbacks {
  onDelete: (id: string) => void
  onEdit: (product: Product) => void
}

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // ✅ Ürün ekleme sayfasına yönlendirme
  const handleAddProductClick = () => {
    router.push('/admin/products/addProduct')
  }

  // ✅ Ürünleri fetch et
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
        if (err instanceof Error) setError(err.message)
        else setError('Bilinmeyen bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // ✅ Ürün silme
  const handleDeleteProduct: ProductListCallbacks['onDelete'] = async (id) => {
    const api = process.env.NEXT_PUBLIC_API_URL
    try {
      const res = await fetch(`${api}/api/products/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Ürün silinemedi')
      }
      setProducts((prev) => prev.filter((p) => p._id !== id))
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message)
      else alert('Bilinmeyen bir hata oluştu')
    }
  }

  // ✅ Ürün düzenleme
  const handleEditProduct: ProductListCallbacks['onEdit'] = (product) => {
    router.push(`/admin/products/editProduct/${product._id}`)
  }

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

        <ProductList
          products={products}
          onDelete={handleDeleteProduct}
          onEdit={handleEditProduct}
        />
      </div>
    </DashboardLayout>
  )
}
