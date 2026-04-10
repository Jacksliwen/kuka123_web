# 部署指南

## 正确的部署步骤

### 方式一：直接部署（推荐新手）

```bash
# 1. 在本地构建
npm run build

# 2. 将 dist 文件夹整个上传到服务器 /www/wwwroot/sit-website/
# 假设上传到: /www/wwwroot/sit-website/

# 3. 在服务器上进入该目录
ssh root@124.221.11.101
cd /www/wwwroot/sit-website/

# 4. 安装生产依赖
npm install --production

# 5. 运行服务（前台运行查看日志）
node index.js

# 6. 访问检查
# http://124.221.11.101:3000
```

### 方式二：使用 PM2 进程管理（推荐生产）

```bash
# 1. 全局安装 PM2
npm install -g pm2

# 2. 使用 PM2 启动服务
cd /www/wwwroot/sit-website/
pm2 start index.js --name "kuka-nav" --instances 1

# 3. 查看运行状态
pm2 status

# 4. 查看日志
pm2 logs kuka-nav

# 5. 设置开机自启
pm2 startup
pm2 save
```

### 方式三：使用 Nginx 反向代理 + PM2

```nginx
# /etc/nginx/conf.d/kuka.conf
server {
    listen 80;
    server_name kuka123.cool;  # 改成你的域名
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 故障排查

### 问题 1：服务启动失败

```bash
# 方案：前台运行查看错误
cd /www/wwwroot/sit-website/
node index.js

# 常见错误信息及解决方案：
# - "npm ERR!" → npm install --production 未运行
# - "Cannot find module" → 依赖缺失，运行 npm install --production
# - "EADDRINUSE" → 端口 3000 被占用，改 PORT: PORT=8080 node index.js
# - "EACCES" → data 目录权限不足，运行 chmod -R 755 data/
```

### 问题 2：站点显示"已关闭"

**原因分析：**
- ✗ Node 进程未启动或已崩溃
- ✗ 前端无法连接后端 API
- ✗ 防火墙阻止了 3000 端口

**排查步骤：**

```bash
# 1. 检查 Node 进程是否运行
ps aux | grep node

# 2. 检查端口是否监听
netstat -tlnp | grep 3000

# 3. 尝试连接 API 检查服务是否运行
curl http://127.0.0.1:3000/api/ping

# 4. 查看防火墙规则
sudo ufw status
sudo ufw allow 3000/tcp

# 5. 查看 data 目录权限
ls -la /www/wwwroot/sit-website/data/
chmod -R 755 /www/wwwroot/sit-website/data/
```

### 问题 3：后端 API 响应错误

```bash
# 检查数据文件是否完整
cat /www/wwwroot/sit-website/data/categories.json | head -20

# 检查文件编码（确保是 UTF-8）
file /www/wwwroot/sit-website/data/categories.json

# 重新初始化数据文件
# 删除 data 目录并重启服务，系统会自动重新创建
rm -rf /www/wwwroot/sit-website/data/
node /www/wwwroot/sit-website/index.js
```

## 环境配置

可通过环境变量配置服务：

```bash
# 修改端口
PORT=8080 node index.js

# 修改管理密码
ADMIN_USER=admin ADMIN_PASS=your-new-password node index.js

# PM2 方式配置
pm2 start index.js --name "kuka" \
  --env "PORT=3000" \
  --env "ADMIN_PASS=your-password"
```

## 定期备份

```bash
# 备份数据文件
cp -r /www/wwwroot/sit-website/data/ /backup/kuka_$(date +%Y%m%d).bak/

# 或使用 cron 定时备份
# 0 2 * * * cp -r /www/wwwroot/sit-website/data/ /backup/kuka_$(date +\%Y\%m\%d).bak/
```

---

如果按以上步骤部署后仍有问题，请：
1. 前台运行 `node index.js` 查看完整的错误信息
2. 检查 `data/categories.json` 文件是否完整
3. 确保有读写权限：`chmod -R 755 /www/wwwroot/sit-website/`
