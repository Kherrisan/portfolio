# 环境变量配置说明

## 快速开始

1. 复制环境变量模板：
```bash
cp .env.example .env.local
```

2. 编辑 `.env.local`，填入你的配置信息

3. 重启开发服务器

---

## 必需的环境变量

### Notion API

```env
NOTION_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_TWEET_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_ASSET_PACKAGE_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Notion 代理配置（可选，国内用户建议配置）
NOTION_PROXY_URL=http://127.0.0.1:7890
# 或使用标准环境变量
# HTTP_PROXY=http://127.0.0.1:7890
# HTTPS_PROXY=http://127.0.0.1:7890
```

**获取方式**:
1. 访问 [Notion Integrations](https://www.notion.so/my-integrations)
2. 创建新的 Integration，获取 Token
3. 在 Notion 中分享数据库给该 Integration
4. 复制数据库 ID（URL 中的一串字符）

**代理配置**（国内用户推荐）:
- 如果在国内访问 Notion API 不稳定，可以配置代理
- 支持 HTTP/HTTPS/SOCKS5 代理
- 优先级：`NOTION_PROXY_URL` > `HTTPS_PROXY` > `HTTP_PROXY`

### 腾讯云 COS（图片存储）

```env
TENCENT_COS_SECRET_ID=AKIDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TENCENT_COS_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TENCENT_COS_BUCKET=portfolio-images-1234567890
TENCENT_COS_REGION=ap-guangzhou
```

**获取方式**:
1. 登录 [腾讯云控制台](https://console.cloud.tencent.com/)
2. 创建 COS 存储桶
3. 在 [访问管理](https://console.cloud.tencent.com/cam/capi) 获取密钥

详细配置请参考: [docs/TENCENT_COS_SETUP.md](./docs/TENCENT_COS_SETUP.md)

---

## 可选的环境变量

### CDN 加速域名

```env
TENCENT_COS_CDN_DOMAIN=https://cdn.yourdomain.com
```

如果配置了腾讯云 CDN 或自定义域名，填入此项。留空则使用 COS 默认域名。

### Google Scholar API

```env
SERPAPI_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

用于自动同步学术论文列表。访问 [SerpAPI](https://serpapi.com/) 获取。

### Backblaze B2（备用存储）

```env
B2_KEY_ID=your_b2_key_id
B2_APPLICATION_KEY=your_b2_application_key
```

可选的备用图片存储方案。

### 其他配置

```env
# Service Worker 开关（生产环境建议开启）
NEXT_PUBLIC_SERVICE_WORKER=false

# 图片临时存储路径
CDN_IMG_TMP_PATH=.temp/image

# 静态导出路径
NEXT_STATIC_PATH=./out
```

---

## 开发环境 vs 生产环境

### 开发环境 (.env.local)

```env
NEXT_PUBLIC_SERVICE_WORKER=false
```

### 生产环境 (.env.production)

```env
NEXT_PUBLIC_SERVICE_WORKER=true
```

---

## 安全注意事项

⚠️ **重要**: 
- 不要将 `.env.local` 提交到 Git 仓库
- 不要在客户端代码中使用服务端环境变量
- 定期轮换 API 密钥
- 使用子账号密钥，限制权限范围

---

## 故障排查

### 图片上传失败

检查：
1. COS 密钥是否正确
2. 存储桶名称和地域是否匹配
3. 存储桶权限是否为"公有读私有写"

### Notion 连接失败

检查：
1. Integration Token 是否正确
2. 数据库是否已分享给 Integration
3. 数据库 ID 是否正确

### 构建失败

检查：
1. 所有必需的环境变量是否已配置
2. 依赖包是否已安装（运行 `npm install`）
3. ImageMagick 是否已安装（用于图片处理）

---

## ImageMagick 安装

图片缩略图生成需要 ImageMagick：

### macOS
```bash
brew install imagemagick
```

### Ubuntu/Debian
```bash
sudo apt-get install imagemagick
```

### Windows
下载安装: https://imagemagick.org/script/download.php

---

## 验证配置

运行以下命令验证配置是否正确：

```bash
npm run build
```

如果构建成功，说明配置正确。

