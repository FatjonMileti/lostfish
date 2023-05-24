module.exports = {
  apps: [
    {
      name: 'backend.api',
      script: 'dist/src/bin/www.js',
      env: {
        NODE_ENV: 'production'
      },
      instances: 4,
      exec_mode: 'cluster',
      node_args: '--max_old_space_size=2048'
    }
  ]
};
