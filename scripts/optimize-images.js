import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import { join, extname, basename } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const CONFIG = {
  // Maximum dimensions for different image types
  maxWidth: {
    hero: 1200, // Hero/feature images
    card: 800, // Card thumbnails
    gallery: 1000, // Gallery images
    default: 1200, // Default max width
  },
  // Quality settings
  quality: {
    jpg: 80,
    webp: 80,
    png: 80,
  },
  // Directories to process
  directories: [
    { path: "public/imagesStories", type: "card" },
    { path: "public/about-gallery", type: "gallery" },
    { path: "public", type: "hero", files: ["aaryan-about.jpg"] },
  ],
};

// Get file size in KB
async function getFileSize(filePath) {
  const stats = await stat(filePath);
  return Math.round(stats.size / 1024);
}

// Process a single image
async function processImage(inputPath, outputPath, maxWidth, quality) {
  const ext = extname(inputPath).toLowerCase();

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Only resize if image is larger than maxWidth
    const needsResize = metadata.width > maxWidth;

    let pipeline = image;

    if (needsResize) {
      pipeline = pipeline.resize(maxWidth, null, {
        withoutEnlargement: true,
        fit: "inside",
      });
    }

    // Apply format-specific optimizations
    if (ext === ".jpg" || ext === ".jpeg") {
      pipeline = pipeline.jpeg({
        quality: quality.jpg,
        progressive: true,
        mozjpeg: true,
      });
    } else if (ext === ".png") {
      pipeline = pipeline.png({
        quality: quality.png,
        compressionLevel: 9,
        progressive: true,
      });
    } else if (ext === ".webp") {
      pipeline = pipeline.webp({
        quality: quality.webp,
      });
    }

    await pipeline.toFile(outputPath);
    return true;
  } catch (error) {
    console.error(`Error processing ${inputPath}:`, error.message);
    return false;
  }
}

// Process all images in a directory
async function processDirectory(dirConfig) {
  const { path: dirPath, type, files: specificFiles } = dirConfig;
  const fullDirPath = join(__dirname, "..", dirPath);
  const maxWidth = CONFIG.maxWidth[type] || CONFIG.maxWidth.default;

  console.log(`\n📁 Processing: ${dirPath} (max width: ${maxWidth}px)`);
  console.log("─".repeat(50));

  let filesToProcess = [];

  if (specificFiles) {
    filesToProcess = specificFiles.map((f) => join(fullDirPath, f));
  } else {
    try {
      const entries = await readdir(fullDirPath);
      filesToProcess = entries
        .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
        .map((f) => join(fullDirPath, f));
    } catch (error) {
      console.error(`Error reading directory ${dirPath}:`, error.message);
      return;
    }
  }

  let totalSaved = 0;

  for (const filePath of filesToProcess) {
    const fileName = basename(filePath);
    const beforeSize = await getFileSize(filePath);

    // Create a temp file for the optimized version
    const tempPath = filePath + ".optimized";

    const success = await processImage(
      filePath,
      tempPath,
      maxWidth,
      CONFIG.quality,
    );

    if (success) {
      const afterSize = await getFileSize(tempPath);
      const saved = beforeSize - afterSize;
      const percent = Math.round((saved / beforeSize) * 100);

      if (saved > 0) {
        // Replace original with optimized
        const { rename, unlink } = await import("fs/promises");
        await unlink(filePath);
        await rename(tempPath, filePath);

        totalSaved += saved;
        console.log(
          `✅ ${fileName}: ${beforeSize}KB → ${afterSize}KB (saved ${saved}KB, ${percent}%)`,
        );
      } else {
        // Keep original if optimized is larger
        const { unlink } = await import("fs/promises");
        await unlink(tempPath);
        console.log(`⏭️  ${fileName}: ${beforeSize}KB (already optimized)`);
      }
    } else {
      console.log(`❌ ${fileName}: Failed to process`);
    }
  }

  console.log(`\n💰 Total saved in ${dirPath}: ${totalSaved}KB`);
  return totalSaved;
}

// Generate WebP versions of images
async function generateWebPVersions(dirPath) {
  const fullDirPath = join(__dirname, "..", dirPath);

  console.log(`\n🖼️  Generating WebP versions for: ${dirPath}`);
  console.log("─".repeat(50));

  try {
    const entries = await readdir(fullDirPath);
    const images = entries.filter((f) => /\.(jpg|jpeg|png)$/i.test(f));

    for (const fileName of images) {
      const inputPath = join(fullDirPath, fileName);
      const outputPath = join(
        fullDirPath,
        fileName.replace(/\.(jpg|jpeg|png)$/i, ".webp"),
      );

      try {
        await sharp(inputPath)
          .webp({ quality: CONFIG.quality.webp })
          .toFile(outputPath);

        const originalSize = await getFileSize(inputPath);
        const webpSize = await getFileSize(outputPath);
        console.log(
          `✅ ${fileName} → .webp: ${originalSize}KB → ${webpSize}KB`,
        );
      } catch (error) {
        console.log(`❌ ${fileName}: ${error.message}`);
      }
    }
  } catch (error) {
    console.error(`Error generating WebP for ${dirPath}:`, error.message);
  }
}

// Main execution
async function main() {
  console.log("🚀 Image Optimization Script");
  console.log("═".repeat(50));

  let grandTotalSaved = 0;

  // Process each directory
  for (const dirConfig of CONFIG.directories) {
    const saved = await processDirectory(dirConfig);
    if (saved) grandTotalSaved += saved;
  }

  // Generate WebP versions
  await generateWebPVersions("public/imagesStories");
  await generateWebPVersions("public/about-gallery");

  console.log("\n" + "═".repeat(50));
  console.log(
    `🎉 Optimization complete! Total saved: ${grandTotalSaved}KB (${Math.round(grandTotalSaved / 1024)}MB)`,
  );
}

main().catch(console.error);
