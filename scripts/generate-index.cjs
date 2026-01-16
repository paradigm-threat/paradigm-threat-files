const { glob } = require('glob');
const fs = require('fs');
const path = require('path');

async function generateIndex() {
  const files = await glob('**/*', {
    nodir: true,
    ignore: [
      'node_modules/**',
      '.git/**',
      'package.json',
      'package-lock.json',
      'tsconfig.json',
      'index.json',
      'scripts/**',
      '.gitignore',
      'REORGANIZATION_MAP.md'
    ]
  });

  const sortedFiles = files.sort();
  fs.writeFileSync('index.json', JSON.stringify(sortedFiles, null, 2));
  console.log(`Generated index.json with ${sortedFiles.length} files.`);
}

generateIndex().catch(console.error);
