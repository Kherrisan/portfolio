#!/usr/bin/env node

/**
 * Notion API 代理测试脚本
 * 
 * 用法:
 *   node scripts/test-notion-proxy.js
 * 
 * 或指定代理:
 *   NOTION_PROXY_URL=http://127.0.0.1:7890 node scripts/test-notion-proxy.js
 */

require('dotenv').config({ path: '.env.local' })
const { Client } = require('@notionhq/client')
const { HttpsProxyAgent } = require('https-proxy-agent')
const fetch = require('node-fetch')

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(color, ...args) {
  console.log(color, ...args, colors.reset)
}

async function testNotionConnection() {
  console.log('\n' + '='.repeat(60))
  log(colors.cyan, '🔍 Notion API 代理测试')
  console.log('='.repeat(60) + '\n')

  // 检查环境变量
  const notionKey = process.env.NOTION_KEY
  const databaseId = process.env.NOTION_DATABASE_ID
  const proxyUrl = process.env.NOTION_PROXY_URL || process.env.HTTPS_PROXY || process.env.HTTP_PROXY

  log(colors.blue, '📋 配置信息:')
  console.log(`   Notion Key: ${notionKey ? '✓ 已配置' : '✗ 未配置'}`)
  console.log(`   Database ID: ${databaseId ? '✓ 已配置' : '✗ 未配置'}`)
  console.log(`   代理 URL: ${proxyUrl || '✗ 未配置（直连）'}`)
  console.log()

  if (!notionKey) {
    log(colors.red, '❌ 错误: NOTION_KEY 未配置')
    log(colors.yellow, '💡 请在 .env.local 中配置 NOTION_KEY')
    process.exit(1)
  }

  if (!databaseId) {
    log(colors.red, '❌ 错误: NOTION_DATABASE_ID 未配置')
    log(colors.yellow, '💡 请在 .env.local 中配置 NOTION_DATABASE_ID')
    process.exit(1)
  }

  // 创建 Notion 客户端
  let notion

  if (proxyUrl) {
    log(colors.yellow, '🔄 使用代理连接...')
    const agent = new HttpsProxyAgent(proxyUrl)
    
    const customFetch = (url, options = {}) => {
      return fetch(url, { ...options, agent })
    }
    
    notion = new Client({
      auth: notionKey,
      fetch: customFetch,
    })
  } else {
    log(colors.yellow, '🔄 直连模式（无代理）...')
    notion = new Client({ auth: notionKey })
  }

  // 测试连接
  console.log()
  log(colors.blue, '🧪 开始测试...')
  console.log()

  const startTime = Date.now()

  try {
    // 测试 1: 查询数据库（使用新版本 API）
    log(colors.yellow, '   [1/3] 测试数据源查询...')
    const response = await notion.dataSources.query({
      data_source_id: databaseId, // 新版本 API 使用 data_source_id
      page_size: 1,
    })
    const time1 = Date.now() - startTime
    log(colors.green, `   ✓ 数据库查询成功 (${time1}ms)`)
    log(colors.cyan, `      找到 ${response.results.length} 条记录`)
    console.log()

    // 测试 2: 获取数据库信息
    log(colors.yellow, '   [2/3] 测试数据库信息获取...')
    const dbInfo = await notion.databases.retrieve({
      database_id: databaseId,
    })
    const time2 = Date.now() - startTime - time1
    log(colors.green, `   ✓ 数据库信息获取成功 (${time2}ms)`)
    log(colors.cyan, `      数据库名称: ${dbInfo.title[0]?.plain_text || '未命名'}`)
    console.log()

    // 测试 3: 搜索测试
    log(colors.yellow, '   [3/3] 测试搜索功能...')
    const searchResult = await notion.search({
      filter: { value: 'page', property: 'object' },
      page_size: 5,
    })
    const time3 = Date.now() - startTime - time1 - time2
    log(colors.green, `   ✓ 搜索功能正常 (${time3}ms)`)
    log(colors.cyan, `      找到 ${searchResult.results.length} 个页面`)
    console.log()

    // 总结
    const totalTime = Date.now() - startTime
    console.log('='.repeat(60))
    log(colors.green, '✅ 所有测试通过！')
    console.log()
    log(colors.cyan, `⏱️  总耗时: ${totalTime}ms`)
    
    if (proxyUrl) {
      log(colors.cyan, `🔗 代理地址: ${proxyUrl}`)
      log(colors.green, '💡 代理配置正确，可以正常使用')
    } else {
      log(colors.yellow, '💡 当前使用直连模式')
      log(colors.yellow, '   如果在国内访问不稳定，建议配置代理')
    }
    
    console.log('='.repeat(60) + '\n')
    process.exit(0)

  } catch (error) {
    console.log()
    console.log('='.repeat(60))
    log(colors.red, '❌ 测试失败')
    console.log()
    log(colors.red, '错误信息:')
    console.error('   ', error.message)
    console.log()

    // 提供解决建议
    log(colors.yellow, '💡 解决建议:')
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      if (proxyUrl) {
        console.log('   1. 检查代理工具是否运行')
        console.log('   2. 检查代理端口是否正确')
        console.log('   3. 尝试其他代理端口或直连模式')
      } else {
        console.log('   1. 检查网络连接')
        console.log('   2. 如果在国内，建议配置代理:')
        console.log('      NOTION_PROXY_URL=http://127.0.0.1:7890')
      }
    } else if (error.code === 'unauthorized') {
      console.log('   1. 检查 NOTION_KEY 是否正确')
      console.log('   2. 确认 Integration 已连接到数据库')
    } else if (error.message.includes('database_id')) {
      console.log('   1. 检查 NOTION_DATABASE_ID 是否正确')
      console.log('   2. 确认数据库已分享给 Integration')
    } else if (error.code === 'ETIMEDOUT') {
      console.log('   1. 网络连接超时')
      if (proxyUrl) {
        console.log('   2. 代理可能不稳定，尝试其他代理')
      } else {
        console.log('   2. 建议配置代理以提高稳定性')
      }
    }

    console.log()
    console.log('📖 详细文档: docs/NOTION_PROXY_SETUP.md')
    console.log('='.repeat(60) + '\n')
    process.exit(1)
  }
}

// 运行测试
testNotionConnection()

