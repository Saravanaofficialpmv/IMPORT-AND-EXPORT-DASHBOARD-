#!/usr/bin/env node

/**
 * Prisma setup script - generates the Prisma Client
 * This script should be run after dependencies are installed
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const projectRoot = path.join(__dirname, '..');

console.log('[Prisma Setup] Generating Prisma Client...');

try {
  // Generate Prisma Client
  execSync('npx prisma generate', {
    cwd: projectRoot,
    stdio: 'inherit',
  });
  console.log('[Prisma Setup] ✓ Prisma Client generated successfully');
} catch (error) {
  console.error('[Prisma Setup] ✗ Failed to generate Prisma Client');
  console.error(error.message);
  process.exit(1);
}
