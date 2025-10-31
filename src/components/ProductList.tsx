import { Table, Image, Button, Popconfirm, Space } from 'antd'

export interface Product {
  _id: string
  name: string
  price: number
  stock: number
  image?: string
}

interface Props {
  products: Product[]
  onEdit?: (product: Product) => void
  onDelete?: (id: string) => void
}

const ProductList = ({ products, onEdit, onDelete }: Props) => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL

  const columns = [
    {
      title: 'Fotoğraf',
      dataIndex: 'image',
      key: 'image',
      render: (image: string | undefined) =>
        image ? (
          <Image
            src={`${backendUrl}/uploads/${image}`}
            width={60}
            fallback="/placeholder.png"
          />
        ) : (
          <Image src="/placeholder.png" width={60} />
        ),
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
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_: unknown, record: Product) => (
        <Space size="middle">
          <Button type="primary" onClick={() => onEdit?.(record)}>
            Düzenle
          </Button>
          <Popconfirm
            title="Bu ürünü silmek istediğinizden emin misiniz?"
            onConfirm={() => onDelete?.(record._id)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button type="primary" danger>
              Sil
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Table
      dataSource={products}
      columns={columns}
      rowKey={(record) => record._id}
      pagination={false}
    />
  )
}

export default ProductList
