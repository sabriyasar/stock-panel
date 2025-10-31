import { useState } from 'react'
import ProductForm from '../components/ProductForm'
import ProductList from '../components/ProductList'

interface Product {
  name: string
  price: number
  stock: number
}

const AddProductPage = () => {
  const [products, setProducts] = useState<Product[]>([])

  const handleAddProduct = (product: Product) => {
    setProducts([...products, product])
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Ürün Ekle</h1>
      <ProductForm onAddProduct={handleAddProduct} />
      <h2>Ürün Listesi</h2>
      <ProductList products={products} />
    </div>
  )
}

export default AddProductPage
