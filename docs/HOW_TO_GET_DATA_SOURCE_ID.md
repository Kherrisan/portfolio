# 如何获取 Notion Data Source ID

## 🎯 重要说明

在 Notion API 2025-09-03 版本中：

**💡 对于大多数情况，`data_source_id` = `database_id`**

新版本 API 引入了"数据源"（DataSource）的概念，但对于普通用户创建的数据库，数据库 ID 就是数据源 ID。

---

## 📋 方法 1: 从数据库 URL 获取（推荐）

### 步骤 1: 打开你的 Notion 数据库

在 Notion 中打开你要使用的数据库（Database）。

### 步骤 2: 复制数据库 URL

URL 格式如下：
```
https://www.notion.so/{workspace_name}/{database_id}?v={view_id}
```

### 步骤 3: 提取 ID

从 URL 中提取 32 位字符串（数据库 ID）：

**示例 URL**:
```
https://www.notion.so/myworkspace/b3f55ea317de4af39aefcab597bcf7d5?v=xxx
```

**提取的 ID**:
```
b3f55ea317de4af39aefcab597bcf7d5
```

这个 ID 就是你的 `data_source_id`！

---

## 📋 方法 2: 使用"复制链接到数据库"功能

### 步骤 1: 右键点击数据库

在 Notion 中，右键点击数据库标题。

### 步骤 2: 选择"复制链接到数据库"

![Copy Link to Database](https://i.imgur.com/example.png)

### 步骤 3: 粘贴并提取 ID

粘贴链接后，提取其中的 32 位字符串。

**链接示例**:
```
https://www.notion.so/b3f55ea317de4af39aefcab597bcf7d5
```

**ID**:
```
b3f55ea317de4af39aefcab597bcf7d5
```

---

## 📋 方法 3: 使用 Notion API（高级）

### 使用 API 列出所有数据库

```javascript
const { Client } = require('@notionhq/client')

const notion = new Client({ auth: process.env.NOTION_KEY })

async function listDatabases() {
  const response = await notion.search({
    filter: { property: 'object', value: 'database' }
  })
  
  response.results.forEach(db => {
    console.log(`数据库名称: ${db.title[0]?.plain_text}`)
    console.log(`Data Source ID: ${db.id}`)
    console.log('---')
  })
}

listDatabases()
```

---

## 🔧 ID 格式说明

### 标准格式

Notion ID 有两种格式：

#### 1. 带连字符（32位 + 连字符）
```
b3f55ea3-17de-4af3-9aef-cab597bcf7d5
```

#### 2. 不带连字符（32位纯字符）
```
b3f55ea317de4af39aefcab597bcf7d5
```

**⚠️ 重要**: Notion API **两种格式都接受**！

---

## 💻 在项目中配置

### 1. 找到你的数据库

在 Notion 中，找到以下数据库：

- **博客数据库** - 存储博客文章
- **推文数据库** - 存储推文/动态
- **资源数据库** - 存储图片版本信息

### 2. 获取每个数据库的 ID

按照上面的方法，获取每个数据库的 ID。

### 3. 配置到 `.env.local`

```env
# Notion 数据库 ID（也是 data_source_id）
NOTION_DATABASE_ID=b3f55ea317de4af39aefcab597bcf7d5
NOTION_TWEET_DATABASE_ID=3d75457bd05b4072a8bd322b6f5eec65
NOTION_ASSET_PACKAGE_DATABASE_ID=f2e0ae9f9ec34304be9b1df6c15a2696
```

---

## 🎯 实际示例

### 我的博客数据库

**Notion URL**:
```
https://www.notion.so/my-blog/b3f55ea317de4af39aefcab597bcf7d5?v=1234
```

**提取 ID**:
```
b3f55ea317de4af39aefcab597bcf7d5
```

**在代码中使用**:
```typescript
const { results } = await notion.dataSources.query({
  data_source_id: 'b3f55ea317de4af39aefcab597bcf7d5',
  filter: { ... },
  sorts: [ ... ],
})
```

---

## 🔍 验证 Data Source ID

### 创建测试脚本

创建 `scripts/test-data-source.js`:

```javascript
require('dotenv').config({ path: '.env.local' })
const { Client } = require('@notionhq/client')

const notion = new Client({ auth: process.env.NOTION_KEY })

async function testDataSource() {
  const dataSourceId = process.env.NOTION_DATABASE_ID
  
  console.log(`测试 Data Source ID: ${dataSourceId}`)
  
  try {
    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      page_size: 1,
    })
    
    console.log('✅ Data Source ID 有效！')
    console.log(`找到 ${response.results.length} 条记录`)
  } catch (error) {
    console.error('❌ Data Source ID 无效或无权限')
    console.error(error.message)
  }
}

testDataSource()
```

### 运行测试

```bash
node scripts/test-data-source.js
```

---

## ❓ 常见问题

### Q1: Database ID 和 Data Source ID 有什么区别？

**A**: 对于普通用户创建的数据库：
- **在 API 2022-06-28 中**: 使用 `database_id`
- **在 API 2025-09-03 中**: 使用 `data_source_id`
- **值是相同的**: 同一个 32 位字符串

### Q2: 为什么要改名？

**A**: 新版本 API 引入了多数据源的概念：
- **数据库（Database）**: 容器
- **数据源（DataSource）**: 实际的数据表

一个数据库可以包含多个数据源，但大多数情况下只有一个默认数据源。

### Q3: 我的旧 Database ID 还能用吗？

**A**: 能！在新版本 API 中：
```typescript
// 这两者是等价的（对于默认数据源）
data_source_id: 'b3f55ea317de4af39aefcab597bcf7d5'
// 等同于
database_id: 'b3f55ea317de4af39aefcab597bcf7d5'
```

### Q4: 如何知道数据库有多个数据源？

**A**: 大多数用户创建的数据库只有一个默认数据源。多数据源是高级功能，通常用于：
- 企业级应用
- 复杂的数据集成
- 通过 API 创建的特殊数据库

### Q5: 数据库 URL 中的 `?v=xxx` 是什么？

**A**: 那是**视图 ID**（View ID），不是数据源 ID。
- 数据源 ID: 数据表本身
- 视图 ID: 数据的不同展示方式（表格、看板、日历等）

---

## 🛠️ 实用工具

### ID 格式转换器

如果你的 ID 有连字符，想去掉：

```javascript
// 带连字符
const idWithDashes = 'b3f55ea3-17de-4af3-9aef-cab597bcf7d5'

// 去掉连字符
const idWithoutDashes = idWithDashes.replace(/-/g, '')
console.log(idWithoutDashes)
// 输出: b3f55ea317de4af39aefcab597bcf7d5
```

反过来也可以：

```javascript
// 不带连字符
const id = 'b3f55ea317de4af39aefcab597bcf7d5'

// 添加连字符（标准 UUID 格式）
const formatted = `${id.slice(0,8)}-${id.slice(8,12)}-${id.slice(12,16)}-${id.slice(16,20)}-${id.slice(20)}`
console.log(formatted)
// 输出: b3f55ea3-17de-4af3-9aef-cab597bcf7d5
```

---

## 🔐 安全提示

### 不要公开你的 Data Source ID

虽然 Data Source ID 本身不是密钥，但它暴露了你的数据库结构：

- ✅ 将 ID 保存在 `.env.local` 中
- ✅ 不要提交 `.env.local` 到 Git
- ✅ 使用 `.gitignore` 排除环境变量文件

```gitignore
# .gitignore
.env.local
.env*.local
```

---

## 📝 快速参考

### 获取 Data Source ID 的最快方法

1. 打开 Notion 数据库
2. 看浏览器地址栏
3. 复制 URL 中的 32 位字符串
4. 粘贴到 `.env.local`

**就这么简单！** 🎉

---

## 📚 相关文档

- [Notion API 文档](https://developers.notion.com/reference/post-data-source-query)
- [数据源概念说明](https://developers.notion.com/docs/working-with-databases)
- [迁移指南](./NOTION_SDK_5_MIGRATION.md)
- [环境变量配置](../ENV_SETUP.md)

---

## 💡 总结

**关键要点**:
1. ✅ Data Source ID = Database ID（对于普通数据库）
2. ✅ 从 Notion URL 中提取 32 位字符串
3. ✅ 两种格式（带/不带连字符）都可以使用
4. ✅ 配置到 `.env.local` 中
5. ✅ 不要公开你的 ID

**需要帮助？** 查看 [故障排查指南](../MIGRATION_CHECKLIST.md) 或运行 `npm run test:proxy` 测试连接。

