import { Table, Image } from 'antd'

export interface Product {
  name: string
  price: number
  stock: number
  image?: string // opsiyonel fotoğraf alanı
}

interface Props {
  products: Product[]
}

const ProductList = ({ products }: Props) => {
  const columns = [
    {
      title: 'Fotoğraf',
      dataIndex: 'image',
      key: 'image',
      render: (image: string) =>
        image ? <Image src={`http://localhost:5000/uploads/${image}`} width={60} /> : null,
    },
    {
      title: 'Ürün Adı',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Fiyat',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${price.toLocaleString('tr-TR')} ₺`,
    },
    {
      title: 'Stok',
      dataIndex: 'stock',
      key: 'stock',
    },
  ]

  return (
    <Table
      dataSource={products}
      columns={columns}
      rowKey={(record) => record.name + record.price}
      pagination={false}
    />
  )
}

export default ProductList
