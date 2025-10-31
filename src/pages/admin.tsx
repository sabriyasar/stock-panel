import DashboardLayout from '../components/DashboardLayout'
import { Typography, Card, Row, Col } from 'antd'

const { Title, Paragraph } = Typography

export default function AdminPanel() {
  return (
    <DashboardLayout>
      <Title level={2}>Admin Paneli</Title>
      <Paragraph>Buradan ürün ekleyebilir ve yönetebilirsiniz.</Paragraph>

      <Row gutter={16}>
        <Col span={8}>
          <Card title="Toplam Ürün" bordered={false}>
            120
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Stokta Ürün" bordered={false}>
            85
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Satılan Ürün" bordered={false}>
            35
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  )
}
