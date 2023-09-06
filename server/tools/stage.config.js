module.exports = {
  apps: [
    {
      name: 'lostfish.app',
      script: 'npx',
      args: 'serve -s ../client/build -l 4000',
      env: {
        NODE_ENV: 'stage'
      }
    },
    {
      name: 'backend.api',
      script: 'dist/bin/www.js',
      env: {
        NODE_ENV: 'stage'
      },
      instances: 1,
      exec_mode: 'cluster',
      node_args: '--max_old_space_size=2048'
    }
  ]
};
