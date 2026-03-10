#!/usr/bin/env node
import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

const QUALITY = 85;
const LARGE_IMAGE_THRESHOLD = 200 * 1024; // 200KB
const RESPONSIVE_WIDTHS = [640, 1024, 1920];

async function getFileSize(filePath) {
  const stats = await stat(filePath);
  return stats.size;
}

async function processImage(inputPath, outputBasePath) {
  const ext = extname(inputPath);
  const name = basename(inputPath, ext);
  const dir = dirname(inputPath);
  
  const fileSize = await getFileSize(inputPath);
  const isLarge = fileSize > LARGE_IMAGE_THRESHOLD;
  
  console.log(`Processing: ${inputPath} (${(fileSize / 1024).toFixed(1)}KB)`);
  
  // Convert to WebP
  const webpPath = join(dir, `${name}.webp`);
  await sharp(inputPath)
    .webp({ quality: QUALITY })
    .toFile(webpPath);
  
  const webpSize = await getFileSize(webpPath);
  console.log(`  → Created ${webpPath} (${(webpSize / 1024).toFixed(1)}KB)`);
  
  const savings = fileSize - webpSize;
  
  // Generate responsive sizes for large images
  if (isLarge) {
    console.log(`  → Generating responsive sizes...`);
    const metadata = await sharp(inputPath).metadata();
    
    for (const width of RESPONSIVE_WIDTHS) {
      if (width < metadata.width) {
        const responsivePath = join(dir, `${name}-${width}w.webp`);
        await sharp(inputPath)
          .resize(width)
          .webp({ quality: QUALITY })
          .toFile(responsivePath);
        
        const responsiveSize = await getFileSize(responsivePath);
        console.log(`    → ${width}w: ${(responsiveSize / 1024).toFixed(1)}KB`);
      }
    }
  }
  
  return { original: fileSize, webp: webpSize, savings };
}

async function findPNGImages(dir) {
  const images = [];
  
  async function walk(currentDir) {
    const entries = await readdir(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.png')) {
        images.push(fullPath);
      }
    }
  }
  
  await walk(dir);
  return images;
}

async function main() {
  console.log('🖼️  Image Optimization Script\n');
  
  const searchDirs = [
    join(projectRoot, 'src/assets'),
    join(projectRoot, 'public/imgs')
  ];
  
  let totalOriginal = 0;
  let totalWebp = 0;
  
  for (const searchDir of searchDirs) {
    console.log(`\nScanning: ${searchDir}`);
    
    try {
      const images = await findPNGImages(searchDir);
      console.log(`Found ${images.length} PNG images\n`);
      
      for (const imagePath of images) {
        const result = await processImage(imagePath, imagePath);
        totalOriginal += result.original;
        totalWebp += result.webp;
      }
    } catch (error) {
      console.error(`Error scanning ${searchDir}:`, error.message);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('Summary:');
  console.log('='.repeat(60));
  console.log(`Original total: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB`);
  console.log(`WebP total: ${(totalWebp / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Total savings: ${((totalOriginal - totalWebp) / 1024 / 1024).toFixed(2)}MB (${((1 - totalWebp / totalOriginal) * 100).toFixed(1)}%)`);
  console.log('='.repeat(60));
}

main().catch(console.error);
