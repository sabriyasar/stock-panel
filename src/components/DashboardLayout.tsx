import { useState, useEffect } from 'react'
import {
  MenuOutlined,
  CloseOutlined,
  LeftOutlined,
  RightOutlined,
  DashboardOutlined,
  ShoppingOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface Props {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const router = useRouter()

  const toggleMobileSidebar = () => setMobileOpen(!mobileOpen)
  const closeSidebar = () => setMobileOpen(false)
  const toggleCollapse = () => setCollapsed(!collapsed)

  // Token kontrolü
  useEffect(() => {
    const token = localStorage.getItem('userToken')
    const userInfo = localStorage.getItem('userInfo')
  
    if (!token || !userInfo) {
      router.push('/login')
    } else {
      // Mikro task ile async yapıyoruz
      Promise.resolve().then(() => setUser(JSON.parse(userInfo)))
    }
  }, [router])  

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
      if (window.innerWidth > 768) setMobileOpen(false)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('userToken')
    localStorage.removeItem('userInfo')
    router.push('/login')
  }

  return (
    <div className={`dashboard-container ${collapsed ? 'collapsed' : ''}`}>
      {/* Sidebar */}
      <div className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        {isMobile && (
          <div className="sidebar-header">
            <CloseOutlined className="close-icon" onClick={closeSidebar} />
          </div>
        )}
        {!isMobile && <div className="logo">Kullanıcı Paneli</div>}

        <ul>
          <li className={router.pathname === '/user' ? 'active' : ''}>
            <Link href="/user">
              <DashboardOutlined className="icon" />
              <span className="text">Dashboard</span>
            </Link>
          </li>
          <li className={router.pathname === '/user/products' ? 'active' : ''}>
            <Link href="/user/products">
              <ShoppingOutlined className="icon" />
              <span className="text">Ürünler</span>
            </Link>
          </li>
          <li className={router.pathname === '/user/settings' ? 'active' : ''}>
            <Link href="/user/settings">
              <SettingOutlined className="icon" />
              <span className="text">Ayarlar</span>
            </Link>
          </li>
          <li onClick={handleLogout} style={{ cursor: 'pointer', color: 'red', marginTop: 16 }}>
            <LogoutOutlined className="icon" />
            <span className="text">Çıkış Yap</span>
          </li>
        </ul>

        {!isMobile && (
          <div className="collapse-toggle" onClick={toggleCollapse}>
            {collapsed ? <RightOutlined /> : <LeftOutlined />}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="main">
        {isMobile && (
          <div className="mobile-header">
            <MenuOutlined
              className="menu-icon"
              onClick={toggleMobileSidebar}
            />
            <div className="mobile-title">{user?.name || 'Kullanıcı Paneli'}</div>
            <LogoutOutlined onClick={handleLogout} style={{ fontSize: 20, cursor: 'pointer' }} />
          </div>
        )}

        {children}
      </div>
    </div>
  )
}
