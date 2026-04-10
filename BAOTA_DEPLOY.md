# 宝塔面板部署指南

## ✅ 部署前检查清单

dist 文件已检查完毕，**可以安全部署到宝塔**。

### 文件完整性检查

```
dist/
├── index.js              ✓ 后端服务入口 (6.7K)
├── package.json          ✓ 生产依赖清单 
├── index.html            ✓ 前端入口页面
├── favicon.svg           ✓ 网站图标
├── assets/               ✓ 前端资源
│   ├── index-Ct7SsEGK.js ✓ 前端JS (已包含 chart.js)
│   └── index-Cwa8VSv-.css ✓ 样式表
└── data/
    └── categories.json   ✓ 网站数据 (26K)
```

## 🚀 宝塔部署步骤

### 第一步：上传文件到宝塔

**方式1：使用宝塔文件管理器上传**
1. 打开宝塔面板 → 文件
2. 进入 `/www/wwwroot/sit-website/` 目录
3. 删除旧文件（如果存在）
4. 上传 dist 文件夹下的所有文件

**方式2：使用 SCP 命令上传（推荐）**
```bash
# 本地执行
scp -r dist/* root@124.221.11.101:/www/wwwroot/sit-website/
```

**方式3：宝塔内容编辑**
1. 在宝塔中新建名为 `index.js` 的文件
2. 复制本地的 index.js 内容粘贴进去
3. 用同样方式上传其他文件

### 第二步：安装生产依赖

**在宝塔终端执行：**

```bash
cd /www/wwwroot/sit-website/
npm install --production
```

**这会安装：**
- express (Web 框架)
- cors (跨域支持)

### 第三步：检查权限

```bash
# 确保 data 文件夹可读写
chmod -R 755 /www/wwwroot/sit-website/
chmod -R 777 /www/wwwroot/sit-website/data/

# 验证权限
ls -la /www/wwwroot/sit-website/data/
```

### 第四步：启动服务

#### 方式1：Node.js 项目（推荐）

1. 在宝塔面板打开 **Node.js 项目管理**
2. 点击 **添加项目**
3. 配置如下：
   - 项目名称：`kuka-nav`
   - 项目路径：`/www/wwwroot/sit-website/`
   - 启动文件：`index.js`
   - 监听端口：`3000`
   - 项目类型：Node.js
4. 点击 **提交**

#### 方式2：手动启动（测试用）

```bash
# 在宝塔终端执行
cd /www/wwwroot/sit-website/
node index.js
```

**正常输出应该显示：**
```
========================================
  🚀 导航站服务已启动
  📍 http://localhost:3000
  📁 数据文件: /www/wwwroot/sit-website/data/categories.json
========================================
```

### 第五步（可选）：配置 Nginx 反向代理

如果想用域名访问（如 kuka123.cool），在宝塔配置反向代理：

1. 进入宝塔 → 网站 → 您的域名
2. 点击 **反向代理**
3. 添加反向代理：
   - 代理名称：`node-app`
   - 目标 URL：`http://127.0.0.1:3000`
   - 启用缓存：取消勾选
   - 超时时间：`30`

配置后访问 `http://您的域名` 即可获得完整功能。

## 🔍 常见问题排查

### 问题1：服务无法启动

**表现：** 启动后立即关闭

**解决方案：**
```bash
# 在宝塔终端查看错误
cd /www/wwwroot/sit-website/
node index.js

# 常见错误及解决方案：
# "Cannot find module 'express'" → npm install --production 未执行
# "EADDRINUSE: address already in use" → 端口 3000 被占用
#   解决：PORT=8080 node index.js
# "EACCES: permission denied" → 文件权限不足
#   解决：chmod -R 777 /www/wwwroot/sit-website/
```

### 问题2：前端加载失败/显示"站点已关闭"

**原因分析：**
- Node.js 进程未启动
- Nginx 未正确配置反向代理
- 前端资源路径错误

**排查步骤：**

```bash
# 1. 检查进程是否运行
ps aux | grep node

# 2. 检查端口是否监听
lsof -i :3000  # Linux
netstat -ano | findstr 3000  # Windows

# 3. 尝试直接访问 API
curl http://127.0.0.1:3000/api/ping

# 4. 查看完整日志
cat /www/wwwroot/sit-website/data/categories.json | head -20
```

### 问题3：データファイルが読み込めない

```bash
# 检查文件是否存在
test -f /www/wwwroot/sit-website/data/categories.json && echo "✓ 存在" || echo "✗ 不存在"

# 检查文件格式（应该是有效 JSON）
cat /www/wwwroot/sit-website/data/categories.json | jq . >/dev/null && echo "✓ JSON 有效" || echo "✗ JSON 无效"

# 如果文件损坏，删除重建
rm /www/wwwroot/sit-website/data/categories.json
# 重启服务，系统会自动创建默认数据文件
```

### 问题4：宝塔管理面板显示 502

**原因：** Node.js 服务崩溃

**解决：**
1. 在宝塔终端手动启动查看错误
2. 检查 node_modules 是否正确安装
3. 重新执行 `npm install --production`

## 🔐 安全建议

### 修改管理员密码

启动时通过环境变量设置：

```bash
# 在宝塔 Node.js 项目配置中添加环境变量
ADMIN_USER=admin
ADMIN_PASS=your-secure-password-here
```

或在宝塔终端启动时指定：

```bash
ADMIN_PASS=your-secure-password node index.js
```

### 启用 HTTPS

1. 在宝塔面板申请 SSL 证书（免费 Let's Encrypt）
2. 在反向代理中启用 HTTPS

### 定期备份

```bash
# 每天备份数据
0 2 * * * cp -r /www/wwwroot/sit-website/data /backup/kuka_data_$(date +\%Y\%m\%d).bak
```

## ✨ 验证部署成功

访问以下 URL 检查：

```
http://您的IP:3000                    # 主页面
http://您的IP:3000/api/ping          # API 健康检查（返回 {"ok": true}）
http://您的IP:3000/admin             # 后台管理页面
http://您的IP:3000/admin/login       # 登录页面
```

---

**部署完毕后，dist 文件可以删除，所有内容已复制到服务器。** ✅
