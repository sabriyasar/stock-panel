'use client'
import DashboardLayout from '@/components/DashboardLayout'
import { Typography, Card, Row, Col, message } from 'antd'
import { useEffect, useState } from 'react'
import axios from 'axios'

const { Title, Paragraph } = Typography

interface Stats {
  totalProducts: number    // Başlangıçta eklenen toplam ürün sayısı
  inStock: number
  outOfStock: number
  deleted: number          // Silinen ürün sayısı
}

export default function UserPanel() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    inStock: 0,
    outOfStock: 0,
    deleted: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const api = process.env.NEXT_PUBLIC_API_URL
        const token = localStorage.getItem('userToken') // JWT buradaysa doğru
        if (!token) {
          message.error('Kullanıcı oturumu bulunamadı')
          return
        }

        // ✅ endpoint düzeltildi
        const res = await axios.get(`${api}/api/products/stats/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = res.data
        const deletedCount = data.totalProducts - data.inStock - data.outOfStock
        setStats({ ...data, deleted: deletedCount })
      } catch (err) {
        console.error(err)
        message.error('Ürün istatistikleri alınamadı')
      }
    }

    fetchStats()
  }, [])

  return (
    <DashboardLayout>
<Title level={2} className="panel-title">Kullanıcı Paneli</Title>
<Paragraph className="panel-desc">Buradan ürünleri görebilir ve yönetebilirsiniz.</Paragraph>


      <Row gutter={16}>
        <Col span={6}>
          <Card title="Toplam Ürün" bordered={false}>
            {stats.totalProducts}
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Stokta Ürün" bordered={false}>
            {stats.inStock}
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Stoğu Biten Ürün" bordered={false}>
            {stats.outOfStock}
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Silinen Ürün" bordered={false}>
            {stats.deleted}
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  )
}
