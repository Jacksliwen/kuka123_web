# PM2 部署指南

## 📦 什么是 PM2？

PM2 是一个 Node.js 进程管理器，可以帮助你：
- ✅ 自动重启应用（如果崩溃）
- ✅ 负载均衡（多核 CPU 利用）
- ✅ 实时监控应用状态
- ✅ 设置开机自启
- ✅ 管理应用日志

## 🚀 在宝塔中使用 PM2 部署

### 第一步：全局安装 PM2

```bash
npm install -g pm2
```

### 第二步：上传文件到服务器

```bash
# 在本地执行
scp -r dist/* root@124.221.11.101:/www/wwwroot/sit-website/
```

### 第三步：安装生产依赖

```bash
# 在服务器执行
cd /www/wwwroot/sit-website/
npm install --production
```

### 第四步：使用 PM2 启动应用

```bash
# 使用 ecosystem.config.js 启动
cd /www/wwwroot/sit-website/
pm2 start ecosystem.config.js

# 查看应用状态
pm2 status

# 查看实时日志
pm2 logs kuka-nav
```

**正常输出：**
```
[PM2] Starting /www/wwwroot/sit-website/index.js in cluster mode...
[PM2] Done.
┌─────┬──────────┬─────────┬─────────┬────────┬─────────┬────────┬─────────┐
│ id  │ name     │ version │ mode    │ pid    │ status  │ restart │ uptime  │
├─────┼──────────┼─────────┼─────────┼────────┼─────────┼────────┼─────────┤
│  0  │ kuka-nav │ 1.0.0   │ cluster │ 12345  │ online  │ 0       │ 5s      │
└─────┴──────────┴─────────┴─────────┴────────┴─────────┴────────┴─────────┘
```

### 第五步（重要）：设置开机自启

```bash
# 启用开机自启
pm2 startup

# 保存当前进程列表
pm2 save

# 验证
pm2 startup systemd -u root --hp /root
```

## 📖 PM2 常用命令

```bash
# 启动应用
pm2 start ecosystem.config.js

# 查看应用列表和状态
pm2 status
pm2 list

# 查看实时日志
pm2 logs kuka-nav

# 查看应用详细信息
pm2 info kuka-nav

# 监控应用运行时数据（CPU、内存等）
pm2 monit

# 重启应用
pm2 restart kuka-nav

# 停止应用
pm2 stop kuka-nav

# 删除应用
pm2 delete kuka-nav

# 显示所有应用的日志
pm2 logs

# 清空所有日志
pm2 flush
```

## 🔧 ecosystem.config.js 配置说明

### 关键配置项

```javascript
module.exports = {
  apps: [
    {
      name: 'kuka-nav',           // 应用名称
      script: './index.js',       // 启动文件
      instances: 1,               // 实例数（1 = 单进程，'max' = 充分利用 CPU）
      exec_mode: 'cluster',       // 'cluster' = 集群模式，'fork' = 单进程
      
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        ADMIN_PASS: 'your-password'  // 修改此处密码
      },
      
      out_file: './logs/out.log',    // 正常日志输出
      error_file: './logs/error.log', // 错误日志输出
      
      max_memory_restart: '500M',     // 内存超过 500M 自动重启
      max_restarts: 10,               // 最多重启 10 次
      min_uptime: '10s',              // 应用运行至少 10s 才算成功启动
    }
  ]
}
```

### 调整建议

根据服务器配置调整 `instances`：

```javascript
// 服务器仅供导航站使用
instances: 'max'  // 充分利用所有 CPU 核心

// 共享服务器，资源有限
instances: 1 或 2  // 使用 1-2 个进程
```

## 📊 查看应用日志和监控

### 查看实时日志

```bash
# 查看 kuka-nav 应用的所有日志
pm2 logs kuka-nav

# 只查看错误日志
pm2 logs kuka-nav --err

# 实时监控应用（CPU、内存、请求数等）
pm2 monit
```

### 查看日志文件

```bash
# PM2 会将日志保存到这些文件
cat /www/wwwroot/sit-website/logs/out.log
cat /www/wwwroot/sit-website/logs/error.log

# 或者在宝塔中直接查看
# 路径：/www/wwwroot/sit-website/logs/
```

## 🚨 常见问题

### 问题1：PM2 启动后立即停止

**原因：** 应用启动出错

**解决：**
```bash
# 查看详细错误
pm2 logs kuka-nav --err

# 检查文件权限
chmod -R 777 /www/wwwroot/sit-website/data/
chmod -R 777 /www/wwwroot/sit-website/logs/
```

### 问题2：无法用 pm2 status 查看应用

**原因：** PM2 daemon 未启动

**解决：**
```bash
# 杀死所有 PM2 进程
pm2 kill

# 重新启动
pm2 start ecosystem.config.js
```

### 问题3：应用自动重启频繁

**原因：** 内存不足或代码错误

**解决：**
```bash
# 查看实时监控
pm2 monit

# 如果内存持续增长，检查内存泄漏
# 增加 max_memory_restart 值
# 或者检查代码是否有问题
```

### 问题4：开机自启未生效

```bash
# 重新设置开机自启
pm2 kill
pm2 start ecosystem.config.js
pm2 startup
pm2 save

# 验证
systemctl list-unit-files | grep pm2
```

## 🔒 安全提示

### 修改管理员密码

编辑 `ecosystem.config.js`：

```javascript
env: {
  NODE_ENV: 'production',
  PORT: 3000,
  ADMIN_USER: 'admin',
  ADMIN_PASS: 'your-very-secure-password'  // 改成强密码
}
```

修改后需要重启应用：
```bash
pm2 restart kuka-nav
```

### 监控异常重启

如果应用频繁重启，可能表示有问题：

```bash
# 查看最近的重启次数
pm2 info kuka-nav | grep restart

# 查看错误日志
pm2 logs kuka-nav --err
```

## 📈 性能优化

### 针对高流量优化

```javascript
{
  instances: 'max',              // 使用所有 CPU 核心
  exec_mode: 'cluster',          // 集群模式（负载均衡）
  max_memory_restart: '800M',    // 增加内存限制
  max_restarts: 20,              // 增加重启次数
}
```

### 针对低流量/低配置服务器

```javascript
{
  instances: 1,                  // 单进程
  exec_mode: 'fork',             // 单进程模式
  max_memory_restart: '300M',    // 降低内存限制
  max_restarts: 5,               // 减少重启次数
}
```

## 🎯 完整部署流程总结

```bash
# 1. 安装 PM2（全局）
npm install -g pm2

# 2. 上传文件
scp -r dist/* root@124.221.11.101:/www/wwwroot/sit-website/

# 3. 连接服务器并进入应用目录
ssh root@124.221.11.101
cd /www/wwwroot/sit-website/

# 4. 安装依赖
npm install --production

# 5. 启动应用（使用 PM2）
pm2 start ecosystem.config.js

# 6. 查看状态
pm2 status

# 7. 设置开机自启
pm2 startup
pm2 save

# 8. 完成！应用现在已经自动运行和保护
```

---

**PM2 让应用部署变得更简单，更稳定，更可靠。** ✅
