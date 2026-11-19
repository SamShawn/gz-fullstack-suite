'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Form, Input, message, Card } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { login, LoginPayload } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: LoginPayload) => {
    setLoading(true)
    try {
      const res = await login(values)
      localStorage.setItem('token', res.access_token)
      message.success('登录成功')
      router.push('/tickets')
    } catch {
      message.error('用户名或密码错误')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-slate-100">
      <Card
        title="AI 智能工单系统"
        className="w-96 shadow-lg"
        styles={{ header: { textAlign: 'center', fontSize: 20 } }}
      >
        <Form name="login" onFinish={onFinish} size="large">
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full" loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
