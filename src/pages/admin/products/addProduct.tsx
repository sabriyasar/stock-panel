import Head from 'next/head'
import { useRouter } from 'next/router'
import DashboardLayout from '@/components/DashboardLayout'
import ProductForm from '@/components/ProductForm'
import { Product } from '@/types'
import axios from 'axios'

export default function AddProductPage() {
  const router = useRouter()

  const handleAddProduct = async (product: Product & { imageFile: File }) => {
    try {
      const formData = new FormData()
      formData.append('name', product.name)
      formData.append('price', product.price.toString())
      formData.append('stock', product.stock.toString())
      formData.append('image', product.imageFile)

      const res = await axios.post('http://localhost:5000/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }      })

      console.log('Yeni ürün eklendi:', res.data)

      // Başarılı eklemeden sonra listeye dön
      router.push('/admin/products')
    } catch (err) {
      console.error(err)
      alert('Ürün eklerken hata oluştu')
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
