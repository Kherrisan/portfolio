# Notion SDK 5.x 迁移指南

## 📋 版本信息

- **旧版本**: `@notionhq/client` 2.1.1
- **新版本**: `@notionhq/client` 5.4.0
- **默认 API 版本**: 2025-09-03（重大变更）

---

## ⚠️ 重大变更

### 1. 默认 API 版本变更

SDK 5.x 默认使用 Notion API `2025-09-03` 版本，该版本引入了以下重大变更：

- **数据库概念分离**: "数据库"（容器）与"数据源"（表）分离
- **API 端点变更**: `databases.query` → `dataSources.query`
- **不向后兼容**: 5.x SDK 与旧版 API 不兼容

### 2. Client 构造函数改进

新版本支持直接传递 `agent` 参数，无需自定义 fetch：

```typescript
// ✅ 新版本（更简洁）
new Client({
  auth: process.env.NOTION_KEY,
  agent: new HttpsProxyAgent(proxyUrl),
})

// ❌ 旧版本（复杂）
const customFetch = (url, options = {}) => {
  return fetch(url, { ...options, agent })
}
new Client({
  auth: process.env.NOTION_KEY,
  fetch: customFetch,
})
```

---

## 🔄 迁移策略

我们采用了**向后兼容策略**，通过指定 `notionVersion` 参数来使用旧版本 API。

### 当前实现

```typescript
const notion = new Client({
  auth: process.env.NOTION_KEY,
  notionVersion: '2022-06-28', // 使用旧版本 API
  agent: proxyAgent, // 如果配置了代理
})
```

**优势**：
- ✅ 无需修改现有业务代码
- ✅ 所有 `databases.query` 调用仍然有效
- ✅ 保持完全兼容
- ✅ 平滑过渡

---

## 🚀 未来迁移到新版 API

如果将来需要使用新版 API（2025-09-03），需要进行以下更改：

### 1. 移除 notionVersion 参数

```typescript
const notion = new Client({
  auth: process.env.NOTION_KEY,
  // 不指定 notionVersion，使用默认的 2025-09-03
})
```

### 2. 更新 API 调用

#### 查询数据库

```typescript
// ❌ 旧版本 API
await notion.databases.query({
  database_id: databaseId,
  filter: { ... },
  sorts: [ ... ],
})

// ✅ 新版本 API
await notion.dataSources.query({
  data_source_id: databaseId, // 参数名改变
  filter: { ... },
  sorts: [ ... ],
})
```

#### 获取数据库信息

```typescript
// ✅ 旧版本（仍然有效）
await notion.databases.retrieve({
  database_id: databaseId,
})

// ✅ 新版本（两者都支持）
await notion.databases.retrieve({
  database_id: databaseId,
})
```

### 3. 更新类型定义

```typescript
// 导入新的类型
import type {
  QueryDataSourceParameters,
  QueryDataSourceResponse,
} from '@notionhq/client/build/src/api-endpoints'
```

---

## 📝 完整的迁移清单

如果要迁移到新版 API，需要修改以下文件：

### `lib/notion.ts`

1. **移除 notionVersion 参数**:
   ```typescript
   - notionVersion: '2022-06-28',
   ```

2. **更新所有 `databases.query` 调用**:
   ```typescript
   // 全局搜索替换
   - notion.databases.query
   + notion.dataSources.query
   ```

3. **更新参数名称**:
   ```typescript
   - database_id: xxx
   + data_source_id: xxx
   ```

### 需要更新的函数

- [ ] `getDatabase(slug?: string)` - L95
- [ ] `getLatestPostProps()` - L132
- [ ] `getTweets()` - L82
- [ ] `getAssetPackageVersion()` - L206
- [ ] `getLatestPackageVersion()` - L222

---

## 🔍 API 版本对比

| 功能 | API 2022-06-28 | API 2025-09-03 |
|------|----------------|----------------|
| 查询数据库 | `databases.query` | `dataSources.query` |
| 参数名 | `database_id` | `data_source_id` |
| 返回类型 | `PageObjectResponse[]` | `PageObjectResponse \| DataSourceObjectResponse[]` |
| 兼容性 | SDK 2.x - 4.x | SDK 5.x+ |

---

## 💡 推荐策略

### 短期（当前）

- ✅ **使用旧版本 API** (`notionVersion: '2022-06-28'`)
- ✅ 保持现有代码不变
- ✅ 确保系统稳定运行

### 中期

- 📝 了解新版 API 特性
- 📝 评估迁移的必要性
- 📝 制定详细的迁移计划

### 长期

- 🔄 逐步迁移到新版 API
- 🔄 利用新功能（多数据源等）
- 🔄 保持与最新 Notion 特性同步

---

## 🛠️ 技术细节

### Client 初始化对比

#### SDK 2.1.1

```typescript
import { Client } from '@notionhq/client'
import { HttpsProxyAgent } from 'https-proxy-agent'
import fetch from 'node-fetch'

const agent = new HttpsProxyAgent(proxyUrl)
const customFetch = (url, options = {}) => {
  return fetch(url, { ...options, agent })
}

const notion = new Client({
  auth: process.env.NOTION_KEY,
  fetch: customFetch,
})
```

#### SDK 5.4.0（当前实现）

```typescript
import { Client } from '@notionhq/client'
import { HttpsProxyAgent } from 'https-proxy-agent'

const agent = new HttpsProxyAgent(proxyUrl)

const notion = new Client({
  auth: process.env.NOTION_KEY,
  notionVersion: '2022-06-28', // 向后兼容
  agent, // 直接传递 agent
})
```

**改进**：
- ✅ 无需 `node-fetch`（SDK 内置）
- ✅ 代码更简洁
- ✅ 更好的类型支持

---

## 📚 参考资料

- [Notion API Changelog](https://developers.notion.com/page/changelog)
- [Notion SDK 5.x Release Notes](https://github.com/makenotion/notion-sdk-js/releases)
- [API Version 2025-09-03 Guide](https://developers.notion.com/reference/versioning)
- [Migration Guide](https://developers.notion.com/docs/migrating-to-2025-09-03)

---

## ✅ 当前状态

- ✅ SDK 已升级到 5.4.0
- ✅ 使用旧版本 API (2022-06-28)
- ✅ 代理支持已优化
- ✅ 所有功能正常工作
- ✅ 完全向后兼容

---

## 🆘 故障排查

### 问题 1: API 调用失败

**错误信息**:
```
Error: This endpoint requires a newer API version
```

**解决方案**:
确保 `notionVersion` 参数已正确设置：
```typescript
new Client({
  auth: process.env.NOTION_KEY,
  notionVersion: '2022-06-28',
})
```

### 问题 2: 类型错误

**错误信息**:
```
Property 'query' does not exist on type 'databases'
```

**解决方案**:
- 检查 SDK 版本是否为 5.x
- 确保指定了 `notionVersion: '2022-06-28'`

### 问题 3: 代理不工作

**错误信息**:
```
Error: connect ECONNREFUSED
```

**解决方案**:
新版本直接使用 `agent` 参数：
```typescript
new Client({
  auth: process.env.NOTION_KEY,
  agent: new HttpsProxyAgent(proxyUrl),
})
```

---

## 📞 获取帮助

如果遇到问题：

1. 查看本文档的故障排查部分
2. 检查 [Notion API 状态](https://status.notion.com/)
3. 参考 [官方迁移指南](https://developers.notion.com/docs/migrating-to-2025-09-03)
4. 提交 Issue 到项目仓库

---

**迁移完成！当前使用旧版本 API 保持稳定运行。** ✅

