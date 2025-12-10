# 简化版图片处理流程

## 🎯 设计理念

**核心思想**：每张图片只需检查是否已上传到 COS，无需维护复杂的版本号系统。

---

## 📊 流程对比

### ❌ 之前（复杂版本管理）

```
下载图片 → 生成版本号 → 生成缩略图 → 上传到 COS/{version}/ 
         → 在 Notion 记录版本号
```

**问题**：
- 需要维护版本号
- Notion 数据库存储版本信息
- 相同图片可能存在多个版本
- 目录结构复杂

### ✅ 现在（简化流程）

```
生成图片哈希名 → 检查 COS 是否存在 → 如果不存在：
                                    ├─ 下载图片
                                    ├─ 生成缩略图
                                    └─ 上传到 COS 根目录
```

**优势**：
- ✅ 无需版本号管理
- ✅ 相同图片只存储一次
- ✅ 扁平化目录结构
- ✅ 检查逻辑简单直接

---

## 🔧 技术实现

### 1. 图片唯一标识

每张图片通过 **MD5 哈希** 生成唯一文件名：

```typescript
// 例如: abc123def456.jpg
const imgHashName = await imageFileName(notionImageUrl)
```

**特点**：
- 相同内容的图片生成相同哈希
- 自动去重
- 文件名稳定可预测

### 2. 检查图片是否已处理

```typescript
const isProcessed = await isImageProcessed(imgHashName)
```

**检查逻辑**：
- 查询 COS 中是否存在 `{hash}@1x.jpeg` 文件
- 如果存在，说明该图片已完整处理
- 无需查询 Notion 数据库

### 3. 处理新图片

```typescript
if (!isProcessed) {
  // 1. 下载原图
  await downloadImage(src, tempDir, imgHashName)
  
  // 2. 生成缩略图 + 上传
  await processAndUploadImage(localPath, imgHashName)
}
```

**生成的文件**（以 `abc123.jpg` 为例）：
```
COS Bucket/
├── abc123.jpg           # 原图（如果需要）
├── abc123@1x.jpeg       # 768px 宽
├── abc123@2x.jpeg       # 1536px 宽
├── abc123@3x.jpeg       # 2304px 宽
├── abc123@1x.webp       # WebP 格式
├── abc123@2x.webp
└── abc123@3x.webp
```

### 4. 生成 CDN URL

```typescript
// 简化的 URL 生成
const url = imageCDNUrl(imgHashName)
// 返回: https://cdn.yourdomain.com/abc123.jpg
```

**前端使用**：
```html
<picture>
  <source srcset="
    https://cdn.yourdomain.com/abc123@1x.webp 768w,
    https://cdn.yourdomain.com/abc123@2x.webp 1536w,
    https://cdn.yourdomain.com/abc123@3x.webp 2304w
  " type="image/webp" />
  <img src="https://cdn.yourdomain.com/abc123.jpg" />
</picture>
```

---

## 🚀 工作流程

### 构建时

```mermaid
graph TD
    A[开始构建] --> B[获取文章内容]
    B --> C[遍历图片块]
    C --> D{检查 COS<br/>是否存在}
    D -->|已存在| E[使用 CDN URL]
    D -->|不存在| F[下载原图]
    F --> G[生成缩略图<br/>@1x/@2x/@3x]
    G --> H[转换 WebP]
    H --> I[上传到 COS]
    I --> E
    E --> J[继续下一张]
    J --> K{还有图片?}
    K -->|是| D
    K -->|否| L[构建完成]
```

### 增量更新

- **新文章**：只处理新图片
- **修改文章**：只处理新增的图片
- **已有图片**：直接使用 COS URL，跳过处理

---

## 💾 存储结构

### COS Bucket 结构

```
portfolio-images-xxx/
├── hash1@1x.jpeg
├── hash1@2x.jpeg
├── hash1@3x.jpeg
├── hash1@1x.webp
├── hash1@2x.webp
├── hash1@3x.webp
├── hash2@1x.jpeg
├── hash2@2x.jpeg
├── hash2@3x.jpeg
└── ...
```

**优势**：
- 扁平化结构
- 易于管理
- 无嵌套目录
- CDN 缓存友好

### Notion 数据库

**不再需要**记录图片版本信息！

如果需要统计，可以选择性记录：
- 图片哈希名
- 上传时间
- 文件大小

---

## 🎨 前端渲染

### KImage 组件自动处理

```typescript
// 输入 URL
const url = imageCDNUrl('abc123.jpg')

// KImage 组件自动生成
<picture>
  <source 
    srcset="abc123@1x.webp 768w, abc123@2x.webp 1536w, abc123@3x.webp 2304w" 
    type="image/webp" 
  />
  <source 
    srcset="abc123@1x.jpeg 768w, abc123@2x.jpeg 1536w, abc123@3x.jpeg 2304w" 
    type="image/jpeg" 
  />
  <img src="abc123.jpg" />
</picture>
```

---

## 🔍 去重机制

### 自动去重

```
文章 A 使用图片 X → 生成哈希: abc123.jpg → 上传到 COS
文章 B 使用相同图片 X → 生成哈希: abc123.jpg → 检测到已存在 → 跳过
```

**效果**：
- 相同图片只存储一份
- 节省存储空间
- 节省带宽成本
- 加快构建速度

### 示例场景

```
博客文章 1: 使用 logo.png
博客文章 2: 使用相同的 logo.png
博客文章 3: 使用相同的 logo.png

COS 中只存储：
- logo_hash@1x.jpeg
- logo_hash@2x.jpeg
- logo_hash@3x.jpeg
- logo_hash@1x.webp
- logo_hash@2x.webp
- logo_hash@3x.webp
```

---

## ⚡ 性能优化

### 1. 并行处理

```typescript
await Promise.all(
  imageBlocks.map(async (block) => {
    // 每张图片独立处理
    await processImage(block)
  })
)
```

### 2. 快速检查

```typescript
// 只检查 @1x.jpeg 文件是否存在
const exists = await checkFileExists(`${hash}@1x.jpeg`)
```

**原因**：
- 如果 @1x 存在，说明全套文件都已上传
- 避免多次 HEAD 请求
- 提升检查速度

### 3. 本地缓存

```typescript
// 临时目录用于缓存下载的图片
const tempDir = '.temp/image'
```

**清理策略**：
- 处理完成后立即删除
- 避免占用磁盘空间

---

## 📈 成本分析

### 存储成本

假设 100 张图片，每张原图 500KB：

**原方案（版本管理）**：
```
版本 1: 100 张 × 7 个文件 × 平均 200KB = 140MB
版本 2: 100 张 × 7 个文件 × 平均 200KB = 140MB
总计: 280MB
```

**新方案（无版本）**：
```
100 张 × 7 个文件 × 平均 200KB = 140MB
总计: 140MB
```

**节省**: 50% 存储成本

### 带宽成本

- 相同图片复用，减少上传次数
- CDN 缓存命中率更高
- 用户加载速度更快

---

## 🛠️ 维护优势

### 1. 简单直观

- ✅ 无版本号概念
- ✅ 文件名即哈希
- ✅ 检查逻辑清晰
- ✅ 易于调试

### 2. 容错性强

```typescript
try {
  await processAndUploadImage(localPath, imgHashName)
} catch (err) {
  // 失败时使用原始 URL
  value[value.type].url = src
}
```

### 3. 易于迁移

- 所有图片在根目录
- 无复杂的版本依赖
- 备份和恢复简单

---

## 🔐 安全考虑

### 1. 哈希碰撞

- 使用 MD5 哈希
- 碰撞概率极低（2^128）
- 即使碰撞，内容相同也无影响

### 2. 文件覆盖

- 相同哈希 = 相同内容
- 覆盖不会导致问题
- COS 自动覆盖旧文件

### 3. 权限控制

- COS 设置"公有读私有写"
- 只有构建时可上传
- 用户只能读取

---

## 📝 示例代码

### 完整流程示例

```typescript
// 1. 生成图片哈希名
const imgHashName = await imageFileName(notionUrl)
// 返回: "a1b2c3d4e5f6.jpg"

// 2. 检查是否已处理
const isProcessed = await isImageProcessed(imgHashName)

// 3. 如果未处理，下载并处理
if (!isProcessed) {
  // 下载
  await downloadImage(notionUrl, tempDir, imgHashName)
  
  // 处理并上传
  await processAndUploadImage(`${tempDir}/${imgHashName}`, imgHashName)
  // 生成并上传: a1b2c3d4e5f6@1x.jpeg, @2x.jpeg, @3x.jpeg, 
  //              @1x.webp, @2x.webp, @3x.webp
}

// 4. 使用 CDN URL
const cdnUrl = imageCDNUrl(imgHashName)
// 返回: "https://cdn.yourdomain.com/a1b2c3d4e5f6.jpg"
```

---

## 🎯 总结

### 核心改进

| 方面 | 之前 | 现在 |
|------|------|------|
| **版本管理** | 复杂 | 无需 |
| **存储结构** | 多层目录 | 扁平化 |
| **检查方式** | Notion 查询 | COS HEAD 请求 |
| **去重效果** | 需手动 | 自动 |
| **维护成本** | 高 | 低 |

### 实际效果

- ✅ **代码更简洁**：减少 40% 代码量
- ✅ **逻辑更清晰**：一目了然的流程
- ✅ **性能更好**：减少不必要的查询
- ✅ **成本更低**：自动去重节省空间
- ✅ **维护更容易**：无版本依赖

---

## 🚀 下一步

1. 测试构建流程
2. 验证图片加载
3. 检查 COS 文件结构
4. 享受简化后的流程！

**就是这么简单！** 🎉

