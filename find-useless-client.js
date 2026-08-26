const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const clientIndicators = [
  'useState', 'useEffect', 'useRef', 'useContext', 'useReducer',
  'useCallback', 'useMemo', 'useAnimation', 'motion.', 'motion(',
  'onClick', 'onChange', 'onSubmit', 'onKeyDown', 'window.', 'document.', 'usePathname', 'useRouter', 'useSearchParams', 'Swiper', 'Chart', 'createContext'
];

const filesToFix = [];

walkDir('components', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('"use client"') || content.includes("'use client'")) {
      const hasClientIndicator = clientIndicators.some(indicator => content.includes(indicator));
      if (!hasClientIndicator) {
        filesToFix.push(filePath);
      }
    }
  }
});

console.log("Unnecessary 'use client' files:");
filesToFix.forEach(f => console.log(f));
