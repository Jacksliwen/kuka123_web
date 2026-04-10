# 导航站 - Vue 3 + Express 前后端集成项目

参考 kuka123.cool 风格的 Vue 3 + Express 个人网址导航项目。

## 📋 目录

- [快速启动](#快速启动)
- [功能特性](#功能特性)
- [项目结构](#项目结构)
- [开发说明](#开发说明)
- [生产部署](#生产部署)

---

## 🚀 快速启动

### 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器（Vite）
npm run dev
```

访问 http://localhost:5173 即可查看效果。

### 生产环境（本地测试）

```bash
# 构建项目
npm run build

# 启动后端服务（生产模式）
cd dist
npm install
node index.js
```

访问 http://localhost:3000 查看完整应用。

---

## ✨ 功能特性

- 🔍 实时搜索过滤网站，支持分类筛选
- 🌙 深色 / 浅色主题一键切换
- 📂 灵活的分类管理和网站添加
- 💾 后端本地数据持久化（JSON 存储）
- 🔐 管理后台登录和验证
- 📱 响应式布局，移动端适配
- 🌐 支持系统默认主题检测

---

## 📂 项目结构

```
kuka123_web/
├── src/                      # 前端 Vue 源代码
│   ├── components/
│   │   └── SiteCard.vue         # 网站卡片组件
│   ├── Admin.vue             # 管理后台页面
│   ├── App.vue               # 主页面组件
│   ├── Login.vue             # 登录页面
│   └── main.js               # 应用入口
├── public/                   # 静态资源
│   └── favicon.svg
├── data/                     # 数据文件
│   └── categories.json       # 网站分类和数据
├── scripts/                  # 构建脚本
│   └── build.js              # 后处理脚本
├── index.html                # HTML 入口
├── index.js                  # Express 后端服务
├── package.json
├── package.dist.json         # 生产依赖配置
├── vite.config.js            # Vite 构建配置
└── README.md
```

### 编译后生成的 dist 目录

```
dist/
├── index.js              # 后端服务入口
├── package.json          # 生产环境依赖
├── index.html            # 编译后的前端页面
├── assets/               # 前端资源（JS/CSS）
└── data/                 # 数据目录
    └── categories.json
```

---

## 🔧 开发说明

### 添加/修改网站分类

编辑 `data/categories.json`：

```json
{
  "categories": [
    {
      "id": 1,
      "name": "AI 工具",
      "description": "人工智能相关工具",
      "sites": [
        {
          "name": "ChatGPT",
          "description": "OpenAI 的 AI 助手",
          "url": "https://chat.openai.com",
          "icon": "🤖"
        }
      ]
    }
  ],
  "site": {
    "name": "导航站",
    "subtitle": "精选网站导航",
    "description": "你的个人网站导航",
    "icp": "你的 ICP 备案号",
    "copyright": "你的版权信息"
  }
}
```

### 环境变量

在服务器上可通过环境变量配置：

```bash
PORT=3000              # 服务端口（默认 3000）
ADMIN_USER=admin       # 管理员账号（默认 admin）
ADMIN_PASS=kuka2024    # 管理员密码（默认 kuka2024）
```

### API 接口

| 方法 | 端点 | 说明 |
|------|------|------|
| POST | /api/login | 管理员登录 |
| GET | /api/categories | 获取所有分类 |
| POST | /api/categories | 保存分类数据 |
| GET | /api/ping | 健康检查 |
| GET | /api/check-url | 检查 URL 可访问性 |

---

## 📦 生产部署（宝塔面板）

### 快速部署步骤

#### 1. 本地构建

```bash
# 安装依赖
npm install

# 构建（自动将后端服务打包到dist）
npm run build
```

#### 2. 上传到服务器

**只需上传 `dist` 目录！** 不需要上传 `node_modules`。

```bash
# 本地执行：上传 dist 文件夹内所有文件到服务器
scp -r dist/* root@your_server:/www/wwwroot/your_domain/
```

或使用宝塔面板的文件管理器上传。

#### 3. 宝塔面板配置 Node 项目

1. **进入宝塔面板** → 网站 → Node项目

2. **添加 Node 项目**：
   - 项目名称: `nav-site`
   - 项目目录: `/www/wwwroot/your_domain` （上传 dist 的目录）
   - 启动文件: `index.js`
   - 项目端口: `3000`
   - 运行用户: `www`

3. **安装依赖**（宝塔会自动或手动执行）：
   ```bash
   cd /www/wwwroot/your_domain
   npm install --production
   ```

4. **配置环境变量**（可选）：
   - 在 Node 项目设置中添加：
   ```
   ADMIN_USER=你的管理员账号
   ADMIN_PASS=你的管理员密码
   PORT=3000
   ```

5. **启动项目**：
   - 点击项目列表中的"启动"按钮

#### 4. 配置反向代理

1. 进入网站设置 → 反向代理

2. 添加反向代理：
   - 代理名称: `nav-site`
   - 目标 URL: `http://127.0.0.1:3000`
   - 发送域名: `$host`

#### 5. SSL 配置（可选但推荐）

1. 网站设置 → SSL
2. 申请 Let's Encrypt 免费证书
3. 开启强制 HTTPS

#### 6. 设置目录权限

确保数据目录有写入权限：

```bash
chmod 755 /www/wwwroot/your_domain/data
chown -R www:www /www/wwwroot/your_domain/data
```

### 常见问题排查

#### 问题：502 Bad Gateway

**原因**：Node.js 服务未启动或崩溃

**解决**：
```bash
# 检查服务状态
ps aux | grep node

# 查看错误日志
cd /www/wwwroot/your_domain
node index.js  # 直接运行查看错误

# 手动重启
pkill -f "node index.js"
node index.js &
```

#### 问题：npm 模块安装失败

**原因**：宝塔的"一键安装"功能不可靠

**解决**：
```bash
# SSH 连接到服务器后手动安装
cd /www/wwwroot/your_domain
npm install --production
```

#### 问题：npm 命令找不到

**原因**：SSH 环境 PATH 不包含 npm

**解决**：
```bash
# 使用完整路径启动
/www/server/nodejs/v版本号/bin/node index.js

# 或创建软链接
ln -s /www/server/nodejs/v版本号/bin/npm /usr/local/bin/npm
```

---

## 📝 许可证

MIT License

## 👤 作者

Jacksliwen

---

## 🔗 相关资源

- [Vue 3 文档](https://vuejs.org/)
- [Express.js 文档](https://expressjs.com/)
- [Vite 文档](https://vitejs.dev/)
