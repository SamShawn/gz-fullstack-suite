import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

// 定义告警数据类型
export interface AlertData {
  id: string
  level: string
  message: string
  timestamp: string
}

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [latestAlert, setLatestAlert] = useState<AlertData | null>(null)

  useEffect(() => {
    // 连接后端的 namespace: /alerts
    const newSocket = io('http://localhost:3000/alerts', {
      transports: ['websocket'],
    })

    newSocket.on('connect', () => {
      console.log('✅ 大屏 WebSocket 已连接')
    })

    newSocket.on('new-alert', (data: AlertData) => {
      console.log('📡 收到实时告警:', data)
      setLatestAlert(data)
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [])

  return { socket, latestAlert }
}
