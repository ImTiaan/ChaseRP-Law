import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '../../');
const outputDir = path.resolve(__dirname, '../src/data');
const outputFile = path.join(outputDir, 'content.json');

const filesToProcess = [
  'Case_Laws.md',
  'Constitution.md',
  'Legal_Definitions.md',
  'Notices.md',
  'Penal_code.md',
  'Radio_Codes.md',
  'Use_of_Force.md',
  'Court_Procedures.md'
];

function processFiles() {
  const content = [];

  filesToProcess.forEach(filename => {
    const filePath = path.join(rootDir, filename);
    
    if (fs.existsSync(filePath)) {
      const rawContent = fs.readFileSync(filePath, 'utf-8');
      const title = filename.replace('.md', '').replace(/_/g, ' ');
      
      content.push({
        id: filename.replace('.md', ''),
        title: title,
        content: rawContent,
        filename: filename
      });
      console.log(`Processed ${filename}`);
    } else {
      console.warn(`Warning: File ${filename} not found at ${filePath}`);
    }
  });

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputFile, JSON.stringify(content, null, 2));
  console.log(`Generated content.json at ${outputFile}`);
}

processFiles();
