const fs = require('fs');

const filePath = 'd:/Projects/wealthystep/components/sections/FAQSection.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace all instances of escaped backticks with actual backticks
content = content.replace(/\\`/g, '`');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed backticks in FAQSection.tsx');
