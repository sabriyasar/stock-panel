import { useState } from 'react'
import Head from 'next/head'
import { Form, Input, Button, Typography, message } from 'antd'
import { useRouter } from 'next/router'

const { Title } = Typography

const ADMIN_EMAIL = 'admin@domain.com'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onFinish = (values: { email: string; password: string }) => {
    setLoading(true)
    setTimeout(() => {
      if (values.email === ADMIN_EMAIL) {
        message.success('Giriş başarılı! Yönlendiriliyorsunuz...')
        // 1 saniye sonra admin paneline yönlendirme
        setTimeout(() => {
          router.push('/admin')
        }, 1000)
      } else {
        message.error('Geçersiz email veya parola')
      }
      setLoading(false)
    }, 500)
  }

  return (
    <>
      <Head>
        <title>Admin Giriş</title>
        <meta name="description" content="Admin Login Page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f0f2f5',
        }}
      >
        <div
          style={{
            padding: 40,
            backgroundColor: '#fff',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            width: 400,
          }}
        >
          <Title level={2} style={{ textAlign: 'center', marginBottom: 30 }}>
            Admin Giriş
          </Title>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Lütfen email girin' },
                { type: 'email', message: 'Geçerli bir email girin' },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
              label="Parola"
              name="password"
              rules={[{ required: true, message: 'Lütfen parola girin' }]}
            >
              <Input.Password placeholder="Parola" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Giriş Yap
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  )
}
