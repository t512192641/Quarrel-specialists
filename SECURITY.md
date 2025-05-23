# 🔐 安全配置指南

## 环境变量配置

### 本地开发环境

1. 在项目根目录创建 `.env.local` 文件：
```bash
# 🔐 API配置
SILICON_FLOW_API_KEY=sk-aegsuslymdcshizzcuwbvwfjntaagsywvkejmurzjkjqfkuu
API_KEY=sk-aegsuslymdcshizzcuwbvwfjntaagsywvkejmurzjkjqfkuu

# Next.js环境变量
NODE_ENV=development
```

2. 确保 `.env.local` 文件在 `.gitignore` 中（已配置）

### Netlify部署环境变量配置

#### 方法一：Netlify管理面板配置

1. 登录Netlify，进入您的站点
2. 进入 **Site settings** → **Environment variables**
3. 点击 **Add a variable** 添加以下变量：

```
Key: SILICON_FLOW_API_KEY
Value: sk-aegsuslymdcshizzcuwbvwfjntaagsywvkejmurzjkjqfkuu

Key: API_KEY  
Value: sk-aegsuslymdcshizzcuwbvwfjntaagsywvkejmurzjkjqfkuu

Key: NODE_ENV
Value: production
```

#### 方法二：通过netlify.toml配置（不推荐敏感信息）

```toml
# ⚠️ 不要在netlify.toml中存储敏感API密钥
# 仅用于非敏感环境变量
[context.production.environment]
  NODE_ENV = "production"
```

## API文件位置和配置

### 文件位置
```
app/api/generate-response/route.ts
```

### 安全配置
- ✅ API密钥通过环境变量读取
- ✅ 运行时设置为 `nodejs`
- ✅ 动态路由配置 `force-dynamic`
- ✅ 错误处理和输入验证

### API安全最佳实践

1. **环境变量管理**
   - 本地：使用 `.env.local` 文件
   - 生产：使用平台环境变量配置
   - 绝不在代码中硬编码敏感信息

2. **输入验证**
   - 验证 `opponentWords` 不为空
   - 验证 `angerLevel` 在1-10范围内
   - 转义特殊字符防止注入

3. **错误处理**
   - 不暴露内部错误详情
   - 记录详细日志用于调试
   - 优雅的错误响应

4. **请求限制**（建议添加）
   - 实现请求频率限制
   - 添加请求大小限制
   - 监控API使用量

## Netlify部署安全检查清单

### 部署前检查
- [ ] API密钥已从代码中移除
- [ ] 环境变量已在Netlify中配置
- [ ] `.gitignore` 包含所有敏感文件
- [ ] 代码中无其他硬编码敏感信息

### 部署后验证
- [ ] API路由可以正常访问
- [ ] 环境变量正确加载
- [ ] 错误处理正常工作
- [ ] SSE流式传输正常

## 密钥轮换建议

定期更换API密钥以提高安全性：
1. 在SiliconFlow平台生成新密钥
2. 在Netlify环境变量中更新
3. 测试功能正常后删除旧密钥

## 监控和日志

- 监控API调用频率和成本
- 设置异常使用告警
- 定期检查访问日志
- 监控错误率和响应时间

---

**⚠️ 重要提醒：绝不要将API密钥提交到Git仓库中！** 