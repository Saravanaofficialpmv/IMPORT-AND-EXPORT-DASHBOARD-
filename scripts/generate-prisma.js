#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('[v0] Process CWD:', process.cwd());
console.log('[v0] __dirname:', __dirname);
console.log('[v0] __filename:', __filename);

// Try different possible paths
const possiblePaths = [
  '/vercel/share/v0-project',
  '/vercel/share/v0-next-shadcn',
  process.cwd(),
  path.dirname(__dirname),
];

let projectRoot = null;

for (const p of possiblePaths) {
  const schemaPath = path.join(p, 'prisma', 'schema.prisma');
  console.log('[v0] Checking:', schemaPath);
  if (fs.existsSync(schemaPath)) {
    projectRoot = p;
    console.log('[v0] ✓ Found schema at:', p);
    break;
  }
}

if (!projectRoot) {
  console.error('[v0] ERROR: Could not find prisma schema in any known location');
  console.error('[v0] Checked:', possiblePaths);
  process.exit(1);
}

console.log('[v0] Using project root:', projectRoot);
console.log('[v0] Running: npx prisma generate');

try {
  const output = execSync('npx prisma generate', {
    cwd: projectRoot,
    encoding: 'utf-8',
    stdio: 'inherit'
  });
  
  console.log('[v0] ✓ Prisma client generated successfully');
  process.exit(0);
} catch (error) {
  console.error('[v0] Error generating Prisma client:', error.message);
  process.exit(1);
}
