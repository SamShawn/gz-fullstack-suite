'use client'

import { use, useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Card, message } from 'antd'
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // 解包 params
  const { id } = use(params)

  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '你好！我是 AI 助手，有什么可以帮您处理这个工单的？' },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim()) return
    const userMsg: Message = { role: 'user', content: inputValue }
    setMessages((prev) => [...prev, userMsg])
    setInputValue('')
    setIsTyping(true)

    // 【Day 6 预告】这里稍后会替换成真实的 fetch SSE 接口
    // 现在先用模拟流式输出替代
    try {
      const response = await fetch('http://localhost:8000/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg.content }),
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

      while (reader) {
        const { value, done } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })

        // 解析 SSE 格式的数据 data: ...
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const text = line.slice(6)
            if (text === '[DONE]') break
            assistantContent += text
            setMessages((prev) => {
              const newMsgs = [...prev]
              newMsgs[newMsgs.length - 1].content = assistantContent
              return newMsgs
            })
          }
        }
      }
    } catch {
      message.error('AI 接口调用失败')
      setMessages((prev) => [...prev, { role: 'assistant', content: '抱歉，AI 服务暂不可用。' }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* 左侧：工单信息 */}
      <div className="w-1/2 p-8 border-r border-gray-200 bg-white">
        <Button onClick={() => router.back()} className="mb-4">
          返回列表
        </Button>
        <h1 className="text-2xl font-bold mb-4">工单详情: {id}</h1>
        <Card>
          <p>
            <strong>标题：</strong> 系统检测到 DANGER 级别异常
          </p>
          <p>
            <strong>内容：</strong> 服务器 CPU 过高，需要紧急排查。
          </p>
        </Card>
      </div>

      {/* 右侧：AI 对话 */}
      <div className="w-1/2 flex flex-col bg-white">
        <div className="p-4 border-b border-gray-200 bg-slate-50 flex items-center">
          <RobotOutlined className="text-2xl text-blue-500 mr-2" />
          <h2 className="text-lg font-bold">AI 智能助手</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
                }`}
              >
                {msg.role === 'user' ? (
                  <div className="flex items-start">
                    <UserOutlined className="mr-2 mt-1" />
                    <span>{msg.content}</span>
                  </div>
                ) : (
                  <div className="flex items-start">
                    <RobotOutlined className="mr-2 mt-1 text-blue-500" />
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="text-gray-400 text-sm ml-8 animate-pulse">AI 正在思考中...</div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <Input.TextArea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="输入你的问题，按 Enter 发送..."
              autoSize={{ minRows: 1, maxRows: 4 }}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
            />
            <Button type="primary" icon={<SendOutlined />} onClick={handleSend} loading={isTyping}>
              发送
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
