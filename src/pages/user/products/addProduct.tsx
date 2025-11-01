'use client'
import Head from 'next/head'
import { useRouter } from 'next/router'
import DashboardLayout from '@/components/DashboardLayout'
import ProductForm, { Product } from '@/components/ProductForm' // <-- Product tipini buradan al

export default function AddProductPage() {
  const router = useRouter()
  const api = process.env.NEXT_PUBLIC_API_URL

  const handleAddProduct = async (product: Product & { imageFile?: File }) => {
    if (!product.imageFile) {
      alert('Lütfen bir ürün fotoğrafı seçin')
      return
    }

    try {
      const formData = new FormData()
      formData.append('name', product.name)
      formData.append('price', product.price.toString())
      formData.append('stock', product.stock.toString())
      formData.append('image', product.imageFile)

      const res = await fetch(`${api}/api/products`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        throw new Error(`Sunucu hatası: ${res.status}`)
      }

      const data = await res.json()
      console.log('Yeni ürün eklendi:', data)
      router.push('/user/products')
    } catch (err: unknown) {
      if (err instanceof Error) {
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
