#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

try {
  console.log('[v0] Starting Prisma client generation...');
  
  // Run prisma generate
  console.log('[v0] Running: prisma generate');
  const output = execSync('npx prisma generate', {
    cwd: process.cwd(),
    encoding: 'utf-8',
    stdio: 'pipe'
  });
  
  console.log('[v0] Prisma generate output:', output);
  console.log('[v0] ✅ Prisma client generated successfully!');
  
} catch (error) {
  console.error('[v0] ❌ Error generating Prisma client:');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
