'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Table, Button, Tag, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { getTickets, type Ticket } from '@/lib/ticket'

export default function TicketsPage() {
  const router = useRouter()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    fetchTickets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchTickets = async () => {
    try {
      const data = await getTickets()
      setTickets(data)
    } catch {
      message.error('获取工单失败，请重新登录')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { title: '工单标题', dataIndex: 'title', key: 'title' },
    { title: '提交人', dataIndex: ['user', 'username'], key: 'username' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'OPEN' ? 'green' : 'default'}>{status}</Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: Ticket) => (
        <Button type="link" onClick={() => router.push(`/tickets/${record.id}`)}>
          查看详情
        </Button>
      ),
    },
  ]

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">工单管理</h1>
        <Button type="primary" icon={<PlusOutlined />}>
          新建工单
        </Button>
      </div>
      <Table
        dataSource={tickets}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  )
}
