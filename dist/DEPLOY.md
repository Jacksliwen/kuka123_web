# 宝塔面板部署指南

## 📦 项目结构

构建完成后，`dist/` 目录包含：

```
dist/
├── index.js          # 后端服务入口
├── package.json      # 生产环境依赖
├── index.html        # 前端入口
├── assets/           # 前端资源
├── data/             # 数据目录（自动创建）
└── DEPLOY.md         # 部署说明
```

## 🚀 快速部署步骤

### 1. 本地构建

```bash
# 安装依赖
npm install

# 构建（会自动将后端服务打包到dist）
npm run build
```

### 2. 上传到服务器

**只需上传 `dist` 目录！**

1. 压缩 `dist` 目录为 `dist.zip`
2. 上传到宝塔网站目录（如 `/www/wwwroot/nav-site`）
3. 解压到该目录

```bash
# 服务器上解压
unzip dist.zip
# 或宝塔面板的文件管理器解压
```

### 3. 宝塔面板配置

#### 创建 Node 项目

1. **安装 Node 版本管理器**
   - 宝塔面板 → 软件商店 → 安装 "Node版本管理器"
   - 安装 Node.js 18.x 或更高版本

2. **创建 Node 项目**
   - 网站 → Node项目 → 添加Node项目
   - **项目名称**: nav-site
   - **项目目录**: `/www/wwwroot/nav-site`（dist解压后的目录）
   - **启动文件**: `index.js`
   - **项目端口**: `3000`（或自定义）
   - **运行用户**: www

3. **安装依赖**
   - 宝塔会自动执行 `npm install`，或手动执行：
   ```bash
   cd /www/wwwroot/nav-site
   npm install
   ```

4. **配置环境变量**
   - 在 Node 项目设置中找到 "环境变量"
   - 添加：
   ```
   ADMIN_USER=你的管理员账号
   ADMIN_PASS=你的管理员密码
   PORT=3000
   ```

5. **启动项目**
   - 点击 "启动" 按钮

### 4. 配置反向代理

1. 添加站点（你的域名）
2. 设置 → 反向代理 → 添加反向代理
3. 配置：
   - **代理名称**: nav-site
   - **目标URL**: `http://127.0.0.1:3000`
   - **发送域名**: `$host`

### 5. 配置 SSL（可选）

1. 网站 → SSL → 申请 Let's Encrypt 证书
2. 开启强制 HTTPS

### 6. 目录权限

确保 `data/` 目录有写入权限：

```bash
chmod 755 /www/wwwroot/nav-site/data
chown -R www:www /www/wwwroot/nav-site/data
```

## 🔧 常用操作

### 更新部署

```bash
# 本地重新构建
npm run build

# 重新压缩 dist 目录上传
# 解压覆盖服务器上的文件

# 在宝塔面板重启 Node 项目
```

### 查看日志

宝塔面板 → Node项目 → 找到 nav-site → 点击 "日志"

## 🌐 访问地址

- **前台**: `https://你的域名/`
- **后台**: `https://你的域名/#/admin`

## ⚙️ 配置说明

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| PORT | 3000 | 服务端口 |
| ADMIN_USER | admin | 管理员账号 |
| ADMIN_PASS | kuka2024 | 管理员密码 |

## 📝 数据备份

数据保存在 `data/categories.json`：

```bash
# 备份
cp data/categories.json data/categories.json.backup.$(date +%Y%m%d)
```

## ❓ 常见问题

### 1. 端口被占用

修改环境变量 `PORT` 为其他端口，同步修改反向代理配置。

### 2. 数据无法保存

检查目录权限：
```bash
ls -la /www/wwwroot/nav-site/data/
# 确保权限为 755，所有者为 www
```

### 3. 404 错误

- 确认所有文件已正确上传
- 确认反向代理配置正确
- 查看 Node 项目日志

### 4. 后台登录失败

检查环境变量 `ADMIN_USER` 和 `ADMIN_PASS` 是否设置正确。

---

**部署完成后，访问你的域名即可使用导航站！**