'use client'

import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import axios from 'axios'
import DashboardLayout from '@/components/DashboardLayout'
import ProductList, { Product } from '@/components/ProductList'

interface ProductListCallbacks {
  onDelete: (id: string) => void
  onEdit: (product: Product) => void
}

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const token = localStorage.getItem('token') || ''

  // ✅ Ürün ekleme sayfasına yönlendirme
  const handleAddProductClick = () => {
    router.push('/user/products/addProduct')
  }

  // ✅ Ürünleri fetch et
  useEffect(() => {
    const fetchProducts = async () => {
      console.log('🌟 Token gönderiliyor:', token) // 🔹 buraya log ekledik
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        console.log('✅ Backend yanıtı:', res.data) // 🔹 backend'den gelen yanıt
        setProducts(res.data as Product[])
      } catch (err: unknown) {
        console.error('❌ Hata:', err)
        if (axios.isAxiosError(err)) setError(err.response?.data?.error || err.message)
        else if (err instanceof Error) setError(err.message)
        else setError('Bilinmeyen bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }
  
    fetchProducts()
  }, [token])  

  // ✅ Ürün silme
  const handleDeleteProduct: ProductListCallbacks['onDelete'] = async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setProducts((prev) => prev.filter((p) => p._id !== id))
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) alert(err.response?.data?.error || err.message)
      else if (err instanceof Error) alert(err.message)
      else alert('Bilinmeyen bir hata oluştu')
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
