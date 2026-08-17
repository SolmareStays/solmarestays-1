import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, extname, relative } from 'path';

const PUBLIC = '/Users/aihost/solmarestays-1/public';
const ASSETS = '/Users/aihost/solmarestays-1/src/assets';
const BACKUP = '/Users/aihost/solmarestays-1/public/_originals';

const MAX_WIDTH = 2000;
const QUALITY = 80;
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const SKIP_DIRS = new Set(['_originals']);
const MIN_SIZE = 200 * 1024; // only optimize files > 200KB

async function getAllImages(dir) {
  const results = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...await getAllImages(fullPath));
    } else if (IMAGE_EXTS.has(extname(entry.name).toLowerCase())) {
      const s = await stat(fullPath);
      if (s.size > MIN_SIZE) {
        results.push({ path: fullPath, size: s.size });
      }
    }
  }
  return results;
}

function formatSize(bytes) {
  if (bytes > 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / 1024).toFixed(0) + ' KB';
}

async function optimizeImage(filePath) {
  const ext = extname(filePath).toLowerCase();
  const relPath = relative(PUBLIC, filePath);

  // Back up original
  const backupPath = join(BACKUP, relPath);
  const backupDir = join(backupPath, '..');
  await mkdir(backupDir, { recursive: true });

  const origStat = await stat(filePath);
  const origSize = origStat.size;

  // Read and get metadata
  const image = sharp(filePath);
  const metadata = await image.metadata();

  // Resize if wider than MAX_WIDTH
  let pipeline = sharp(filePath);
  if (metadata.width && metadata.width > MAX_WIDTH) {
    pipeline = pipeline.resize(MAX_WIDTH, null, { withoutEnlargement: true });
  }

  // Convert to optimized WebP (best quality/size ratio)
  const outputBuffer = await pipeline
    .webp({ quality: QUALITY, effort: 6 })
    .toBuffer();

  // Also try keeping original format for comparison
  let formatBuffer;
  let formatPipeline = sharp(filePath);
  if (metadata.width && metadata.width > MAX_WIDTH) {
    formatPipeline = formatPipeline.resize(MAX_WIDTH, null, { withoutEnlargement: true });
  }

  if (ext === '.jpg' || ext === '.jpeg') {
    formatBuffer = await formatPipeline.jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();
  } else if (ext === '.png') {
    formatBuffer = await formatPipeline.png({ quality: QUALITY, compressionLevel: 9 }).toBuffer();
  } else if (ext === '.webp') {
    formatBuffer = outputBuffer; // already webp
  }

  // Use whichever is smaller, but prefer keeping the same extension to avoid breaking imports
  // Write optimized version in same format back to same path
  const bestBuffer = formatBuffer && formatBuffer.length < outputBuffer.length ? formatBuffer : outputBuffer;

  // For non-webp files, we'll write the optimized same-format version to keep imports working
  // For webp files, write the optimized webp
  let finalBuffer;
  if (ext === '.webp') {
    finalBuffer = outputBuffer;
  } else {
    // Write optimized version in original format
    finalBuffer = formatBuffer || outputBuffer;
  }

  // Copy original to backup first
  await sharp(filePath).toFile(backupPath);

  // Write optimized back
  const { data, info } = await sharp(finalBuffer).toBuffer({ resolveWithObject: true });
  await sharp(finalBuffer).toFile(filePath);

  const newSize = finalBuffer.length;
  const savings = ((origSize - newSize) / origSize * 100).toFixed(1);

  console.log(`${relPath}: ${formatSize(origSize)} → ${formatSize(newSize)} (${savings}% smaller)`);
  return { origSize, newSize };
}

async function main() {
  console.log('Scanning for images...\n');

  const publicImages = await getAllImages(PUBLIC);
  const assetImages = await getAllImages(ASSETS);
  const allImages = [...publicImages, ...assetImages];

  console.log(`Found ${allImages.length} images to optimize (>200KB)\n`);

  let totalOrig = 0, totalNew = 0;

  for (const img of allImages) {
    try {
      const result = await optimizeImage(img.path);
      totalOrig += result.origSize;
      totalNew += result.newSize;
    } catch (err) {
      console.error(`FAILED: ${img.path}: ${err.message}`);
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Total: ${formatSize(totalOrig)} → ${formatSize(totalNew)}`);
  console.log(`Saved: ${formatSize(totalOrig - totalNew)} (${((totalOrig - totalNew) / totalOrig * 100).toFixed(1)}%)`);
  console.log(`\nOriginals backed up to: public/_originals/`);
}

main().catch(console.error);
