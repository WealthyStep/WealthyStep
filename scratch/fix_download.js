const fs = require('fs');
const path = require('path');

const dir = 'd:/Projects/wealthystep/components/calculators';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Try to remove the block using regex
  // This matches <button ...> Download Report <Download /> </button>
  // or variations across multiple lines
  const regex = /<button[\s\S]*?>\s*Download Report\s*<Download[\s\S]*?\/>\s*<\/button>/g;
  
  if (regex.test(content)) {
    console.log('Found in ' + file);
    content = content.replace(regex, '');
    fs.writeFileSync(filePath, content);
  } else {
    console.log('Not found in ' + file);
  }
}
