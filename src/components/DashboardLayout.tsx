import { useState, useEffect } from 'react'
import {
  MenuOutlined,
  CloseOutlined,
  LeftOutlined,
  RightOutlined,
  DashboardOutlined,
  ShoppingOutlined,
  SettingOutlined,
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
  const router = useRouter()

  const toggleMobileSidebar = () => setMobileOpen(!mobileOpen)
  const closeSidebar = () => setMobileOpen(false)
  const toggleCollapse = () => setCollapsed(!collapsed)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
      if (window.innerWidth > 768) setMobileOpen(false)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className={`dashboard-container ${collapsed ? 'collapsed' : ''}`}>
      {/* Sidebar */}
      <div className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        {isMobile && (
          <div className="sidebar-header">
            <CloseOutlined className="close-icon" onClick={closeSidebar} />
          </div>
        )}
        {!isMobile && <div className="logo">Admin</div>}

        <ul>
          <li className={router.pathname === '/admin' ? 'active' : ''}>
            <Link href="/admin">
              <DashboardOutlined className="icon" />
              <span className="text">Dashboard</span>
            </Link>
          </li>
          <li className={router.pathname === '/admin/products' ? 'active' : ''}>
            <Link href="/admin/products">
              <ShoppingOutlined className="icon" />
              <span className="text">Ürünler</span>
            </Link>
          </li>
          <li className={router.pathname === '/admin/settings' ? 'active' : ''}>
            <Link href="/admin/settings">
              <SettingOutlined className="icon" />
              <span className="text">Ayarlar</span>
            </Link>
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
            <div className="mobile-title">Admin Paneli</div>
            <div style={{ width: 24 }}></div>
          </div>
        )}

        {children}
      </div>
    </div>
  )
}
