#!/usr/bin/env node
/**
 * 导航站生产环境入口
 * 集成前端静态文件服务 + 后端API服务
 * 
 * 使用方法:
 *   npm start          # 启动服务
 *   node index.js      # 直接运行
 * 
 * 环境变量:
 *   PORT=3000          # 服务端口，默认3000
 *   ADMIN_USER=admin   # 管理员账号
 *   ADMIN_PASS=xxx     # 管理员密码
 */

const fs = require('fs')
const path = require('path')
const express = require('express')
const cors = require('cors')

const app = express()

// 中间件
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// 配置
const PORT = process.env.PORT || 3000
const ADMIN_USER = process.env.ADMIN_USER || 'admin'
const ADMIN_PASS = process.env.ADMIN_PASS || 'kuka2024'

// 数据文件路径（生产环境使用项目根目录的data文件夹）
const DATA_DIR = path.join(__dirname, 'data')
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json')

// 默认网站配置
const DEFAULT_SITE = {
  name: 'kuka123',
  subtitle: '导 航 站',
  desc: 'KUKA导航 - 精选网址导航，收录软件官网、学习资源、AI工具、效率工具等优质网站',
  icp: '沪ICP备2023014382号-1',
  copyright: 'Copyright © 2023–2026 KUKA 导航 · Jacksliwen 版权所有',
  domain: 'kuka123.cool',
  design: 'Design by Webstack'
}

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// 初始化数据文件
function initDataFile() {
  if (!fs.existsSync(CATEGORIES_FILE)) {
    const defaultData = { categories: [], site: DEFAULT_SITE }
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(defaultData, null, 2), 'utf8')
    console.log('✓ 初始化数据文件:', CATEGORIES_FILE)
  }
}

initDataFile()

// 读取数据
function readData() {
  try {
    const content = fs.readFileSync(CATEGORIES_FILE, 'utf8')
    const data = JSON.parse(content)
    // 兼容旧格式
    if (Array.isArray(data)) {
      return { categories: data, site: DEFAULT_SITE }
    }
    return data
  } catch (err) {
    console.error('读取数据失败:', err)
    return { categories: [], site: DEFAULT_SITE }
  }
}

// 保存数据
function writeData(data) {
  try {
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(data, null, 2), 'utf8')
    return true
  } catch (err) {
    console.error('保存数据失败:', err)
    return false
  }
}

// ===== API 路由 =====

// 登录验证
app.post('/api/login', (req, res) => {
  const { username, password } = req.body
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    res.json({ ok: true, token: Buffer.from('kuka_admin_logged_in').toString('base64') })
  } else {
    res.status(401).json({ error: '账号或密码错误' })
  }
})

// 获取分类数据
app.get('/api/categories', (req, res) => {
  const data = readData()
  res.json({ 
    categories: data.categories || [],
    site: data.site || DEFAULT_SITE
  })
})

// 保存分类数据
app.post('/api/categories', (req, res) => {
  const { categories, site } = req.body
  if (!Array.isArray(categories)) {
    return res.status(400).json({ error: 'categories must be an array' })
  }
  
  const data = { categories, site: site || DEFAULT_SITE }
  if (writeData(data)) {
    res.json({ ok: true, message: '数据已保存' })
  } else {
    res.status(500).json({ error: '保存失败' })
  }
})

// 健康检查
app.get('/api/ping', (req, res) => res.json({ ok: true }))

// 检测网址可访问性
app.get('/api/check-url', async (req, res) => {
  const { url } = req.query
  if (!url) {
    return res.status(400).json({ error: '缺少url参数' })
  }
  
  const startTime = Date.now()
  
  try {
    const https = require('https')
    const http = require('http')
    const { URL } = require('url')
    
    const urlObj = new URL(url)
    const client = urlObj.protocol === 'https:' ? https : http
    
    const checkPromise = new Promise((resolve, reject) => {
      const req = client.request(url, { method: 'HEAD', timeout: 10000 }, (response) => {
        const status = response.statusCode
        const responseTime = Date.now() - startTime
        // 2xx 和 3xx 都认为是正常
        resolve({ 
          ok: status >= 200 && status < 400, 
          status,
          responseTime
        })
      })
      
      req.on('error', (err) => {
        reject(err)
      })
      
      req.on('timeout', () => {
        req.destroy()
        reject(new Error('Timeout'))
      })
      
      req.end()
    })
    
    const result = await checkPromise
    res.json(result)
  } catch (err) {
    // 如果 HEAD 请求失败，尝试 GET 请求
    try {
      const https = require('https')
      const http = require('http')
      const { URL } = require('url')
      
      const urlObj = new URL(url)
      const client = urlObj.protocol === 'https:' ? https : http
      
      const getPromise = new Promise((resolve, reject) => {
        const req = client.request(url, { method: 'GET', timeout: 10000 }, (response) => {
          const status = response.statusCode
          const responseTime = Date.now() - startTime
          resolve({ 
            ok: status >= 200 && status < 400, 
            status,
            responseTime
          })
          // 只读取头部，不读取body
          response.destroy()
        })
        
        req.on('error', (err) => {
          reject(err)
        })
        
        req.on('timeout', () => {
          req.destroy()
          reject(new Error('Timeout'))
        })
        
        req.end()
      })
      
      const result = await getPromise
      res.json(result)
    } catch (err2) {
      const responseTime = Date.now() - startTime
      res.json({ ok: false, error: err2.message, responseTime })
    }
  }
})

// ===== 前端静态文件服务 =====

const distPath = __dirname

if (fs.existsSync(distPath)) {
  // 托管静态文件
  app.use(express.static(distPath))
  
  // 所有路由指向 index.html（支持Vue Router的history模式）
  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
  
  console.log('✓ 静态文件托管:', distPath)
} else {
  console.warn('✗ 未找到 dist 目录，请先运行 npm run build')
  app.get('/', (req, res) => {
    res.send('服务运行中，但未找到前端文件。请先运行 npm run build')
  })
}

// 启动服务
app.listen(PORT, () => {
  console.log('\n========================================')
  console.log('  🚀 导航站服务已启动')
  console.log('  📍 http://localhost:' + PORT)
  console.log('  📁 数据文件:', CATEGORIES_FILE)
  console.log('========================================\n')
})

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('SIGTERM 收到，关闭服务...')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('\n服务已停止')
  process.exit(0)
})