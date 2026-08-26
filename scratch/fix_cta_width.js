const fs = require('fs');
const path = require('path');
const dir = 'd:/Projects/wealthystep/components/calculators';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find the CTA block
  const oldClass = 'className="w-full bg-[#180D45] rounded-[20px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden mt-4"';
  const newClass = 'className="w-full max-w-5xl mx-auto bg-[#180D45] rounded-[20px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden mt-4"';
  
  if (content.includes(oldClass)) {
    content = content.replace(oldClass, newClass);
    fs.writeFileSync(filePath, content);
    console.log('Fixed CTA in ' + file);
  }
}
