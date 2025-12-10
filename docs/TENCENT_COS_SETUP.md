# 腾讯云 COS 配置指南

本项目已从 NPM CDN 迁移到腾讯云对象存储（COS），用于存储和加速博客图片。

## 📋 前置要求

1. 腾讯云账号
2. 已创建 COS 存储桶
3. 已获取 API 密钥（SecretId 和 SecretKey）

---

## 🚀 配置步骤

### 1. 创建 COS 存储桶

1. 登录 [腾讯云控制台](https://console.cloud.tencent.com/cos)
2. 进入"对象存储 COS" → "存储桶列表"
3. 点击"创建存储桶"
4. 配置参数：
   - **名称**: 例如 `portfolio-images-1234567890`（需全局唯一）
   - **所属地域**: 选择离用户最近的地域，如 `广州(ap-guangzhou)`
   - **访问权限**: 选择"公有读私有写"
   - **其他**: 保持默认即可

### 2. 获取 API 密钥

1. 进入 [访问管理控制台](https://console.cloud.tencent.com/cam/capi)
2. 点击"新建密钥"
3. 保存生成的 `SecretId` 和 `SecretKey`

⚠️ **安全提示**: 请妥善保管密钥，不要提交到代码仓库！

### 3. 配置 CDN 加速（可选但推荐）

#### 使用腾讯云 CDN

1. 进入 [CDN 控制台](https://console.cloud.tencent.com/cdn)
2. 点击"域名管理" → "添加域名"
3. 配置参数：
   - **加速域名**: 你的自定义域名，如 `cdn.yourdomain.com`
   - **源站类型**: 选择"COS 源"
   - **源站**: 选择刚创建的 COS 存储桶
   - **回源协议**: HTTPS
4. 完成域名 CNAME 解析
5. 等待 CDN 配置生效（约 5-10 分钟）

#### 配置 HTTPS（推荐）

1. 在 CDN 域名管理中，点击"高级配置"
2. 上传 SSL 证书（可使用免费的 Let's Encrypt 证书）
3. 开启"强制 HTTPS"

### 4. 配置环境变量

复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

编辑 `.env.local`，填入你的配置：

```env
# Notion API 配置
NOTION_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_TWEET_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_ASSET_PACKAGE_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 腾讯云 COS 配置
TENCENT_COS_SECRET_ID=AKIDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TENCENT_COS_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TENCENT_COS_BUCKET=portfolio-images-1234567890
TENCENT_COS_REGION=ap-guangzhou

# 如果配置了 CDN，填入 CDN 域名
TENCENT_COS_CDN_DOMAIN=https://cdn.yourdomain.com
# 如果没有 CDN，留空或注释掉，将自动使用 COS 默认域名

# Google Scholar API
SERPAPI_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 5. 安装依赖

```bash
npm install
# 或
yarn install
```

---

## 🔧 工作原理

### 图片上传流程

```
Notion 图片 → 下载到本地 → 生成多尺寸缩略图 → 上传到 COS → 返回 CDN URL
```

### 文件结构

上传到 COS 的文件结构如下：

```
bucket/
├── 1.0.1-abc123/          # 版本号-页面ID
│   ├── image1.jpg         # 原图
│   ├── image1@1x.jpeg     # 768px 宽
│   ├── image1@2x.jpeg     # 1536px 宽
│   ├── image1@3x.jpeg     # 2304px 宽
│   ├── image1@1x.webp     # WebP 格式
│   ├── image1@2x.webp
│   └── image1@3x.webp
├── 1.0.2-def456/
│   └── ...
```

### 版本管理

- 每次构建时检查图片是否已上传（通过 Notion 数据库记录）
- 已上传的图片直接使用现有版本的 URL
- 新图片会生成新版本号并上传

---

## 📊 成本估算

### COS 存储费用

- **标准存储**: ¥0.118/GB/月（广州地域）
- **外网下行流量**: ¥0.50/GB（前 10TB）

### CDN 费用

- **流量费用**: ¥0.21/GB（中国境内，前 10TB）
- **HTTPS 请求数**: ¥0.05/万次

### 示例计算

假设你的博客：
- 图片总大小: 5GB
- 月访问量: 10,000 PV
- 平均每页 5 张图片，每张 200KB

**月成本估算**:
- 存储费用: 5GB × ¥0.118 = ¥0.59
- CDN 流量: 10,000 × 5 × 0.2MB ÷ 1024 × ¥0.21 ≈ ¥2.05
- **总计**: 约 ¥2.64/月

💡 **对比 NPM CDN**: 完全免费，但稳定性和速度可能不如专业 CDN

---

## 🛠️ 常见问题

### Q1: 图片上传失败怎么办？

**检查清单**:
1. 确认 COS 密钥配置正确
2. 确认存储桶名称和地域正确
3. 确认存储桶权限为"公有读私有写"
4. 查看构建日志中的错误信息

### Q2: 图片无法访问（403/404）

**解决方案**:
1. 检查存储桶访问权限设置
2. 确认文件已成功上传到 COS
3. 如果使用 CDN，检查 CDN 配置是否正确
4. 检查 CORS 配置（如果前端直接访问）

### Q3: 如何配置 CORS？

在 COS 控制台 → 存储桶 → 安全管理 → 跨域访问 CORS 设置：

```json
[
  {
    "allowedOrigins": ["*"],
    "allowedMethods": ["GET", "HEAD"],
    "allowedHeaders": ["*"],
    "maxAgeSeconds": 3600
  }
]
```

### Q4: 如何迁移已有图片？

如果你之前使用 NPM CDN，需要：

1. 清空 Notion 中的图片版本记录数据库
2. 重新构建所有页面，图片会自动上传到 COS
3. 或者手动下载 NPM 包中的图片，批量上传到 COS

### Q5: 可以同时使用 COS 和 NPM CDN 吗？

可以！你可以：
- 保留 `lib/npm.ts` 文件
- 在 `pages/blog/[slug].tsx` 中根据环境变量选择使用哪个 CDN
- 实现双备份策略

---

## 🔐 安全建议

1. **使用子账号密钥**: 不要使用主账号密钥，创建子账号并授予最小权限
2. **限制 IP 访问**: 在 CAM 中配置 IP 白名单
3. **开启防盗链**: 在 COS 控制台配置 Referer 白名单
4. **定期轮换密钥**: 每 3-6 个月更换一次 API 密钥
5. **监控费用**: 设置费用告警，避免异常流量

---

## 📚 相关文档

- [腾讯云 COS 官方文档](https://cloud.tencent.com/document/product/436)
- [COS Node.js SDK](https://cloud.tencent.com/document/product/436/8629)
- [CDN 配置指南](https://cloud.tencent.com/document/product/228)
- [访问管理 CAM](https://cloud.tencent.com/document/product/598)

---

## 🆘 获取帮助

如果遇到问题：
1. 查看构建日志中的错误信息
2. 检查腾讯云控制台的监控和日志
3. 参考本文档的常见问题部分
4. 提交 Issue 到项目仓库

