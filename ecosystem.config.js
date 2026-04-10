/**
 * PM2 生产环境配置文件
 * 
 * 使用方法：
 *   pm2 start ecosystem.config.js              # 启动应用
 *   pm2 restart ecosystem.config.js            # 重启应用
 *   pm2 stop ecosystem.config.js               # 停止应用
 *   pm2 delete ecosystem.config.js             # 删除应用
 *   pm2 logs kuka-nav                          # 查看实时日志
 *   pm2 monit                                  # 监控应用
 *   pm2 startup                                # 设置开机自启
 *   pm2 save                                   # 保存当前进程列表
 */

module.exports = {
  apps: [
    {
      // ===== 基础配置 =====
      name: 'kuka-nav',                    // 应用名称
      script: './index.js',                // 启动脚本
      cwd: __dirname,                      // 工作目录
      
      // ===== 实例管理 =====
      instances: 1,                        // 实例数量（或 'max' 表示使用所有 CPU 核心）
      exec_mode: 'cluster',                // 执行模式：cluster（集群）或 fork（单进程）
      
      // ===== 环境变量 =====
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        ADMIN_USER: 'admin',
        ADMIN_PASS: 'kuka2024'            // ⚠️ 务必修改为强密码
      },
      
      // ===== 日志配置 =====
      out_file: './logs/out.log',         // 标准输出日志
      error_file: './logs/error.log',     // 错误日志
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',  // 日志时间格式
      combine_logs: true,                 // 合并所有实例的日志
      
      // ===== 进程控制 =====
      max_restarts: 10,                   // 最大重启次数
      min_uptime: '10s',                  // 应用运行最少时间（低于此时间会被标记为异常）
      max_memory_restart: '500M',         // 内存超过 500M 则重启
      
      // ===== 监控与自愈 =====
      watch: false,                       // 文件变化是否自动重启（生产环境不建议启用）
      ignore_watch: ['node_modules', 'logs', 'data'],  // 忽略监控的目录
      
      // ===== 处理信号 =====
      kill_timeout: 5000,                 // kill -9 前等待 5秒
      wait_ready: false,                  // 是否等待应用就绪
      
      // ===== 其他配置 =====
      autorestart: true,                  // 自动重启
      exp_backoff_restart_delay: 100,     // 重启延迟（毫秒）
    }
  ],
  
  // ===== 部署配置（可选）=====
  deploy: {
    production: {
      user: 'root',
      host: '124.221.11.101',
      ref: 'origin/main',
      repo: 'https://github.com/Jacksliwen/kuka123_web.git',
      path: '/www/wwwroot/sit-website',
      'post-deploy': 'npm install --production && pm2 restart ecosystem.config.js'
    }
  }
}
