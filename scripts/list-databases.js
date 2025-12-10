#!/usr/bin/env node

/**
 * 列出所有 Notion 数据库及其 ID
 * 
 * 用法:
 *   node scripts/list-databases.js
 */

require('dotenv').config({ path: '.env.local' })
const { Client } = require('@notionhq/client')
const { HttpsProxyAgent } = require('https-proxy-agent')

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
}

function log(color, ...args) {
  console.log(color, ...args, colors.reset)
}

async function listDatabases() {
  console.log('\n' + '='.repeat(70))
  log(colors.cyan, '📊 Notion 数据库列表')
  console.log('='.repeat(70) + '\n')

  // 检查环境变量
  const notionKey = process.env.NOTION_KEY
  const proxyUrl = process.env.NOTION_PROXY_URL || process.env.HTTPS_PROXY || process.env.HTTP_PROXY

  if (!notionKey) {
    log(colors.red, '❌ 错误: NOTION_KEY 未配置')
    log(colors.yellow, '💡 请在 .env.local 中配置 NOTION_KEY')
    process.exit(1)
  }

  // 创建 Notion 客户端
  let notion
  if (proxyUrl) {
    log(colors.blue, `🔗 使用代理: ${proxyUrl}\n`)
    const agent = new HttpsProxyAgent(proxyUrl)
    notion = new Client({
      auth: notionKey,
      agent,
    })
  } else {
    log(colors.yellow, '⚠️  直连模式（无代理）\n')
    notion = new Client({ auth: notionKey })
  }

  try {
    // 搜索所有数据库
    log(colors.yellow, '🔍 正在搜索数据库...\n')
    
    const response = await notion.search({
      filter: {
        property: 'object',
        value: 'data_source',
      },
      page_size: 100,
    })

    if (response.results.length === 0) {
      log(colors.yellow, '⚠️  未找到任何数据库')
      log(colors.cyan, '\n💡 提示:')
      console.log('   1. 确认 Integration 已连接到至少一个数据库')
      console.log('   2. 在 Notion 中将数据库分享给 Integration')
      process.exit(0)
    }

    log(colors.green, `✅ 找到 ${response.results.length} 个数据库\n`)
    console.log('='.repeat(70))

    // 列出每个数据库
    response.results.forEach((db, index) => {
      const title = db.title?.[0]?.plain_text || '(未命名)'
      const id = db.id
      const idFormatted = `${id.slice(0,8)}-${id.slice(8,12)}-${id.slice(12,16)}-${id.slice(16,20)}-${id.slice(20)}`
      const url = db.url
      const createdTime = new Date(db.created_time).toLocaleDateString('zh-CN')

      console.log()
      log(colors.cyan, `📌 数据库 ${index + 1}: ${title}`)
      console.log()
      log(colors.magenta, '   ID (不带连字符):')
      log(colors.green, `   ${id}`)
      console.log()
      log(colors.magenta, '   ID (带连字符):')
      log(colors.green, `   ${idFormatted}`)
      console.log()
      log(colors.magenta, '   URL:')
      console.log(`   ${url}`)
      console.log()
      log(colors.magenta, '   创建时间:')
      console.log(`   ${createdTime}`)
      console.log()
      log(colors.magenta, '   在代码中使用:')
      log(colors.blue, `   data_source_id: '${id}'`)
      console.log()
      console.log('─'.repeat(70))
    })

    // 生成环境变量建议
    console.log()
    log(colors.cyan, '💡 环境变量配置建议:')
    console.log()
    
    response.results.forEach((db, index) => {
      const title = db.title?.[0]?.plain_text || '(未命名)'
      const id = db.id
      const varName = title
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '')
      
      log(colors.yellow, `# ${title}`)
      log(colors.green, `NOTION_${varName}_ID=${id}`)
      console.log()
    })

    console.log('='.repeat(70))
    log(colors.green, '\n✅ 完成！\n')

  } catch (error) {
    console.log()
    console.log('='.repeat(70))
    log(colors.red, '❌ 查询失败')
    console.log()
    log(colors.red, '错误信息:')
    console.error('   ', error.message)
    console.log()

    // 提供解决建议
    log(colors.yellow, '💡 解决建议:')
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      console.log('   1. 检查网络连接')
      if (proxyUrl) {
        console.log('   2. 检查代理是否正常运行')
        console.log('   3. 尝试其他代理或直连模式')
      } else {
        console.log('   2. 如果在国内，建议配置代理')
      }
    } else if (error.code === 'unauthorized') {
      console.log('   1. 检查 NOTION_KEY 是否正确')
      console.log('   2. 确认 Integration 已创建')
    } else if (error.message.includes('API version')) {
      console.log('   1. SDK 版本可能不兼容')
      console.log('   2. 尝试更新 @notionhq/client')
    }

    console.log()
    console.log('📖 详细文档: docs/HOW_TO_GET_DATA_SOURCE_ID.md')
    console.log('='.repeat(70) + '\n')
    process.exit(1)
  }
}

// 运行
listDatabases()

