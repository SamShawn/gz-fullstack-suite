# GZ Fullstack Suite

> 基于 Monorepo 架构的企业级全栈解决方案，展现从 0 到 1 的独立架构设计与全栈闭环能力。

## 🏗️ 架构设计

本项目采用 `pnpm workspaces` + `Turborepo` 搭建，实现了高度复用与并行构建：

- **apps/server-core**: 核心业务后端 (NestJS + Prisma + PostgreSQL + Redis + WebSocket)
- **apps/server-data**: 数据模拟微服务 (Python FastAPI + Redis Pub/Sub)
- **apps/web-ai-ticket**: AI 智能工单协同系统 (Next.js App Router + Ant Design + SSE)
- **apps/web-bigdata**: 政企数据可视化大屏 (React + Vite + ECharts + WebSocket)
- **packages/types**: 前后端共享 TypeScript 类型定义
- **packages/ui**: 共享 UI 组件库

## 🚀 工程化基建

- **代码规范**：根目录统一 ESLint Flat Config + Prettier，支持 React / Next.js 规范。
- **提交拦截**：Husky + lint-staged，提交前自动格式化与修复。
- **构建优化**：Turborepo 并行任务调度，构建产物缓存 (Turbo Cache)。
- **类型安全**：全局 `tsc --noEmit` 类型检查，确保前后端类型一致。

## 📦 快速启动

### 1. 环境准备

- Node.js >= 20.19
- pnpm >= 8.6
- Docker Desktop

### 2. 启动基础设施 (PostgreSQL + Redis)

```bash
docker compose up -d
```

### 3. 安装依赖与初始化

```bash
pnpm install
cd apps/server-core
cp .env.example .env # 配置你的数据库连接
pnpm prisma db push
cd ../..
```

### 4. 启动所有应用

```bash
pnpm dev
```

- 大屏应用: http://localhost:5173
- AI 工单: http://localhost:3000
- 核心后端: http://localhost:3001/api
