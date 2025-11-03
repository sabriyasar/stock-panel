'use client'
import Head from 'next/head'
import { useRouter } from 'next/router'
import DashboardLayout from '@/components/DashboardLayout'
import ProductForm, { Product } from '@/components/ProductForm'
import axios from 'axios'

export default function AddProductPage() {
  const router = useRouter()
  const api = process.env.NEXT_PUBLIC_API_URL

  const handleAddProduct = async (product: Product & { imageFile?: File }) => {
    try {
      const formData = new FormData()
      formData.append('name', product.name)
      formData.append('price', product.price.toString())
      formData.append('stock', product.stock.toString())

      // Opsiyonel alanları ekle
      if (product.barcode) formData.append('barcode', product.barcode)
      if (product.imageFile) formData.append('image', product.imageFile)

      const res = await axios.post(`${api}/api/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`, // token eklendi
        },
      })

      console.log('Yeni ürün eklendi:', res.data)
      router.push('/user/products')
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('Ürün ekleme hatası:', err.response?.data || err.message)
        alert('Ürün eklerken hata oluştu: ' + (err.response?.data?.error || err.message))
      } else if (err instanceof Error) {
        console.error(err.message)
        alert('Ürün eklerken hata oluştu: ' + err.message)
      } else {
        console.error(err)
        alert('Ürün eklerken bilinmeyen bir hata oluştu')
      }
    }
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Yeni Ürün Ekle</title>
      </Head>

      <div style={{ maxWidth: 400, margin: '20px auto' }}>
        <ProductForm onAddProduct={handleAddProduct} />
      </div>
    </DashboardLayout>
  )
}
