const fs = require('fs');
const path = require('path');

function addContextualLinksToSipCalculator() {
  const filePath = 'd:/Projects/wealthystep/components/calculators/SipCalculator.tsx';
  let content = fs.readFileSync(filePath, 'utf8');

  if (!content.includes('Related Resources')) {
    const contextualLinks = `
      {/* Contextual SEO Links */}
      <div className="mt-8 pt-8 border-t border-gray-100">
        <h4 className="text-lg font-bold text-navy mb-4 font-heading">Related Resources</h4>
        <ul className="space-y-3">
          <li>
            <a href="/knowledge/power-of-compounding-in-mutual-funds" className="text-lime hover:text-navy transition-colors font-medium flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              Understand the Power of Compounding
            </a>
          </li>
          <li>
            <a href="/investments" className="text-lime hover:text-navy transition-colors font-medium flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              Explore Mutual Fund Solutions
            </a>
          </li>
        </ul>
      </div>
    `;

    // Inject before the final closing div of the calculator layout
    const closingTagsRegex = /(<\/div>\s*<\/div>\s*<\/div>\s*)$/;
    
    // Actually, looking at typical calculator structures in this project, it's safer to inject right after the disclaimer.
    content = content.replace(
      /(<p className="text-xs text-text-light mb-4">[\s\S]*?<\/p>)/,
      `$1\n${contextualLinks}`
    );

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Added contextual links to SipCalculator.tsx');
  }
}

addContextualLinksToSipCalculator();
