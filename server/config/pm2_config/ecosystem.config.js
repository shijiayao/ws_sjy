module.exports = {
  apps: [
    {
      name: '9763',

      // pm2 的根目录， pm2 的启动目录，此配置文件的路径将参考此目录，配置文件的参考路径；（不是以此文件所在目录为参考）
      cwd: './',

      script: './server/9763.js',

      combine_logs: true,
      merge_logs: true,

      log_date_format: 'YYYY/MM/DD HH:mm:ss:SSS',

      out_file: './log/9763_out.log',
      error_file: './log/9763_error.log',
      log_file: './log/server.log',

      max_memory_restart: '2G', // 如果超出内存量，则重新启动应用程序
      // instances: 'max', // 负载均衡，分配给所有的 CPU
      instances: 1,
      watch: ['server'], // 监视文件变化， boolean or []
      autorestart: true, // 自动重启

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
