import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Form, Input, Button, Typography, message } from 'antd'
import api from '@/services/api'
import { AxiosError } from 'axios'

const { Title, Text } = Typography

interface LoginValues {
  email: string
  password: string
}

interface LoginResponse {
  token: string
  user: {
    name: string
    email: string
    role?: string
  }
}

export default function UserLoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('userToken')
    if (token) router.push('/user/dashboard')
  }, [router])

  const onFinish = async (values: LoginValues) => {
    setLoading(true)
    try {
      const res = await api.post<LoginResponse>('/api/users/auth/login', values)
      const { token, user } = res.data
      localStorage.setItem('userToken', token)
      localStorage.setItem('userInfo', JSON.stringify(user))
      message.success('Giriş başarılı')
      router.push('/user/dashboard')
    } catch (error) {
      const err = error as AxiosError<{ error?: string }>
      console.error(err)
      message.error(err.response?.data?.error || 'Email veya şifre hatalı')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="user-login-page" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #e0e7ff, #f0f4ff)',
      padding: '0 16px'
    }}>
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          background: '#fff',
          borderRadius: 12,
          padding: 32,
          boxShadow: '0 6px 18px rgba(0,0,0,0.1)'
        }}
      >
        <Title level={2} style={{ textAlign: 'center', marginBottom: 16 }}>
          Kullanıcı Girişi
        </Title>
        <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 24 }}>
          Lütfen e-posta ve şifrenizle giriş yapın
        </Text>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Email girin' },
              { type: 'email', message: 'Geçerli bir email girin' }
            ]}
          >
            <Input size="large" placeholder="example@email.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Şifre"
            rules={[{ required: true, message: 'Şifre girin' }]}
          >
            <Input.Password size="large" placeholder="••••••••" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              style={{ marginTop: 8 }}
            >
              Giriş Yap
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
