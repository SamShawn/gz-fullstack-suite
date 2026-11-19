import { useEffect, useState } from 'react'
import BaseChart from './components/BaseChart'
import { useSocket, type AlertData } from './hooks/useSocket'
import * as echarts from 'echarts'

export default function App() {
  const { latestAlert } = useSocket()
  const [alerts, setAlerts] = useState<AlertData[]>([])
  const [chartData, setChartData] = useState<number[]>(Array(10).fill(0))

  // 当收到新告警时，更新列表和折线图数据
  useEffect(() => {
    if (latestAlert) {
      setAlerts((prev) => [latestAlert, ...prev].slice(0, 10)) // 只保留最近 10 条用于展示

      // 模拟折线图波动 (根据随机值推入新数据)
      setChartData((prev) => {
        const newData = [...prev.slice(1), Math.floor(Math.random() * 100)]
        return newData
      })
    }
  }, [latestAlert])

  // 折线图配置
  const lineOption: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    title: { text: '实时告警趋势', textStyle: { color: '#fff', fontSize: 14 } },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['T-9', 'T-8', 'T-7', 'T-6', 'T-5', 'T-4', 'T-3', 'T-2', 'T-1', 'T'],
      axisLine: { lineStyle: { color: '#475569' } },
      axisLabel: { color: '#94a3b8' },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#334155', type: 'dashed' } },
      axisLabel: { color: '#94a3b8' },
    },
    series: [
      {
        data: chartData,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: { color: '#38bdf8' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(56, 189, 248, 0.5)' },
            { offset: 1, color: 'rgba(56, 189, 248, 0.01)' },
          ]),
        },
      },
    ],
  }

  // 饼图配置 (模拟告警等级分布)
  const pieOption: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    title: { text: '告警等级分布', textStyle: { color: '#fff', fontSize: 14 } },
    tooltip: { trigger: 'item' },
    legend: { bottom: '0', textStyle: { color: '#94a3b8' } },
    series: [
      {
        name: '告警等级',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#0f172a', borderWidth: 2 },
        label: { show: false },
        data: [
          { value: 1048, name: 'DANGER', itemStyle: { color: '#ef4444' } },
          { value: 735, name: 'WARNING', itemStyle: { color: '#eab308' } },
          { value: 580, name: 'INFO', itemStyle: { color: '#3b82f6' } },
        ],
      },
    ],
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-900 text-white p-4">
      {/* 顶部标题栏 */}
      <header className="flex justify-between items-center mb-4 pb-2 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-sky-400">智慧政企实时监控数据驾驶舱</h1>
        <div className="text-sm text-gray-400">系统运行正常 · 实时监测中</div>
      </header>

      {/* 中间主区域 */}
      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* 左侧：折线图 */}
        <div className="w-1/3 bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-700">
          <BaseChart option={lineOption} />
        </div>

        {/* 中间：核心数据大盘 */}
        <div className="w-1/3 bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-700 flex flex-col items-center justify-center">
          <div className="text-gray-400 mb-2">实时告警总量</div>
          <div className="text-5xl font-bold text-sky-400 mb-4">{alerts.length * 100 + 42}</div>
          <div className="w-full h-48">
            <BaseChart option={pieOption} />
          </div>
        </div>

        {/* 右侧：实时告警列表 */}
        <div className="w-1/3 bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-700 overflow-hidden flex flex-col">
          <h2 className="text-sm font-bold mb-3 text-gray-300">实时告警动态</h2>
          <div className="flex-1 overflow-y-auto">
            {alerts.length === 0 ? (
              <div className="text-gray-500 text-center mt-10">等待实时告警数据...</div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="mb-2 p-2 bg-slate-800 rounded border-l-4 border-red-500 text-sm animate-pulse"
                >
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span
                      className={
                        alert.level === 'DANGER' ? 'text-red-500 font-bold' : 'text-yellow-500'
                      }
                    >
                      {alert.level}
                    </span>
                    <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-gray-200">{alert.message}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 右下角实时弹窗提示 (Toast) */}
      {latestAlert && (
        <div className="fixed bottom-6 right-6 bg-red-900/80 border border-red-500 text-white px-6 py-4 rounded-lg shadow-2xl animate-bounce">
          <div className="font-bold text-red-400 mb-1">⚠️ 收到新告警</div>
          <div className="text-sm">{latestAlert.message}</div>
        </div>
      )}
    </div>
  )
}
