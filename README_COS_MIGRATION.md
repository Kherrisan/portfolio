# 图片 CDN 迁移说明

## 📝 迁移概述

本项目已从 **NPM CDN** 迁移到 **腾讯云对象存储（COS）**，用于更稳定、更快速的图片加载。

---

## 🔄 主要变更

### 1. 新增文件

- **`lib/tencent-cos.ts`**: 腾讯云 COS 工具库
  - 实现图片上传到 COS
  - 生成 CDN URL
  - 版本管理

- **`docs/TENCENT_COS_SETUP.md`**: 详细配置指南
- **`ENV_SETUP.md`**: 环境变量配置说明
- **`.env.example`**: 环境变量模板

### 2. 修改的文件

- **`pages/blog/[slug].tsx`**: 
  - 从 `lib/npm.ts` 改为 `lib/tencent-cos.ts`
  - 更新图片处理流程

- **`package.json`**: 
  - 新增依赖 `cos-nodejs-sdk-v5`

### 3. 保留的文件

- **`lib/npm.ts`**: 保留原有代码，可选择性使用
- **`lib/backblaze.ts`**: 备用存储方案

---

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
# 或
yarn install
```

### 2. 配置环境变量

创建 `.env.local` 文件：

```bash
# 复制模板
cp .env.example .env.local

# 编辑配置
vim .env.local
```

填入必需的配置：

```env
# Notion API
NOTION_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_TWEET_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_ASSET_PACKAGE_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 腾讯云 COS
TENCENT_COS_SECRET_ID=AKIDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TENCENT_COS_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TENCENT_COS_BUCKET=your-bucket-name-1234567890
TENCENT_COS_REGION=ap-guangzhou
TENCENT_COS_CDN_DOMAIN=https://cdn.yourdomain.com  # 可选
```

### 3. 配置腾讯云 COS

详细步骤请参考: [docs/TENCENT_COS_SETUP.md](./docs/TENCENT_COS_SETUP.md)

### 4. 构建测试

```bash
npm run build
```

---

## 📊 对比分析

| 特性 | NPM CDN | 腾讯云 COS |
|------|---------|------------|
| **成本** | 免费 | ~¥3/月 |
| **速度** | 中等 | 快速（CDN加速） |
| **稳定性** | 一般 | 高（99.9%+） |
| **带宽** | 有限 | 充足 |
| **控制力** | 低 | 高 |
| **管理** | 简单 | 需配置 |

---

## 🔧 技术细节

### 图片处理流程

```
Notion 图片 
  ↓
下载到本地临时目录
  ↓
生成多尺寸缩略图
  - @1x (768px)
  - @2x (1536px)
  - @3x (2304px)
  ↓
生成 WebP 格式
  ↓
上传到腾讯云 COS
  ↓
返回 CDN URL
  ↓
前端响应式加载
```

### 版本管理

- 每张图片生成 MD5 哈希作为文件名
- 在 Notion 数据库中记录版本号
- 避免重复处理相同图片
- 版本格式: `1.0.{递增}-{pageId前6位}`

### 文件结构

```
COS Bucket/
├── 1.0.1-abc123/
│   ├── hash1.jpg
│   ├── hash1@1x.jpeg
│   ├── hash1@2x.jpeg
│   ├── hash1@3x.jpeg
│   ├── hash1@1x.webp
│   ├── hash1@2x.webp
│   └── hash1@3x.webp
└── 1.0.2-def456/
    └── ...
```

---

## 🐛 故障排查

### 构建失败

**错误**: `Cannot find module 'cos-nodejs-sdk-v5'`

**解决**: 
```bash
npm install cos-nodejs-sdk-v5
```

### 图片上传失败

**错误**: `Access Denied` 或 `403`

**检查清单**:
1. ✅ COS 密钥是否正确
2. ✅ 存储桶名称是否正确
3. ✅ 地域配置是否匹配
4. ✅ 存储桶权限是否为"公有读私有写"

### 图片无法访问

**错误**: 图片 URL 返回 404

**检查清单**:
1. ✅ 文件是否成功上传到 COS
2. ✅ CDN 域名配置是否正确
3. ✅ 如果使用自定义域名，CNAME 是否解析成功
4. ✅ 存储桶是否开启了公有读权限

### ImageMagick 未安装

**错误**: `convert: command not found`

**解决**:
```bash
# macOS
brew install imagemagick

# Ubuntu/Debian
sudo apt-get install imagemagick

# Windows
# 下载安装: https://imagemagick.org/script/download.php
```

---

## 🔄 回滚到 NPM CDN

如果需要回滚到 NPM CDN：

1. 恢复 `pages/blog/[slug].tsx` 中的导入：
```typescript
// 改回
import { imageCDNUrl, IMAGE_NPM_PACKAGE_NAME, IMAGE_NPM_PACKAGE_PATH, nextVersion, publishImage } from '../../lib/npm'
```

2. 恢复相关代码逻辑

3. 重新构建

---

## 🔐 安全建议

1. **使用子账号**: 不要使用主账号密钥
2. **最小权限**: 只授予必要的 COS 权限
3. **IP 白名单**: 限制 API 访问来源
4. **防盗链**: 配置 Referer 白名单
5. **定期轮换**: 每 3-6 个月更换密钥
6. **费用监控**: 设置费用告警

---

## 📚 相关文档

- [腾讯云 COS 配置指南](./docs/TENCENT_COS_SETUP.md)
- [环境变量配置](./ENV_SETUP.md)
- [腾讯云 COS 官方文档](https://cloud.tencent.com/document/product/436)

---

## ❓ 常见问题

### Q: 为什么要迁移到 COS？

A: 
- ✅ 更稳定的服务质量
- ✅ 更快的加载速度（CDN 加速）
- ✅ 更好的控制力和可扩展性
- ✅ 专业的对象存储服务

### Q: 成本会增加多少？

A: 对于个人博客，月成本约 ¥2-5，具体取决于：
- 图片总大小
- 访问量
- 是否使用 CDN

### Q: 可以使用其他云服务商吗？

A: 可以！你可以参考 `lib/tencent-cos.ts` 的实现，适配其他云服务：
- 阿里云 OSS
- 七牛云
- 又拍云
- AWS S3

### Q: 原有的 NPM CDN 图片怎么办？

A: 
- 新文章会自动使用 COS
- 旧文章的图片仍然可以访问（NPM 包不会删除）
- 如需迁移旧图片，清空版本记录并重新构建

---

## 🆘 获取帮助

如果遇到问题：

1. 查看 [docs/TENCENT_COS_SETUP.md](./docs/TENCENT_COS_SETUP.md)
2. 检查构建日志中的错误信息
3. 查看腾讯云控制台的监控和日志
4. 提交 Issue 到项目仓库

---

**迁移完成！** 🎉

现在你的博客图片将通过腾讯云 COS 加速访问，享受更快、更稳定的加载体验！

