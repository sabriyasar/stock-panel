import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import axios from 'axios'
import DashboardLayout from '@/components/DashboardLayout'
import ProductList, { Product } from '@/components/ProductList'
import ProductCatalogCreator from '@/components/ProductCatalogCreator'

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

  // ✅ Ürünleri fetch et (axios + token)
  // ✅ Ürünleri fetch et (axios + token)
useEffect(() => {
  const fetchProducts = async () => {
    const api = process.env.NEXT_PUBLIC_API_URL
    try {
      const res = await axios.get(`${api}/api/products`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`, // burayı düzelt
        },
      })
      setProducts(res.data as Product[])
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Ürünler alınamadı')
      } else if (err instanceof Error) {
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

// ✅ Ürün silme
const handleDeleteProduct: ProductListCallbacks['onDelete'] = async (id) => {
  const api = process.env.NEXT_PUBLIC_API_URL
  try {
    await axios.delete(`${api}/api/products/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`, // burayı düzelt
      },
    })
    setProducts((prev) => prev.filter((p) => p._id !== id))
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      alert(err.response?.data?.error || 'Ürün silinemedi')
    } else if (err instanceof Error) {
      alert(err.message)
    } else {
      alert('Bilinmeyen bir hata oluştu')
    }
  }
}

  // ✅ Ürün düzenleme
  const handleEditProduct: ProductListCallbacks['onEdit'] = (product) => {
    router.push(`/user/products/editProduct/${product._id}`)
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
        <ProductList
          products={products}
          onDelete={handleDeleteProduct}
          onEdit={handleEditProduct}
        />
      </div>
      <ProductCatalogCreator products={products} />
    </DashboardLayout>
  )
}
