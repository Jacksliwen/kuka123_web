/**
 * 检查所有导航网址的访问状态
 * 使用方法: node check-urls.js
 */

const fs = require('fs')
const https = require('https')
const http = require('http')
const { URL } = require('url')

const dataFile = './data/categories.json'
const timeout = 10000 // 10秒超时

// 颜色输出
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  gray: '\x1b[90m',
  reset: '\x1b[0m'
}

// 读取数据
const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'))
const allSites = []

data.categories.forEach(cat => {
  cat.sites.forEach(site => {
    allSites.push({
      name: site.name,
      url: site.url,
      category: cat.label
    })
  })
})

console.log(`\n🔍 开始检查 ${allSites.length} 个网址...\n`)

// 检查单个URL
function checkUrl(site) {
  return new Promise((resolve) => {
    const url = new URL(site.url)
    const client = url.protocol === 'https:' ? https : http
    
    const req = client.request(url, { method: 'HEAD', timeout }, (res) => {
      const status = res.statusCode
      const isOk = status >= 200 && status < 400
      resolve({
        ...site,
        status,
        ok: isOk,
        error: null
      })
    })
    
    req.on('error', (err) => {
      resolve({
        ...site,
        status: null,
        ok: false,
        error: err.message
      })
    })
    
    req.on('timeout', () => {
      req.destroy()
      resolve({
        ...site,
        status: null,
        ok: false,
        error: 'Timeout'
      })
    })
    
    req.end()
  })
}

// 批量检查
async function checkAll() {
  const results = []
  const batchSize = 5 // 并发数
  
  for (let i = 0; i < allSites.length; i += batchSize) {
    const batch = allSites.slice(i, i + batchSize)
    const batchResults = await Promise.all(batch.map(checkUrl))
    results.push(...batchResults)
    
    // 实时显示进度
    batchResults.forEach(r => {
      if (r.ok) {
        console.log(`${colors.green}✓${colors.reset} [${r.status}] ${r.name}`)
        console.log(`  ${colors.gray}${r.url}${colors.reset}`)
      } else {
        console.log(`${colors.red}✗${colors.reset} [${r.error || r.status}] ${r.name}`)
        console.log(`  ${colors.gray}${r.url}${colors.reset}`)
      }
    })
  }
  
  // 汇总
  const okCount = results.filter(r => r.ok).length
  const failCount = results.length - okCount
  
  console.log(`\n📊 检查结果:`)
  console.log(`  ${colors.green}正常: ${okCount}${colors.reset}`)
  console.log(`  ${colors.red}异常: ${failCount}${colors.reset}`)
  
  if (failCount > 0) {
    console.log(`\n⚠️ 以下网址需要检查:`)
    results.filter(r => !r.ok).forEach(r => {
      console.log(`  ${colors.red}- ${r.name}${colors.reset}`)
      console.log(`    ${colors.gray}${r.url} (${r.error || r.status})${colors.reset}`)
    })
  }
  
  console.log('')
}

checkAll()
