import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface CatalogProduct {
  _id: string;
  name: string;
  price: number;
  stock: number;
  barcode: string;
  image: string;
}

export default function CatalogPage() {
  const router = useRouter();
  const { uuid } = router.query;
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uuid) return;
  
    const fetchCatalog = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/catalogs/${uuid}`
        );
        setProducts(res.data.products || []);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || 'Katalog alınamadı');
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Bilinmeyen bir hata oluştu');
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchCatalog();
  }, [uuid]);  

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Ürün Kataloğu</h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '20px',
          marginTop: '20px',
        }}
      >
        {products.map((p) => (
          <div
            key={p._id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '10px',
              textAlign: 'center',
            }}
          >
            {p.image && (
              <img
                src={p.image}
                alt={p.name}
                style={{ width: '100%', height: '150px', objectFit: 'contain' }}
              />
            )}
            <h3>{p.name}</h3>
            <p>Fiyat: {p.price}₺</p>
            <p>Stok: {p.stock}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
