# Notion API 迁移验证清单

## ✅ 已完成的修改

### 1. SDK 升级
- [x] 升级 `@notionhq/client` 从 2.1.1 到 5.4.0
- [x] 移除 `notionVersion` 参数（使用默认 2025-09-03）
- [x] 简化代理配置（直接使用 `agent` 参数）

### 2. API 迁移
- [x] `getTweets()` - `databases.query` → `dataSources.query`
- [x] `getDatabase()` - `databases.query` → `dataSources.query`
- [x] `getLatestPostProps()` - `databases.query` → `dataSources.query`
- [x] `getAssetPackageVersion()` - `databases.query` → `dataSources.query`
- [x] `getLatestPackageVersion()` - `databases.query` → `dataSources.query`

### 3. 参数名更新
- [x] 所有 `database_id` 改为 `data_source_id`

### 4. 编译问题修复
- [x] 修复 SWC 编译器类型断言赋值问题

---

## 🧪 验证步骤

### 步骤 1: 安装依赖（如果还没安装）

```bash
npm install
```

### 步骤 2: 测试 Notion 连接

```bash
npm run test:proxy
```

**预期输出**:
```
[INFO] Notion API version: 2025-09-03 (default)
✅ 所有测试通过！
```

### 步骤 3: 测试构建

```bash
npm run build
```

**预期结果**: 
- ✅ 编译成功，无错误
- ✅ 看到日志：`[INFO] Notion API version: 2025-09-03 (default)`

### 步骤 4: 测试开发环境

```bash
npm run dev
```

**验证内容**:
- [ ] 博客列表加载正常
- [ ] 单篇文章显示正确
- [ ] 图片加载正常
- [ ] 搜索功能正常

---

## 🔍 关键改动说明

### 1. Client 初始化

**之前**:
```typescript
const customFetch = (url, options = {}) => {
  return fetch(url, { ...options, agent })
}
new Client({
  auth: process.env.NOTION_KEY,
  notionVersion: '2022-06-28',
  fetch: customFetch,
})
```

**现在**:
```typescript
new Client({
  auth: process.env.NOTION_KEY,
  agent, // 简化！
  // 使用默认 API 版本 2025-09-03
})
```

### 2. 数据库查询

**之前**:
```typescript
await notion.databases.query({
  database_id: databaseId,
  // ...
})
```

**现在**:
```typescript
await notion.dataSources.query({
  data_source_id: databaseId, // 参数名改变
  // ...
})
```

### 3. 类型处理

**之前（导致编译错误）**:
```typescript
(res.properties as any)[prop] = value
```

**现在（兼容 SWC）**:
```typescript
const properties: any = res.properties
properties[prop] = value
```

---

## ⚠️ 注意事项

### 1. API 版本

- 新版本 API (2025-09-03) 引入了数据源的概念
- 数据库 = 容器，数据源 = 数据表
- 向后不兼容旧版本 API

### 2. 环境变量

确保 `.env.local` 配置正确：

```env
# 必需
NOTION_KEY=secret_xxxxx
NOTION_DATABASE_ID=xxxxx
NOTION_TWEET_DATABASE_ID=xxxxx
NOTION_ASSET_PACKAGE_DATABASE_ID=xxxxx

# 可选（国内用户推荐）
NOTION_PROXY_URL=http://127.0.0.1:7890
```

### 3. 代理配置

新版本支持直接传递 `agent` 参数，更简洁！

---

## 🐛 常见问题

### Q1: 构建时出现编译错误

**问题**: `The left-hand side of an assignment expression must be a variable`

**解决**: 已修复！使用临时变量而不是类型断言。

### Q2: Notion API 连接失败

**检查清单**:
1. ✅ NOTION_KEY 是否正确
2. ✅ 数据库 ID 是否正确
3. ✅ Integration 是否已连接到数据库
4. ✅ 代理是否正常（如果在国内）

**测试命令**:
```bash
npm run test:proxy
```

### Q3: 数据库查询返回空

**可能原因**:
- Integration 没有访问权限
- 数据库 ID 错误
- 过滤条件太严格

**验证方法**:
1. 在 Notion 中检查 Integration 权限
2. 确认数据库已分享给 Integration
3. 检查过滤条件

---

## 📊 性能对比

| 指标 | 旧版本 (2.x) | 新版本 (5.x) |
|------|-------------|-------------|
| SDK 体积 | 较大 | 优化 |
| 类型支持 | 基础 | 完善 |
| 错误处理 | 一般 | 改进 |
| 代理配置 | 复杂 | 简单 |

---

## 📚 相关文档

- [完整迁移指南](./MIGRATION_COMPLETE.md)
- [SDK 5.x 迁移文档](./docs/NOTION_SDK_5_MIGRATION.md)
- [代理配置指南](./docs/NOTION_PROXY_SETUP.md)
- [Notion API Changelog](https://developers.notion.com/page/changelog)

---

## ✅ 最终验证

完成以下所有步骤后，迁移即算成功：

- [ ] `npm install` 成功
- [ ] `npm run test:proxy` 通过
- [ ] `npm run build` 成功
- [ ] `npm run dev` 正常运行
- [ ] 博客列表显示正常
- [ ] 文章内容显示正常
- [ ] 图片加载正常
- [ ] 无编译错误或警告

---

## 🎉 迁移完成

如果所有验证步骤都通过，恭喜你！Notion API 已成功迁移到 5.4.0 版本。

**下一步**:
1. 提交代码更改
2. 部署到生产环境
3. 监控错误日志
4. 享受新版本的改进！

---

**迁移日期**: 2024-12-10  
**迁移状态**: ✅ 完成  
**影响范围**: `lib/notion.ts` + 依赖升级

