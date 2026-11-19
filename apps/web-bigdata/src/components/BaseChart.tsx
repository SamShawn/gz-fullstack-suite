import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

interface BaseChartProps {
  option: echarts.EChartsOption
  className?: string
}

export default function BaseChart({ option, className = '' }: BaseChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // 初始化图表
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, 'dark')
    }

    // 设置配置项
    chartInstance.current.setOption(option)

    // 响应式自适应
    const handleResize = () => {
      chartInstance.current?.resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [option])

  // 组件卸载时销毁实例，防止内存泄漏
  useEffect(() => {
    return () => {
      chartInstance.current?.dispose()
      chartInstance.current = null
    }
  }, [])

  return <div ref={chartRef} className={`w-full h-full ${className}`} />
}
