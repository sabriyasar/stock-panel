'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Form, Input, Button, message } from 'antd'
import { MailOutlined, LockOutlined } from '@ant-design/icons'
import axios, { AxiosError } from 'axios'
import { io } from 'socket.io-client'
import { decodeJWT } from '@/utils/jwt'

const socket = io(process.env.NEXT_PUBLIC_API_URL)

export default function UserLoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('userToken')
    if (token) {
      const decoded = decodeJWT(token)
      if (decoded && decoded.exp * 1000 > Date.now()) {
        router.push('/dashboard') // token geçerli → direkt dashboard
      } else {
        localStorage.removeItem('userToken')
        localStorage.removeItem('userInfo')
      }
    }
  }, [router])

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true)
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/auth/login`,
        values,
        { headers: { 'Content-Type': 'application/json' } }
      )

      const { token, user } = res.data

      // Token decode kontrolü
      const decoded = decodeJWT(token)
      if (!decoded) throw new Error('Geçersiz token')

      // LocalStorage’a kaydet
      localStorage.setItem('userToken', token)
      localStorage.setItem('userInfo', JSON.stringify(user))

      // Kullanıcı çevrimiçi event’i gönder
      socket.emit('user_online', user._id)

      message.success('Giriş başarılı')
      router.push('/dashboard')
    } catch (err) {
      const error = err as AxiosError<{ error?: string }>
      console.error('Login başarısız:', error)
      message.error(error.response?.data?.error || (err instanceof Error ? err.message : 'Email veya şifre hatalı'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #e0e7ff, #f0f4ff)',
      padding: '0 16px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        background: '#fff',
        borderRadius: 12,
        padding: 32,
        boxShadow: '0 6px 18px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: 16 }}>Kullanıcı Girişi</h2>
        <p style={{ textAlign: 'center', marginBottom: 24, color: '#555' }}>
          Lütfen e-posta ve şifrenizle giriş yapın
        </p>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Email girin' },
              { type: 'email', message: 'Geçerli bir email girin' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="example@email.com" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Şifre"
            rules={[{ required: true, message: 'Şifre girin' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              Giriş Yap
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
