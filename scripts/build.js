/**
 * 构建后处理脚本
 * 将生产环境所需文件复制到 dist 目录
 * 
 * 使用方法:
 *   npm run build
 * 
 * 打包完成后，dist 目录结构:
 *   dist/
 *   ├── index.js          # 后端服务入口
 *   ├── package.json      # 生产环境依赖
 *   ├── index.html        # 前端入口
 *   ├── assets/           # 前端资源
 *   └── data/             # 数据目录（包含默认数据）
 *       └── categories.json
 */

const fs = require('fs')
const path = require('path')

const distDir = path.join(__dirname, '..', 'dist')

console.log('📦 构建后处理...\n')

// 1. 复制后端入口文件
fs.copyFileSync(
  path.join(__dirname, '..', 'index.js'),
  path.join(distDir, 'index.js')
)
console.log('✓ 复制 index.js')

// 2. 复制生产环境 package.json
fs.copyFileSync(
  path.join(__dirname, '..', 'package.dist.json'),
  path.join(distDir, 'package.json')
)
console.log('✓ 复制 package.json')

// 3. 创建 data 目录并复制默认数据
const dataDir = path.join(distDir, 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
  console.log('✓ 创建 data 目录')
}

// 复制默认数据文件
const srcDataFile = path.join(__dirname, '..', 'data', 'categories.json')
const destDataFile = path.join(dataDir, 'categories.json')
if (fs.existsSync(srcDataFile)) {
  fs.copyFileSync(srcDataFile, destDataFile)
  console.log('✓ 复制默认数据 categories.json')
} else {
  // 如果没有源文件，创建空的数据文件
  fs.writeFileSync(destDataFile, JSON.stringify({ categories: [] }, null, 2))
  console.log('✓ 创建空数据文件 categories.json')
}

// 4. 部署说明已合并到 README.md
console.log('\n✅ 构建完成！')
console.log('\n部署说明请参考 README.md 中的"生产部署"章节')
console.log('\n目录结构：')
console.log('  dist/')
console.log('  ├── index.js          # 启动文件')
console.log('  ├── package.json      # 依赖配置')
console.log('  ├── index.html        # 前端页面')
console.log('  ├── assets/           # 静态资源')
console.log('  └── data/')
console.log('      └── categories.json  # 默认数据')
