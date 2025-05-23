# 天津话吵架助手 - AI驱动的幽默回击生成器

## 项目简介

这是一个基于AI的天津话吵架助手，能够根据用户输入的对方言论，生成3条富有天津地方特色、文明幽默的回击语句。项目使用了现代化的技术栈，支持实时流式数据传输，为用户提供即时的AI生成体验。

## 技术栈

- **前端框架**: Next.js 13.5.1 (App Router)
- **UI组件库**: Radix UI + Tailwind CSS
- **动画效果**: Framer Motion
- **状态管理**: React Hooks (useState, useEffect)
- **数据通信**: Server-Sent Events (SSE) 流式传输
- **AI服务**: SiliconFlow API (Qwen/QwQ-32B模型)
- **开发语言**: TypeScript
- **运行时**: Node.js Runtime

## 项目结构

```
project/
├── app/                          # Next.js App Router
│   ├── api/                      # API路由
│   │   └── generate-response/    # AI回应生成接口
│   │       └── route.ts          # SSE流式响应实现
│   │   └── generate-response/    # AI回应生成接口
│   │       └── route.ts          # SSE流式响应实现
│   ├── page.tsx                  # 首页组件
│   ├── layout.tsx                # 根布局
│   └── globals.css               # 全局样式
├── components/                   # React组件
│   ├── ui/                       # 基础UI组件
│   ├── ArgumentForm.tsx          # 主要表单组件
│   ├── ResponseCard.tsx          # 响应卡片组件
│   ├── Header.tsx                # 页面头部
│   └── Footer.tsx                # 页面底部
├── hooks/                        # 自定义React Hooks
├── lib/                          # 工具库和类型定义
├── README.md                     # 项目说明文件
└── 其他配置文件...
```

## 核心功能

### 1. 智能回击生成
- 输入对方言论，AI生成3条不同风格的天津话回击
- 支持愤怒值调节（1-10级），影响回击的激烈程度
- 保证所有回击内容文明幽默，不使用粗俗语言

### 2. 实时流式传输
- 使用Server-Sent Events (SSE)技术
- 支持实时显示AI思考状态和逐条响应结果
- 优化的用户体验，无需等待所有内容生成完毕

### 3. 历史记录管理
- 本地存储最近10条对话记录
- 支持查看历史对话和回击内容
- 一键保存当前对话到历史记录

### 4. 响应式设计
- 完全响应式布局，适配各种设备
- 现代化的UI设计，支持暗色/明亮主题切换
- 流畅的动画效果和交互反馈

## 如何运行项目

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
    ```bash
npm run dev
    ```

### 3. 访问应用
打开浏览器访问 `http://localhost:3000`

### 4. 构建生产版本
    ```bash
npm run build
npm start
    ```

## API接口说明

### GET /api/generate-response

生成天津话吵架回应的SSE流式接口。

**查询参数:**
- `opponentWords` (string, 必需): 对方说的话
- `angerLevel` (number, 可选): 愤怒值，范围1-10，默认为5

**响应格式:**
Server-Sent Events流，包含以下消息类型：

```javascript
// 思考状态
data: {"type": "thinking", "message": "AI正在思考中..."}

// 回应内容（会发送3条）
data: {"type": "response", "index": 0, "content": "第一条回击内容"}

// 完成标识
data: {"type": "done"}

// 错误信息
data: {"type": "error", "message": "错误描述"}
```

## 开发注意事项

### 1. SSE流式传输
- 使用Node.js Runtime而非Edge Runtime，确保SSE正常工作
- 正确设置响应头，包括`text/event-stream`和`no-cache`
- 使用ReadableStream实现真正的流式数据传输

### 2. 错误处理
- 完善的错误处理机制，包括网络错误、API错误等
- 用户友好的错误提示和重试机制
- 详细的控制台日志用于调试

### 3. 性能优化
- 组件级别的状态管理，避免不必要的重渲染
- 合理的加载状态和进度提示
- 本地存储优化，避免频繁读写

### 4. 代码规范
- 使用TypeScript进行类型检查
- ESLint配置确保代码质量
- 详细的注释和文档

## 问题跟踪与修复记录

### 2024年12月28日 - SSE流式传输问题修复

**问题描述:**
- API能正常接收请求并返回数据
- 后端日志显示所有处理步骤正常
- 前端EventSource一直卡在等待状态，无法接收数据

**问题原因:**
1. **Edge Runtime兼容性问题**: 原代码使用`export const runtime = 'edge'`，Edge Runtime在SSE实现上与Node.js Runtime有差异
2. **TransformStream使用不当**: 在Edge Runtime环境下，TransformStream的数据可能被缓冲而不会立即发送
3. **缺少正确的流控制**: 没有使用标准的ReadableStream控制器模式

**解决方案:**
1. **切换到Node.js Runtime**: 将`runtime = 'edge'`改为`runtime = 'nodejs'`
2. **重构流处理逻辑**: 使用标准的ReadableStream构造函数和async start方法
3. **优化响应头设置**: 添加`X-Accel-Buffering: no`等优化头部
4. **改进错误处理**: 在stream内部进行完整的错误处理

**技术细节:**
- 使用`ReadableStream`的`start(controller)`方法直接控制数据流
- 所有数据推送通过`controller.enqueue()`同步执行
- 正确的错误处理和流关闭机制
- 保持原有的JSON格式和前端兼容性

**修复结果:**
- SSE连接能够正常建立和维持
- 数据能够实时流式传输到前端
- 前端能够正确接收和解析所有消息类型
- 错误处理机制正常工作

**经验总结:**
1. Next.js的Edge Runtime对于SSE有一定限制，复杂的流式场景建议使用Node.js Runtime
2. ReadableStream是Web标准API，在不同运行时环境下行为可能有差异
3. SSE实现需要特别注意响应头配置和缓冲控制
4. 流式传输的错误处理需要在流内部完成，不能依赖外部的try-catch

## 使用说明

### 基本使用流程

1. **输入对方言论**: 在文本框中输入对方说的话
2. **调整愤怒值**: 通过滑块设置回击的激烈程度(1-10)
3. **生成回击**: 点击"开始吵架"按钮
4. **查看结果**: 等待AI生成3条不同风格的回击
5. **保存记录**: 可选择保存到历史记录

### 愤怒值说明

- **1-3级(温和)**: 轻松幽默，以调侃为主
- **4-6级(较强)**: 稍显犀利，但保持风度
- **7-8级(激烈)**: 气势十足，反击有力
- **9-10级(极端)**: 火力全开，但依然文明

### 历史记录功能

- 自动保存最近10条对话
- 显示完整的输入、愤怒值和3条回击
- 支持查看对话时间戳
- 数据存储在浏览器本地，隐私安全

## 部署指南

### Vercel部署（推荐）

1. 将代码推送到GitHub仓库
2. 在Vercel中导入项目
3. 设置环境变量（如需要）
4. 自动部署完成

### 自定义部署

1. 构建项目: `npm run build`
2. 启动服务: `npm start`
3. 配置反向代理（如nginx）
4. 设置HTTPS证书

## 许可证

本项目仅供学习和娱乐使用，请勿用于恶意目的。

## 贡献指南

欢迎提交Issue和Pull Request来改进项目！
