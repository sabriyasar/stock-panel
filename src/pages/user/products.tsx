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
  const [token, setToken] = useState<string | null>(null)
  const [checkedToken, setCheckedToken] = useState(false) // token kontrol flag

  // ✅ Client-side token al
  useEffect(() => {
    const t = localStorage.getItem('token')
    if (!t) {
      setToken(null)
    } else {
      setToken(t)
    }
    setCheckedToken(true)
  }, [])

  // ✅ Token hazır olunca ürünleri fetch et
  useEffect(() => {
    if (!checkedToken) return // token kontrol edilmediyse bekle
    if (!token) return // token yoksa fetch etme

    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setProducts(res.data as Product[])
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) setError(err.response?.data?.error || err.message)
        else if (err instanceof Error) setError(err.message)
        else setError('Bilinmeyen bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [token, checkedToken])

  if (!checkedToken || loading) {
    return (
      <DashboardLayout>
        <p>Yükleniyor...</p>
      </DashboardLayout>
    )
  }

  if (!token) {
    return (
      <DashboardLayout>
        <p style={{ color: 'red' }}>Lütfen giriş yapın.</p>
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

  const handleAddProductClick = () => {
    router.push('/user/products/addProduct')
  }

  const handleDeleteProduct: ProductListCallbacks['onDelete'] = async (id) => {
    if (!token) return
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

  const handleEditProduct: ProductListCallbacks['onEdit'] = (product) => {
    router.push(`/user/products/editProduct/${product._id}`)
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
