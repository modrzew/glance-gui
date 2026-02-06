#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Glance GUI...');
console.log('Server will be available at http://localhost:3000');

const nextBin = path.join(__dirname, '..', 'node_modules', '.bin', 'next');
const projectRoot = path.join(__dirname, '..');

const server = spawn(nextBin, ['start'], {
  cwd: projectRoot,
  stdio: 'inherit',
  env: { ...process.env, PORT: '3000' }
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

server.on('close', (code) => {
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  server.kill('SIGTERM');
});
