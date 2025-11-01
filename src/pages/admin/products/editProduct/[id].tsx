// src/pages/admin/products/[id].tsx (EditProductPage)
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import ProductForm from '@/components/ProductForm'
import { Product } from '@/components/ProductList'

export default function EditProductPage() {
  const router = useRouter()
  const { id } = router.query

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const api = process.env.NEXT_PUBLIC_API_URL
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${api}/api/products/${id}`)
        if (!res.ok) {
          const errData = await res.json()
          throw new Error(errData.error || 'Ürün alınamadı')
        }
        const data = await res.json()
        setProduct(data)
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message)
        else setError('Bilinmeyen bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleUpdateProduct = async (updated: Product & { imageFile?: File }) => {
    if (!id) return
    const api = process.env.NEXT_PUBLIC_API_URL
    try {
      const formData = new FormData()
      formData.append('name', updated.name)
      formData.append('price', updated.price.toString())
      formData.append('stock', updated.stock.toString())
      if (updated.imageFile) formData.append('image', updated.imageFile)

      const res = await fetch(`${api}/api/products/${id}`, {
        method: 'PUT',
        body: formData,
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Güncelleme başarısız')
      }

      router.push('/admin/products')
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message)
      else alert('Bilinmeyen bir hata oluştu')
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
        <ProductForm product={product} onAddProduct={handleUpdateProduct} isEdit />
      </div>
    </DashboardLayout>
  )
}
