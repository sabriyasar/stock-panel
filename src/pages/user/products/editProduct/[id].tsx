'use client'

import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import ProductForm from '@/components/ProductForm'
import axios, { AxiosError } from 'axios'

// ✅ Product tipi (ProductList ile uyumlu)
export interface Product {
  _id: string
  name: string
  price: number
  stock: number
  image?: string
  barcode?: string
}

export default function EditProductPage() {
  const router = useRouter()
  const { id } = router.query

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const api = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('userToken')

    const fetchProduct = async () => {
      try {
        const res = await axios.get<Product>(`${api}/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setProduct(res.data)
      } catch (err) {
        const axiosError = err as AxiosError<{ error?: string }>
        setError(
          axiosError.response?.data?.error ||
            axiosError.message ||
            'Ürün alınamadı'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  // ✅ Ürün güncelleme callback’i
  const handleUpdateProduct = async (updated: Product & { imageFile?: File }) => {
    if (!id) return
    const api = process.env.NEXT_PUBLIC_API_URL
    const token = localStorage.getItem('userToken')

    try {
      const formData = new FormData()
      formData.append('name', updated.name)
      formData.append('price', updated.price.toString())
      formData.append('stock', updated.stock.toString())
      if (updated.barcode) formData.append('barcode', updated.barcode)
      if (updated.imageFile) formData.append('image', updated.imageFile)

      await axios.put(`${api}/api/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })

      router.push('/user/products')
    } catch (err) {
      const axiosError = err as AxiosError<{ error?: string }>
      alert(
        axiosError.response?.data?.error ||
          axiosError.message ||
          'Güncelleme başarısız'
      )
    }
  }

  if (loading) return <DashboardLayout><p>Yükleniyor...</p></DashboardLayout>
  if (error) return <DashboardLayout><p style={{ color: 'red' }}>Hata: {error}</p></DashboardLayout>
  if (!product) return null

  return (
    <DashboardLayout>
      <Head>
        <title>Ürün Düzenle</title>
      </Head>

      <div style={{ maxWidth: 400, margin: '20px auto' }}>
        <ProductForm
          product={product}
          onAddProduct={handleUpdateProduct}
          isEdit
        />
      </div>
    </DashboardLayout>
  )
}
