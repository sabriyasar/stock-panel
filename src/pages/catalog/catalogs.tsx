'use client'

import { useEffect, useState } from 'react'
import { Button, Popconfirm, List, message, Space, Tooltip, Checkbox } from 'antd'
import axios from 'axios'
import DashboardLayout from '@/components/DashboardLayout'

interface CatalogItem {
  uuid: string
  createdAt: string
}

export default function Catalogs() {
  const [catalogs, setCatalogs] = useState<CatalogItem[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCatalogs, setSelectedCatalogs] = useState<string[]>([])
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const api = process.env.NEXT_PUBLIC_API_URL

  const fetchCatalogs = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${api}/api/catalogs/my-catalogs`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` },
      })
      setCatalogs(res.data.catalogs || res.data)
    } catch (err) {
      console.error(err)
      message.error('Kataloglar alınamadı')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (uuid: string) => {
    try {
      await axios.delete(`${api}/api/catalogs/${uuid}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` },
      })
      setCatalogs((prev) => prev.filter((c) => c.uuid !== uuid))
      setSelectedCatalogs((prev) => prev.filter((id) => id !== uuid))
      message.success('Katalog silindi')
    } catch (err) {
      console.error(err)
      message.error('Katalog silinemedi')
    }
  }

  const handleCopy = (uuid: string) => {
    const link = `${window.location.origin}/catalog/${uuid}`
    navigator.clipboard.writeText(link)
    message.success('Link kopyalandı')
  }

  const handleSelect = (uuid: string, checked: boolean) => {
    setSelectedCatalogs((prev) =>
      checked ? [...prev, uuid] : prev.filter((id) => id !== uuid)
    )
  }

  const handleBulkDelete = async () => {
    if (selectedCatalogs.length === 0) {
      message.warning('Lütfen silmek için en az bir katalog seçin')
      return
    }
    setBulkDeleting(true)
    try {
      await axios.delete(`${api}/api/catalogs/bulk-delete`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` },
        data: { uuids: selectedCatalogs },
      })
      setCatalogs((prev) => prev.filter((c) => !selectedCatalogs.includes(c.uuid)))
      setSelectedCatalogs([])
      message.success('Seçilen kataloglar silindi')
    } catch (err) {
      console.error(err)
      message.error('Kataloglar silinemedi')
    } finally {
      setBulkDeleting(false)
    }
  }

  useEffect(() => {
    fetchCatalogs()
  }, [])

  return (
    <DashboardLayout>
      <h1>Oluşturulan Kataloglar</h1>

      {catalogs.length > 0 && (
        <Button
          type="primary"
          danger
          onClick={handleBulkDelete}
          disabled={selectedCatalogs.length === 0 || bulkDeleting}
          style={{ marginBottom: 16 }}
        >
          {bulkDeleting ? 'Siliniyor...' : `Seçilenleri Sil (${selectedCatalogs.length})`}
        </Button>
      )}

      <List
        loading={loading}
        bordered
        dataSource={catalogs}
        renderItem={(catalog) => (
          <List.Item
            key={catalog.uuid}
            actions={[
              <Tooltip key={`copy-${catalog.uuid}`} title="Kopyala">
                <Button type="link" onClick={() => handleCopy(catalog.uuid)}>
                  Kopyala
                </Button>
              </Tooltip>,
              <Popconfirm
                key={`delete-${catalog.uuid}`}
                title="Bu katalogu silmek istediğinize emin misiniz?"
                onConfirm={() => handleDelete(catalog.uuid)}
                okText="Evet"
                cancelText="Hayır"
              >
                <Button type="link" danger>
                  Sil
                </Button>
              </Popconfirm>,
            ]}
          >
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Space>
                <Checkbox
                  checked={selectedCatalogs.includes(catalog.uuid)}
                  onChange={(e) => handleSelect(catalog.uuid, e.target.checked)}
                />
                <div>
                  <a
                    href={`/catalog/${catalog.uuid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {`${window.location.origin}/catalog/${catalog.uuid}`}
                  </a>
                  <div style={{ color: '#888', fontSize: 12 }}>
                    {new Date(catalog.createdAt).toLocaleString('tr-TR')}
                  </div>
                </div>
              </Space>
            </Space>
          </List.Item>
        )}
      />
    </DashboardLayout>
  )
}
