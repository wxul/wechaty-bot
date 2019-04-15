module.exports = {
  apps: [{
    name: 'wechaty-bot',
    script: 'dist/src/index.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      ROOT_DIR: __dirname,
    },
    env_production: {
      NODE_ENV: 'production',
      ROOT_DIR: __dirname,
    }
  }],
};
