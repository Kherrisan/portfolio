# 快速开始指南 - 简化版图片处理

## 🚀 5 分钟快速配置

### 1. 安装依赖

```bash
npm install
# 或
yarn install
```

### 2. 配置环境变量

创建 `.env.local` 文件：

```env
# Notion API（必需）
NOTION_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 腾讯云 COS（必需）
TENCENT_COS_SECRET_ID=AKIDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TENCENT_COS_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TENCENT_COS_BUCKET=your-bucket-name-1234567890
TENCENT_COS_REGION=ap-guangzhou

# CDN 域名（可选，留空则使用 COS 默认域名）
TENCENT_COS_CDN_DOMAIN=https://cdn.yourdomain.com
```

### 3. 运行构建

```bash
npm run build
```

就这么简单！🎉

---

## 📖 工作原理

### 核心逻辑（3 步）

```
1. 检查图片是否已上传到 COS ✓
   ├─ 已存在 → 直接使用 CDN URL
   └─ 不存在 → 继续下一步

2. 下载并生成缩略图 ✓
   ├─ 下载原图
   ├─ 生成 @1x/@2x/@3x
   └─ 转换 WebP 格式

3. 上传到 COS ✓
   └─ 所有文件上传到根目录
```

### 文件命名规则

```
原始 Notion URL → MD5 哈希 → 唯一文件名

例如：
https://notion.so/image/xxx.jpg 
  ↓
abc123def456.jpg
  ↓
生成文件：
- abc123def456@1x.jpeg
- abc123def456@2x.jpeg
- abc123def456@3x.jpeg
- abc123def456@1x.webp
- abc123def456@2x.webp
- abc123def456@3x.webp
```

---

## 💡 关键特性

### ✅ 自动去重

相同内容的图片只存储一次：

```
文章 A 用图片 X → 生成哈希 abc123 → 上传
文章 B 用相同图片 → 生成哈希 abc123 → 检测到已存在 → 跳过 ✓
```

### ✅ 响应式图片

浏览器自动选择最优格式和尺寸：

```html
<picture>
  <!-- WebP 优先 -->
  <source srcset="image@1x.webp 768w, image@2x.webp 1536w" type="image/webp" />
  <!-- JPEG 降级 -->
  <source srcset="image@1x.jpeg 768w, image@2x.jpeg 1536w" type="image/jpeg" />
  <img src="image.jpg" />
</picture>
```

### ✅ 增量构建

只处理新图片，已存在的直接使用：

```
第一次构建: 处理 10 张图片 → 45 秒
第二次构建: 0 张新图片 → 5 秒 ⚡
```

---

## 📁 目录结构

```
项目根目录/
├── lib/
│   ├── tencent-cos.ts      # 腾讯云 COS 工具（核心）
│   ├── imaging.ts           # 图片处理工具
│   └── notion.ts            # Notion API
├── pages/
│   └── blog/
│       └── [slug].tsx       # 博客页面（集成图片处理）
├── .temp/
│   └── image/               # 临时目录（自动清理）
├── .env.local               # 环境变量（不提交到 Git）
└── package.json
```

---

## 🔧 常用命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 本地预览
npm run start

# 代码格式化
npm run format

# 检查 lint
npm run lint
```

---

## 🐛 故障排查

### 问题 1: 构建失败 - "Cannot find module 'cos-nodejs-sdk-v5'"

**解决**：
```bash
npm install cos-nodejs-sdk-v5
```

### 问题 2: 图片上传失败 - "Access Denied"

**检查清单**：
1. ✅ COS 密钥是否正确
2. ✅ 存储桶权限是否为"公有读私有写"
3. ✅ 地域配置是否匹配

**验证方法**：
```bash
# 在腾讯云控制台检查存储桶设置
```

### 问题 3: 图片无法显示

**检查清单**：
1. ✅ 图片是否成功上传（查看 COS 控制台）
2. ✅ CDN 域名配置是否正确
3. ✅ 浏览器控制台是否有 CORS 错误

**解决 CORS**：
在 COS 控制台设置跨域规则：
```json
{
  "allowedOrigins": ["*"],
  "allowedMethods": ["GET", "HEAD"],
  "allowedHeaders": ["*"],
  "maxAgeSeconds": 3600
}
```

### 问题 4: ImageMagick 未安装

**错误信息**: `convert: command not found`

**解决**：
```bash
# macOS
brew install imagemagick

# Ubuntu/Debian
sudo apt-get install imagemagick

# Windows
# 下载安装: https://imagemagick.org/script/download.php
```

---

## 📊 性能优化建议

### 1. 使用 CDN 加速

配置自定义域名：
```env
TENCENT_COS_CDN_DOMAIN=https://cdn.yourdomain.com
```

### 2. 启用 HTTPS

- 提升安全性
- SEO 友好
- 现代浏览器要求

### 3. 设置缓存策略

COS 默认缓存：1 年（已配置）

### 4. 图片优化建议

- 使用 WebP 格式（自动处理）
- 压缩原图（上传前）
- 避免上传超大尺寸

---

## 📚 进阶配置

### 自定义临时目录

```env
CDN_IMG_TMP_PATH=/custom/temp/path
```

### 自定义 COS 区域

```env
TENCENT_COS_REGION=ap-shanghai  # 上海
TENCENT_COS_REGION=ap-beijing   # 北京
TENCENT_COS_REGION=ap-chengdu   # 成都
```

### 调试模式

在构建时查看详细日志：
```bash
DEBUG=* npm run build
```

---

## 🔒 安全最佳实践

### 1. 使用子账号

不要使用主账号密钥，创建子账号并授予最小权限：

- ✅ COS 读写权限
- ❌ 其他服务权限

### 2. 限制 IP 访问

在访问管理（CAM）中配置 IP 白名单。

### 3. 定期轮换密钥

每 3-6 个月更换一次 API 密钥。

### 4. 监控费用

设置费用告警，避免异常流量。

### 5. 备份策略

定期备份 COS 存储桶（可选）。

---

## 💰 成本估算

### 小型博客（示例）

- **图片数量**: 100 张
- **总大小**: 5GB
- **月访问量**: 10,000 PV
- **平均每页**: 5 张图片

**月成本**：
- 存储: ¥0.59
- CDN 流量: ¥2.05
- **总计**: 约 ¥2.64/月 💰

---

## 📖 延伸阅读

- [详细流程说明](./docs/IMAGE_FLOW_SIMPLIFIED.md)
- [腾讯云 COS 配置](./docs/TENCENT_COS_SETUP.md)
- [变更日志](./CHANGELOG_SIMPLIFIED.md)
- [环境变量配置](./ENV_SETUP.md)

---

## 🆘 获取帮助

### 遇到问题？

1. 查看[故障排查](#-故障排查)章节
2. 检查构建日志中的错误信息
3. 查看腾讯云控制台的监控
4. 提交 Issue 到项目仓库

### 需要支持？

- 📧 Email: your@email.com
- 💬 GitHub Issues
- 📖 查看文档目录

---

## ✨ 特性亮点

### 对比旧版本

| 特性 | 旧版本 | 新版本 | 提升 |
|------|--------|--------|------|
| 版本管理 | 需要 | 无需 | ✅ |
| 构建速度 | 慢 | 快 | ⚡ 50% |
| 代码复杂度 | 高 | 低 | 📉 40% |
| 存储效率 | 一般 | 优秀 | 💾 自动去重 |
| 维护成本 | 高 | 低 | 🛠️ |

---

## 🎉 开始使用

运行以下命令开始：

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量（编辑 .env.local）
vim .env.local

# 3. 构建项目
npm run build

# 4. 启动服务
npm run start
```

**就这么简单！享受简化后的图片处理流程吧！** 🚀

---

## 🔄 更新日志

- **2024-12-10**: 简化版发布
  - 移除版本号管理
  - 简化存储结构
  - 提升构建性能

---

**Happy Coding!** 💻✨

