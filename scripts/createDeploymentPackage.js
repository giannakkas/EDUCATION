const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, '../dist');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Create a file to stream archive data to
const output = fs.createWriteStream(path.join(outputDir, 'edu-platform.zip'));
const archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level
});

// Listen for all archive data to be written
output.on('close', () => {
  console.log(`Deployment package created: ${archive.pointer()} total bytes`);
  console.log('The archive has been finalized and the output file descriptor has been closed.');
});

// Handle warnings and errors
archive.on('warning', (err) => {
  if (err.code === 'ENOENT') {
    console.warn('Warning:', err);
  } else {
    throw err;
  }
});

archive.on('error', (err) => {
  throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Add files and directories
archive.directory('src/', 'src');
archive.file('package.json', { name: 'package.json' });
archive.file('README.md', { name: 'README.md' });
archive.file('server.js', { name: 'server.js' });
archive.file('.env.example', { name: '.env.example' });

// Finalize the archive
archive.finalize(); 