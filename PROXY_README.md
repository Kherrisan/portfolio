# Notion 代理配置快速指南

## 🚀 快速开始（3 步配置）

### 1️⃣ 启动你的代理工具

常见工具：Clash、V2Ray、Shadowsocks 等

### 2️⃣ 配置环境变量

编辑 `.env.local`：

```env
# Notion 代理配置
NOTION_PROXY_URL=http://127.0.0.1:7890
```

**常见端口**：
- Clash: `7890`
- V2Ray: `10808`
- Shadowsocks: `1080` (SOCKS5)

### 3️⃣ 测试连接

```bash
npm run test:proxy
```

---

## 📋 完整配置示例

### `.env.local` 文件

```env
# Notion API
NOTION_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_TWEET_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_ASSET_PACKAGE_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 代理配置（选择以下一种）
NOTION_PROXY_URL=http://127.0.0.1:7890

# 或使用标准环境变量
# HTTPS_PROXY=http://127.0.0.1:7890
# HTTP_PROXY=http://127.0.0.1:7890
```

---

## 🎯 不同代理工具的配置

### Clash / Clash for Windows

```env
NOTION_PROXY_URL=http://127.0.0.1:7890
```

### V2Ray / V2RayN

```env
NOTION_PROXY_URL=http://127.0.0.1:10808
```

### Shadowsocks

```env
NOTION_PROXY_URL=socks5://127.0.0.1:1080
```

### 带认证的代理

```env
NOTION_PROXY_URL=http://username:password@proxy.com:8080
```

---

## ✅ 测试你的配置

### 方法 1: 使用测试脚本（推荐）

```bash
npm run test:proxy
```

成功输出：
```
✅ 所有测试通过！
⏱️  总耗时: 1234ms
🔗 代理地址: http://127.0.0.1:7890
💡 代理配置正确，可以正常使用
```

### 方法 2: 直接构建

```bash
npm run build
```

查看日志中是否有：
```
[INFO] Notion API using proxy: http://127.0.0.1:7890
```

---

## 🐛 常见问题

### ❌ 连接被拒绝

```
Error: connect ECONNREFUSED 127.0.0.1:7890
```

**解决方案**：
1. 检查代理工具是否运行 ✓
2. 检查端口号是否正确 ✓
3. 确认代理工具的本地监听已开启 ✓

### ❌ 代理认证失败

```
Error: Proxy authentication required
```

**解决方案**：
添加用户名和密码：
```env
NOTION_PROXY_URL=http://username:password@127.0.0.1:7890
```

### ❌ 仍然超时

**检查清单**：
- [ ] 代理工具是否正常运行
- [ ] 代理规则是否包含 `notion.so` 域名
- [ ] 尝试浏览器访问 https://www.notion.so
- [ ] 尝试其他端口或代理工具

---

## 🌍 何时需要代理？

### 需要代理 ✅

- 在中国大陆开发
- Notion API 访问不稳定
- 构建经常超时失败

### 不需要代理 ❌

- 在海外服务器部署（Vercel 等）
- 本地网络访问 Notion 稳定
- 使用公司 VPN 已能访问

---

## 📚 更多信息

### 详细文档

- [完整代理配置指南](./docs/NOTION_PROXY_SETUP.md)
- [环境变量配置](./ENV_SETUP.md)
- [快速开始指南](./QUICK_START.md)

### 命令速查

```bash
# 测试代理连接
npm run test:proxy

# 开发模式
npm run dev

# 构建（使用代理）
npm run build

# 临时使用不同代理
NOTION_PROXY_URL=http://127.0.0.1:8080 npm run build
```

---

## 🎉 配置完成

如果测试通过，你就可以正常使用了！

**开始构建**：
```bash
npm run build
```

**享受稳定快速的 Notion API 访问！** 🚀

