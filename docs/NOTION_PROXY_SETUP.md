# Notion API 代理配置指南

## 📋 为什么需要代理？

在国内访问 Notion API 时可能遇到以下问题：
- ❌ 连接超时
- ❌ 请求速度慢
- ❌ 构建失败
- ❌ 数据获取不稳定

**解决方案**：配置代理来访问 Notion API

---

## 🚀 快速配置

### 方式 1: 使用专用配置（推荐）

在 `.env.local` 中添加：

```env
NOTION_PROXY_URL=http://127.0.0.1:7890
```

### 方式 2: 使用标准环境变量

```env
HTTP_PROXY=http://127.0.0.1:7890
HTTPS_PROXY=http://127.0.0.1:7890
```

### 方式 3: 临时使用（命令行）

```bash
# macOS/Linux
export NOTION_PROXY_URL=http://127.0.0.1:7890
npm run build

# Windows PowerShell
$env:NOTION_PROXY_URL="http://127.0.0.1:7890"
npm run build

# Windows CMD
set NOTION_PROXY_URL=http://127.0.0.1:7890
npm run build
```

---

## 🔧 支持的代理类型

### 1. HTTP 代理

```env
NOTION_PROXY_URL=http://127.0.0.1:7890
```

### 2. HTTPS 代理

```env
NOTION_PROXY_URL=https://127.0.0.1:7890
```

### 3. SOCKS5 代理

```env
NOTION_PROXY_URL=socks5://127.0.0.1:1080
```

### 4. 带认证的代理

```env
NOTION_PROXY_URL=http://username:password@proxy.example.com:8080
```

---

## 📱 常见代理工具配置

### Clash

1. 打开 Clash
2. 查看 HTTP 端口（通常是 7890）
3. 配置：

```env
NOTION_PROXY_URL=http://127.0.0.1:7890
```

### V2Ray / V2RayN

1. 打开 V2Ray
2. 查看本地监听端口（通常是 10808）
3. 配置：

```env
NOTION_PROXY_URL=http://127.0.0.1:10808
```

### Shadowsocks

1. 打开 Shadowsocks
2. 查看本地 SOCKS5 端口（通常是 1080）
3. 配置：

```env
NOTION_PROXY_URL=socks5://127.0.0.1:1080
```

### Clash for Windows

1. 打开 Clash for Windows
2. 设置 → 查看端口配置
3. 常见配置：

```env
# HTTP 代理
NOTION_PROXY_URL=http://127.0.0.1:7890

# SOCKS5 代理
NOTION_PROXY_URL=socks5://127.0.0.1:7891
```

### Surge (macOS)

```env
NOTION_PROXY_URL=http://127.0.0.1:6152
```

### Quantumult X (iOS/macOS)

查看本地代理端口，通常是：

```env
NOTION_PROXY_URL=http://127.0.0.1:8888
```

---

## 🔍 环境变量优先级

系统会按以下顺序查找代理配置：

```
1. NOTION_PROXY_URL     （优先级最高）
2. HTTPS_PROXY
3. HTTP_PROXY
4. 无代理              （直连）
```

**示例**：

```env
# 如果同时配置了多个，优先使用 NOTION_PROXY_URL
NOTION_PROXY_URL=http://127.0.0.1:7890   # ✓ 使用这个
HTTPS_PROXY=http://127.0.0.1:8080        # ✗ 忽略
HTTP_PROXY=http://127.0.0.1:9090         # ✗ 忽略
```

---

## ✅ 验证配置

### 1. 查看日志

构建时会输出日志：

```bash
npm run build
```

如果配置成功，会看到：

```
[INFO] Notion API using proxy: http://127.0.0.1:7890
```

### 2. 测试构建

```bash
# 清除缓存后重新构建
rm -rf .next
npm run build
```

如果成功获取 Notion 数据，说明代理配置正确。

### 3. 测试脚本

创建测试文件 `test-notion-proxy.js`：

```javascript
const { Client } = require('@notionhq/client')
const { HttpsProxyAgent } = require('https-proxy-agent')
const fetch = require('node-fetch')

const proxyUrl = process.env.NOTION_PROXY_URL || 'http://127.0.0.1:7890'
const agent = new HttpsProxyAgent(proxyUrl)

const customFetch = (url, options = {}) => {
  return fetch(url, { ...options, agent })
}

const notion = new Client({
  auth: process.env.NOTION_KEY,
  fetch: customFetch,
})

// 测试查询
notion.databases.query({
  database_id: process.env.NOTION_DATABASE_ID,
  page_size: 1,
})
  .then(() => {
    console.log('✓ Notion API 连接成功！')
    process.exit(0)
  })
  .catch((err) => {
    console.error('✗ Notion API 连接失败：', err.message)
    process.exit(1)
  })
```

运行测试：

```bash
NOTION_PROXY_URL=http://127.0.0.1:7890 node test-notion-proxy.js
```

---

## 🐛 故障排查

### 问题 1: 代理连接失败

**错误信息**：
```
Error: connect ECONNREFUSED 127.0.0.1:7890
```

**解决方案**：
1. ✅ 检查代理工具是否运行
2. ✅ 检查端口号是否正确
3. ✅ 检查代理工具的本地监听是否开启

### 问题 2: 代理认证失败

**错误信息**：
```
Error: Proxy authentication required
```

**解决方案**：
添加用户名和密码：

```env
NOTION_PROXY_URL=http://username:password@127.0.0.1:7890
```

### 问题 3: SOCKS5 代理不工作

**解决方案**：
1. 确认使用正确的协议前缀：

```env
# 正确
NOTION_PROXY_URL=socks5://127.0.0.1:1080

# 错误
NOTION_PROXY_URL=http://127.0.0.1:1080
```

2. 确保安装了 SOCKS 代理支持：

```bash
npm install socks-proxy-agent
```

### 问题 4: 仍然无法连接

**检查清单**：
1. ✅ 代理工具是否正常运行
2. ✅ 端口是否被其他程序占用
3. ✅ 防火墙是否阻止了连接
4. ✅ 代理规则是否包含 notion.so 域名
5. ✅ 尝试使用浏览器访问 https://www.notion.so 测试代理

**调试命令**：

```bash
# macOS/Linux - 测试代理连接
curl -x http://127.0.0.1:7890 https://api.notion.com/v1

# 查看端口是否开启
netstat -an | grep 7890

# 测试 SOCKS5 代理
curl --socks5 127.0.0.1:1080 https://api.notion.com/v1
```

---

## 🔐 安全建议

### 1. 本地代理

推荐使用本地代理（127.0.0.1），避免数据泄露：

```env
# ✓ 安全
NOTION_PROXY_URL=http://127.0.0.1:7890

# ✗ 不推荐（除非是可信的远程代理）
NOTION_PROXY_URL=http://remote-proxy.com:8080
```

### 2. 代理认证

如果使用带认证的代理，确保：
- 不要将 `.env.local` 提交到 Git
- 使用强密码
- 定期更换密码

### 3. 仅在必要时使用

如果在海外服务器部署，无需配置代理，直连更快更安全。

---

## 🌐 部署环境配置

### Vercel

在 Vercel 环境变量中添加：

```
NOTION_PROXY_URL=http://your-proxy-url
```

⚠️ **注意**：Vercel 部署在海外，通常不需要代理

### 自建服务器（国内）

#### 使用 Docker

```dockerfile
FROM node:18

# 设置代理环境变量
ENV NOTION_PROXY_URL=http://host.docker.internal:7890

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

CMD ["npm", "start"]
```

#### 使用 PM2

```bash
# 在启动脚本中设置环境变量
export NOTION_PROXY_URL=http://127.0.0.1:7890
pm2 start npm --name "portfolio" -- start
```

### GitHub Actions（国内）

```yaml
- name: Build
  env:
    NOTION_PROXY_URL: ${{ secrets.NOTION_PROXY_URL }}
  run: npm run build
```

---

## 📊 性能对比

| 环境 | 无代理 | 使用代理 | 提升 |
|------|--------|----------|------|
| 国内服务器 | 经常超时 | 稳定 | ✅ |
| 构建时间 | 2-5 分钟 | 30-60 秒 | ⚡ 70% |
| 成功率 | 30-50% | 95%+ | 🎯 |
| 海外服务器 | 稳定快速 | 不需要 | - |

---

## 💡 最佳实践

### 开发环境

```env
# .env.local（开发用）
NOTION_PROXY_URL=http://127.0.0.1:7890
```

### 生产环境（国内）

```env
# .env.production（生产用）
NOTION_PROXY_URL=http://stable-proxy.internal:8080
```

### CI/CD

```bash
# 在 CI 环境中使用 GitHub Secrets
NOTION_PROXY_URL=${{ secrets.NOTION_PROXY_URL }}
```

---

## 🔄 代理切换

### 开发时启用，部署时禁用

```javascript
// lib/notion.ts
const proxyUrl = process.env.NODE_ENV === 'development' 
  ? process.env.NOTION_PROXY_URL 
  : undefined
```

### 根据地理位置自动选择

```javascript
const isChinaMainland = process.env.DEPLOY_REGION === 'cn'
const proxyUrl = isChinaMainland ? process.env.NOTION_PROXY_URL : undefined
```

---

## 📚 相关资源

- [Notion API 官方文档](https://developers.notion.com/)
- [https-proxy-agent](https://github.com/TooTallNate/proxy-agents)
- [Clash 使用教程](https://docs.gtk.pw/)
- [V2Ray 配置指南](https://www.v2ray.com/)

---

## 🆘 获取帮助

### 常见问题

1. **代理工具推荐**：Clash、V2Ray、Shadowsocks
2. **最佳端口配置**：使用代理工具的默认端口
3. **性能优化**：使用本地代理，避免远程代理延迟

### 联系支持

- 📧 提交 Issue 到项目仓库
- 💬 查看常见问题文档
- 📖 阅读 Notion API 文档

---

## ✨ 总结

配置 Notion 代理只需 3 步：

1. **启动代理工具**（Clash/V2Ray 等）
2. **配置环境变量**（`.env.local`）
3. **测试构建**（`npm run build`）

**国内用户强烈推荐配置代理，可以大幅提升开发体验！** 🚀

