import sharp from "sharp";
import { readdir, mkdir, stat } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.join(__dirname, "public", "about-gallery-backup");
const OUTPUT_DIR = path.join(__dirname, "public", "about-gallery");

// Image optimization settings
const JPEG_QUALITY = 82;
const MAX_WIDTH = 1200; // Maximum width for images
const MAX_HEIGHT = 1200; // Maximum height for images

async function optimizeImages() {
  try {
    // Check if backup directory exists
    if (!existsSync(INPUT_DIR)) {
      console.log("❌ Backup directory not found. Creating it now...");
      console.log(`   Please ensure images are in: ${INPUT_DIR}`);
      await mkdir(INPUT_DIR, { recursive: true });
      return;
    }

    // Create output directory if it doesn't exist
    if (!existsSync(OUTPUT_DIR)) {
      await mkdir(OUTPUT_DIR, { recursive: true });
      console.log(`✅ Created output directory: ${OUTPUT_DIR}`);
    }

    // Read all files from input directory
    const files = await readdir(INPUT_DIR);
    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|JPG|JPEG|PNG)$/i.test(file),
    );

    console.log(`\n📸 Found ${imageFiles.length} images to optimize...\n`);

    let totalOriginalSize = 0;
    let totalOptimizedSize = 0;

    for (const file of imageFiles) {
      const inputPath = path.join(INPUT_DIR, file);
      const outputBaseName = path.parse(file).name;

      try {
        // Get original file size
        const stats = await stat(inputPath);
        const originalSize = stats.size;
        totalOriginalSize += originalSize;

        console.log(
          `Processing: ${file} (${(originalSize / 1024 / 1024).toFixed(2)} MB)`,
        );

        // Load image
        const image = sharp(inputPath);
        const metadata = await image.metadata();

        // Resize if needed
        let resizeOptions = {};
        if (metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT) {
          resizeOptions = {
            width: MAX_WIDTH,
            height: MAX_HEIGHT,
            fit: "inside",
            withoutEnlargement: true,
          };
        }

        // Create optimized JPEG (preserves orientation automatically)
        const jpegPath = path.join(OUTPUT_DIR, `${outputBaseName}.jpg`);
        await sharp(inputPath)
          .rotate() // Auto-rotate based on EXIF orientation
          .resize(resizeOptions)
          .jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true })
          .toFile(jpegPath);

        // Get optimized file size
        const jpegStats = await stat(jpegPath);
        const jpegSize = jpegStats.size;
        totalOptimizedSize += jpegSize;

        const savings = ((1 - jpegSize / originalSize) * 100).toFixed(1);

        console.log(`  ✅ Optimized: ${(jpegSize / 1024).toFixed(0)} KB`);
        console.log(`  💾 Savings: ${savings}%\n`);
      } catch (error) {
        console.error(`  ❌ Error processing ${file}:`, error.message);
      }
    }

    // Print summary
    console.log("\n" + "=".repeat(60));
    console.log("📊 OPTIMIZATION SUMMARY");
    console.log("=".repeat(60));
    console.log(`Total images processed: ${imageFiles.length}`);
    console.log(
      `Original total size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`,
    );
    console.log(
      `Optimized total size: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`,
    );
    console.log(
      `Total savings: ${((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(1)}%`,
    );
    console.log(
      `Size reduction: ${((totalOriginalSize - totalOptimizedSize) / 1024 / 1024).toFixed(2)} MB`,
    );
    console.log("=".repeat(60));
    console.log("\n✨ Done! Optimized images are in: public/about-gallery/");
    console.log(
      "\n💡 Images have been optimized as JPEGs with correct orientation preserved.",
    );
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

optimizeImages();
