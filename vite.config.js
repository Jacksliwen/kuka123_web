import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'

// 数据文件路径
const DATA_DIR = path.resolve('data')
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

// 确保数据目录和文件存在
function initDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  if (!fs.existsSync(CATEGORIES_FILE)) {
    const defaultData = { categories: [], site: DEFAULT_SITE }
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(defaultData, null, 2), 'utf8')
  }
}

// 读取数据
function readData() {
  try {
    const content = fs.readFileSync(CATEGORIES_FILE, 'utf8')
    const data = JSON.parse(content)
    // 如果数据不是对象（即旧格式），则转换为新格式
    if (!Array.isArray(data) && typeof data !== 'object') {
      return { categories: [], site: {} }
    }
    // 如果是旧的数组格式，则转换为新格式
    if (Array.isArray(data)) {
      return { categories: data, site: {} }
    }
    return data
  } catch (err) {
    console.error('读取数据失败:', err)
    return { categories: [], site: {} }
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

// Vite 插件：提供 API 端点
function apiPlugin() {
  // 从环境变量读取凭据，或使用默认值
  const ADMIN_USER = process.env.ADMIN_USER || 'admin'
  const ADMIN_PASS = process.env.ADMIN_PASS || 'kuka2024'
  
  return {
    name: 'api-server',
    configureServer(server) {
      initDataFile()
      
      // 登录验证
      server.middlewares.use('/api/login', (req, res, next) => {
        if (req.method === 'POST') {
          let body = ''
          req.on('data', chunk => body += chunk)
          req.on('end', () => {
            try {
              const { username, password } = JSON.parse(body)
              if (username === ADMIN_USER && password === ADMIN_PASS) {
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ ok: true, token: btoa('kuka_admin_logged_in') }))
              } else {
                res.statusCode = 401
                res.end(JSON.stringify({ error: '账号或密码错误' }))
              }
            } catch (err) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Invalid JSON' }))
            }
          })
        } else {
          next()
        }
      })
      
      // 获取分类数据
      server.middlewares.use('/api/categories', (req, res, next) => {
        if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json')
          const data = readData()
          res.end(JSON.stringify({ 
            categories: data.categories || [],
            site: data.site || {}
          }))
        } else if (req.method === 'POST') {
          let body = ''
          req.on('data', chunk => body += chunk)
          req.on('end', () => {
            try {
              const { categories, site } = JSON.parse(body)
              if (!Array.isArray(categories)) {
                res.statusCode = 400
                res.end(JSON.stringify({ error: 'categories must be an array' }))
                return
              }
              if (writeData({ categories, site })) {
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ ok: true, message: '数据已保存' }))
              } else {
                res.statusCode = 500
                res.end(JSON.stringify({ error: '保存失败' }))
              }
            } catch (err) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Invalid JSON' }))
            }
          })
        } else {
          next()
        }
      })
    }
  }
}

export default defineConfig({
  plugins: [vue(), apiPlugin()]
})