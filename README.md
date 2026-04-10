# 导航站 - Vue 3 + Express 前后端集成项目

参考 kuka123.cool 风格的 Vue 3 + Express 个人网址导航项目。前后端集成，开箱即用。

## 📋 快速导航

- [快速启动](#快速启动)
- [功能特性](#功能特性)
- [项目结构](#项目结构)
- [开发说明](#开发说明)
- [部署说明](#部署说明)

---

## 🚀 快速启动

### 开发环境

```bash
npm install
npm run dev
```

访问 http://localhost:5173

### 生产环境

```bash
npm run build
cd dist && npm install --production && node index.js
```

访问 http://localhost:3000

---

## ✨ 功能特性

- 🔍 实时搜索过滤网站
- 🌙 深色/浅色主题切换
- 📂 灵活的分类管理
- 💾 本地 JSON 数据持久化
- 🔐 管理后台认证
- 📱 响应式布局

---

## 📂 项目结构

```
kuka123_web/
├── src/                  # 前端源代码
│   ├── components/       # 可复用组件
│   ├── Admin.vue        # 管理后台
│   ├── App.vue          # 主应用
│   ├── Login.vue        # 登录页
│   └── main.js
├── public/              # 静态资源
├── data/                # 数据文件
│   └── categories.json  # 网站数据
├── scripts/             # 构建脚本
├── index.html           # 前端入口
├── index.js             # 后端服务
└── vite.config.js
```

---

## 🔧 开发说明

### 数据格式

编辑 `data/categories.json`：

```json
{
  "categories": [
    {
      "id": 1,
      "name": "分类名称",
      "description": "分类描述",
      "sites": [
        {
          "name": "网站名",
          "description": "网站描述",
          "url": "https://example.com",
          "icon": "🔗"
        }
      ]
    }
  ],
  "site": {
    "name": "导航站名称",
    "subtitle": "副标题",
    "description": "网站描述",
    "icp": "ICP备案号",
    "copyright": "版权信息"
  }
}
```

### 配置环境变量

创建 `.env.local`（开发）或在部署时设置：

```
PORT=3000
ADMIN_USER=<your_username>
ADMIN_PASS=<your_password>
```

### API 端点

| 方法 | 端点 | 说明 |
|------|------|------|
| POST | /api/login | 管理员登录 |
| GET | /api/categories | 获取分类数据 |
| POST | /api/categories | 保存分类数据 |
| GET | /api/ping | 健康检查 |

---

## 📦 部署说明

### 构建

```bash
npm install
npm run build
```

生成 `dist/` 文件夹，包含编译后的前端和后端服务。

### 部署到服务器

1. 上传 `dist/` 文件夹内容到服务器
2. 在服务器上执行：
   ```bash
   npm install --production
   node index.js
   ```

3. 配置反向代理指向 http://127.0.0.1:3000
4. 确保 `data/` 目录有写入权限

### 常见问题

**Q: 502 Bad Gateway**  
A: 检查 Node 进程是否运行：`ps aux | grep node` 或直接运行查看错误

**Q: 无法访问管理后台**  
A: 确保设置了正确的环境变量 `ADMIN_USER` 和 `ADMIN_PASS`

---

## 📝 许可证

MIT License

## 🔗 相关资源

- [Vue 3](https://vuejs.org/)
- [Express.js](https://expressjs.com/)
- [Vite](https://vitejs.dev/)
