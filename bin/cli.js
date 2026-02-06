#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Glance GUI...');
console.log('Server will be available at http://localhost:3000');
console.log('Press Ctrl+C to stop the server');

// Project root is parent of bin directory
const projectRoot = path.join(__dirname, '..');

// Use npx to run next, which will find it in node_modules
const server = spawn('npx', ['next', 'start'], {
  cwd: projectRoot,
  stdio: 'inherit',
  env: { ...process.env, PORT: '3000' },
  shell: true
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

server.on('close', (code) => {
  process.exit(code || 0);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  server.kill('SIGTERM');
});
