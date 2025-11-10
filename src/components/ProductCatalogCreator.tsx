'use client'
import { useState } from 'react'
import axios from 'axios'
import { Product } from './ProductList'

interface Props {
  products: Product[]
}

export default function ProductCatalogCreator({ products }: Props) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [creating, setCreating] = useState(false)
  const [catalogLink, setCatalogLink] = useState<string | null>(null)

  const handleSelect = (id: string, checked: boolean) => {
    setSelectedProducts((prev) =>
      checked ? [...prev, id] : prev.filter((pId) => pId !== id)
    )
  }

  const handleCreateCatalog = async () => {
    if (selectedProducts.length === 0) {
      alert('Lütfen en az bir ürün seçin')
      return
    }

    setCreating(true)
    try {
      const res = await axios.post(
        '/api/catalogs',
        { productIds: selectedProducts },
        { headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` } }
      )
      console.log('Katalog oluşturma yanıtı:', res.data)
      const uuid = res.data.uuid
      setCatalogLink(`${window.location.origin}/catalog/${uuid}`)
    } catch (err) {
      console.error(err)
      alert('Katalog oluşturulamadı')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div style={{ marginTop: '40px' }}>
      <h2>Ürünlerden Katalog Oluştur</h2>

      <div style={{ marginBottom: '20px' }}>
        {products.map((product) => (
          <div key={product._id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <input
              type="checkbox"
              checked={selectedProducts.includes(product._id)}
              onChange={(e) => handleSelect(product._id, e.target.checked)}
            />
            {product.name} - {product.price}₺
          </div>
        ))}
      </div>

      <button onClick={handleCreateCatalog} disabled={creating}>
        {creating ? 'Oluşturuluyor...' : 'Katalog Oluştur'}
      </button>

      {catalogLink && (
        <div style={{ marginTop: '20px' }}>
          <p>Katalog linki:</p>
          <a href={catalogLink} target="_blank" rel="noopener noreferrer">
            {catalogLink}
          </a>
        </div>
      )}
    </div>
  )
}
