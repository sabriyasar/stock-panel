'use client'
import DashboardLayout from '@/components/DashboardLayout'
import { Typography, Card, Row, Col, message } from 'antd'
import { useEffect, useState } from 'react'
import axios from 'axios'

const { Title, Paragraph } = Typography

interface Stats {
  totalProducts: number
  inStock: number
  outOfStock: number
}

export default function UserPanel() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    inStock: 0,
    outOfStock: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const api = process.env.NEXT_PUBLIC_API_URL
        const res = await axios.get(`${api}/api/users/stats/products`)
        setStats(res.data)
      } catch (err) {
        console.error(err)
        message.error('Ürün istatistikleri alınamadı')
      }
    }

    fetchStats()
  }, [])

  return (
    <DashboardLayout>
      <Title level={2}>Kullanıcı Paneli</Title>
      <Paragraph>Buradan ürünleri görebilir ve yönetebilirsiniz.</Paragraph>

      <Row gutter={16}>
        <Col span={8}>
          <Card title="Toplam Ürün" bordered={false}>
            {stats.totalProducts}
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Stokta Ürün" bordered={false}>
            {stats.inStock}
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Stoğu Biten Ürün" bordered={false}>
            {stats.outOfStock}
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  )
}
