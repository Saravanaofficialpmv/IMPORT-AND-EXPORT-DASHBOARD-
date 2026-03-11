#!/usr/bin/env node

/**
 * Prisma Client Generation Script
 * This script generates the Prisma Client from the schema.prisma file
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const projectRoot = path.join(__dirname, '..');
const prismaPath = path.join(projectRoot, 'prisma', 'schema.prisma');

console.log('[v0] Starting Prisma client generation...');
console.log('[v0] Project root:', projectRoot);
console.log('[v0] Schema path:', prismaPath);

// Check if schema exists
if (!fs.existsSync(prismaPath)) {
  console.error('[v0] ERROR: Prisma schema not found at', prismaPath);
  process.exit(1);
}

console.log('[v0] Schema found, running prisma generate...');

// Run prisma generate
exec('npx prisma generate', { cwd: projectRoot }, (error, stdout, stderr) => {
  if (error) {
    console.error('[v0] Error generating Prisma client:', error.message);
    if (stderr) console.error('[v0] stderr:', stderr);
    process.exit(1);
  }

  if (stdout) console.log('[v0]', stdout);
  
  console.log('[v0] ✓ Prisma client generated successfully');
  process.exit(0);
});
