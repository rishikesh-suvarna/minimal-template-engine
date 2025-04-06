import { exec as execCallback } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

// Convert callback-based exec to promise-based
const exec = promisify(execCallback);

// Get current directory (equivalent to __dirname in CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Debug function to help diagnose issues
function debug(message, obj = null) {
  console.log('\x1b[33m%s\x1b[0m', '🔍 DEBUG: ' + message);
  if (obj) {
    console.log(obj);
  }
}

// Create dist directory if it doesn't exist
const exampleDistDir = path.join(__dirname, 'dist', 'examples');
fs.mkdirSync(exampleDistDir, { recursive: true });

// Log current directory and paths for debugging
debug('Current directory', __dirname);
debug('Will compile TypeScript from', path.join(__dirname, 'src', 'examples'));
debug('Will output compiled files to', exampleDistDir);

// Ensure the tsconfig.json file exists
function ensureTsConfig() {
  const tsconfigPath = path.join(__dirname, 'src', 'examples', 'tsconfig.json');

  if (!fs.existsSync(tsconfigPath)) {
    console.log('Creating tsconfig.json for examples...');

    const tsConfig = {
      compilerOptions: {
        target: 'ES2020',
        module: 'ESNext',
        moduleResolution: 'node',
        esModuleInterop: true,
        strict: true,
        outDir: '../../dist/examples',
        sourceMap: true,
        lib: ['dom', 'dom.iterable', 'esnext'],
      },
      include: ['./**/*.ts'],
    };

    try {
      // Make sure the directory exists
      const tsconfigDir = path.dirname(tsconfigPath);
      fs.mkdirSync(tsconfigDir, { recursive: true });

      // Write the tsconfig file
      fs.writeFileSync(tsconfigPath, JSON.stringify(tsConfig, null, 2));
      console.log(`Created tsconfig.json at ${tsconfigPath}`);
    } catch (err) {
      console.error(`Error creating tsconfig.json: ${err.message}`);
    }
  }
}

// Call this before compiling TypeScript
ensureTsConfig();

// Main function to run the build process
async function runBuild() {
  try {
    // Compile TypeScript files with error handling and fallbacks
    console.log('Compiling TypeScript examples...');
    const tsconfigPath = path.join(
      __dirname,
      'src',
      'examples',
      'tsconfig.json',
    );

    try {
      // First attempt: npx tsc
      await exec(`npx tsc -p "${tsconfigPath}"`);
      console.log('Examples compiled successfully with npx tsc');
    } catch (error) {
      console.error(`Error compiling examples with npx: ${error.message}`);

      try {
        // Second attempt: traditional tsc
        console.log('Trying with traditional tsc...');
        await exec(`tsc -p "${tsconfigPath}"`);
        console.log('Examples compiled successfully with traditional tsc');
      } catch (error2) {
        console.error(
          `Error compiling with traditional tsc: ${error2.message}`,
        );

        // Manual TypeScript compilation attempt
        console.log('Attempting manual TypeScript compilation...');
        manualCompileTypeScript();
      }
    }

    // Continue with the rest of the build
    copyMainLibraryDist();
    copyHTMLFiles();
  } catch (error) {
    console.error('Build process failed:', error);
  }
}

// Function to manually compile TypeScript if tsc fails
function manualCompileTypeScript() {
  // This is a very simplified version - handling only the basic and components examples
  const sourceFiles = [
    {
      src: path.join(__dirname, 'src', 'examples', 'basic', 'app.ts'),
      dest: path.join(__dirname, 'dist', 'examples', 'basic', 'app.js'),
    },
    {
      src: path.join(
        __dirname,
        'src',
        'examples',
        'components',
        'todo-component.ts',
      ),
      dest: path.join(
        __dirname,
        'dist',
        'examples',
        'components',
        'todo-component.js',
      ),
    },
  ];

  // Ensure output directories exist
  fs.mkdirSync(path.join(__dirname, 'dist', 'examples', 'basic'), {
    recursive: true,
  });
  fs.mkdirSync(path.join(__dirname, 'dist', 'examples', 'components'), {
    recursive: true,
  });

  // Simple transformation of TypeScript to JavaScript
  // This is very basic and only works for simple TypeScript files
  sourceFiles.forEach((file) => {
    try {
      let content = fs.readFileSync(file.src, 'utf8');

      // Remove TypeScript types
      content = content.replace(/: [a-zA-Z<>[\]|]+/g, '');
      content = content.replace(/\?:/g, ':');
      content = content.replace(/<[a-zA-Z<>[\]|,\s]+>/g, '');

      // Write JavaScript file
      fs.writeFileSync(file.dest, content);
      console.log(`Manually compiled ${file.src} to ${file.dest}`);
    } catch (err) {
      console.error(`Error manually compiling ${file.src}: ${err.message}`);
    }
  });

  console.log('Manual TypeScript compilation completed');
}

// Function to copy the main library dist folder to examples dist
function copyMainLibraryDist() {
  console.log('Copying main library dist to examples folder...');

  const sourcePath = path.join(__dirname, 'dist');
  const destPath = path.join(__dirname, 'dist', 'examples', 'lib');

  // Verify that source path exists
  if (!fs.existsSync(sourcePath)) {
    console.error(`❌ ERROR: Source path does not exist: ${sourcePath}`);
    console.error(
      'Did you run "npm run build" to build the main library first?',
    );
    process.exit(1);
  }

  debug('Copying from', sourcePath);
  debug('Copying to', destPath);

  // Check if index.js exists
  const indexJsPath = path.join(sourcePath, 'index.js');
  if (!fs.existsSync(indexJsPath)) {
    console.error(
      `❌ ERROR: Main library entry point not found: ${indexJsPath}`,
    );
    console.error('Make sure the main library has been built correctly.');
    process.exit(1);
  }

  debug('Found main library entry point', indexJsPath);

  // Create destination directory
  fs.mkdirSync(destPath, { recursive: true });

  // Read all files in the source directory
  const files = fs.readdirSync(sourcePath);
  debug('Found files in source directory', files);

  // Copy each file
  files.forEach((file) => {
    // Skip the examples directory to avoid recursion
    if (file === 'examples') return;

    const sourceFile = path.join(sourcePath, file);
    const destFile = path.join(destPath, file);

    // Check if it's a directory or file
    const stats = fs.statSync(sourceFile);

    if (stats.isFile()) {
      // Only copy JavaScript files, not TypeScript declaration files
      if (file.endsWith('.js') || file.endsWith('.mjs')) {
        fs.copyFileSync(sourceFile, destFile);
        console.log(`Copied: ${sourceFile} to ${destFile}`);
      }
    }
  });

  // Update import paths in compiled JS files
  updateImportPaths();
}

// Function to update import paths in compiled JS files
function updateImportPaths() {
  console.log('Updating import paths in compiled JS files...');

  const baseDirs = ['basic', 'components', 'benchmarks'];

  baseDirs.forEach((dir) => {
    const distDir = path.join(__dirname, 'dist', 'examples', dir);

    // Make sure the directory exists
    if (!fs.existsSync(distDir)) {
      console.warn(`Directory doesn't exist: ${distDir}`);
      return;
    }

    // Read all JS files in the directory
    const files = fs.readdirSync(distDir);

    // Process JS files
    files.forEach((file) => {
      if (file.endsWith('.js')) {
        const filePath = path.join(distDir, file);

        // Read the file content
        let data = fs.readFileSync(filePath, 'utf8');

        // Replace relative imports to the project's dist folder with lib folder
        const updatedContent = data.replace(
          /from\s+['"]\.\.\/\.\.\/\.\.\/dist\//g,
          "from '../lib/",
        );

        // Write the updated content back to the file
        fs.writeFileSync(filePath, updatedContent);
        console.log(`Updated import paths in: ${filePath}`);
      }
    });
  });
}

// Function to copy HTML files to dist folder
function copyHTMLFiles() {
  console.log('Copying HTML files to dist folder...');

  const exampleDirs = ['basic', 'components', 'benchmarks'];

  exampleDirs.forEach((dir) => {
    const sourcePath = path.join(__dirname, 'src', 'examples', dir);
    const destPath = path.join(__dirname, 'dist', 'examples', dir);

    // Create directory if it doesn't exist
    fs.mkdirSync(destPath, { recursive: true });

    // Check if source directory exists
    if (!fs.existsSync(sourcePath)) {
      console.warn(`Source directory doesn't exist: ${sourcePath}`);
      return;
    }

    // Read all files in the directory
    const files = fs.readdirSync(sourcePath);

    // Copy HTML files
    files.forEach((file) => {
      if (file.endsWith('.html')) {
        const sourceFile = path.join(sourcePath, file);
        const destFile = path.join(destPath, file);

        // Read the file content
        const data = fs.readFileSync(sourceFile, 'utf8');

        // Copy HTML files to dist directory
        fs.writeFileSync(destFile, data);
        console.log(`Copied: ${destFile}`);
      }
    });
  });
}

// Run the build process
runBuild();
