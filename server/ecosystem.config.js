module.exports = {
  apps: [
    {
      name: 'backend.api',
      script: 'dist/src/bin/www.js',
      env: {
        NODE_ENV: 'production',
        SOCKET_INSTANCE: '0'
      },
      instances: 1,
      exec_mode: 'cluster',
      node_args: '--max_old_space_size=2048'
    },
    {
      name: 'Sync data from offr-io',
      script: 'dist/src/workers/sync-offrio-data.worker.js',
      instances: 1,
      cron_restart: '0 */6 * * *',
      env: {
        NODE_ENV: 'production'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
