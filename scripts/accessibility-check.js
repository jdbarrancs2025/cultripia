#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Running Accessibility Checks...\n');

const issues = [];

// Check for missing alt texts in images
function checkAltTexts(filePath, content) {
  const imgRegex = /<img[^>]*>/gi;
  const imageRegex = /<Image[^>]*>/gi;
  const altRegex = /alt\s*=\s*["']([^"']*)/i;
  
  const imgs = content.match(imgRegex) || [];
  const images = content.match(imageRegex) || [];
  
  [...imgs, ...images].forEach((img) => {
    if (!altRegex.test(img) || img.match(altRegex)?.[1] === '') {
      issues.push({
        file: filePath,
        type: 'Missing alt text',
        line: img
      });
    }
  });
}

// Check for proper ARIA labels
function checkAriaLabels(filePath, content) {
  const buttonRegex = /<button[^>]*>/gi;
  const ariaRegex = /aria-label\s*=|aria-labelledby\s*=/i;
  
  const buttons = content.match(buttonRegex) || [];
  buttons.forEach((button) => {
    if (!button.includes('aria-label') && !button.includes('aria-labelledby') && !button.includes('>')) {
      const hasText = /<button[^>]*>([^<]+)</i.test(content);
      if (!hasText) {
        issues.push({
          file: filePath,
          type: 'Button without accessible label',
          line: button
        });
      }
    }
  });
}

// Check for form labels
function checkFormLabels(filePath, content) {
  const inputRegex = /<(input|Input)[^>]*type\s*=\s*["'](?!hidden|submit|button)/gi;
  const selectRegex = /<(select|Select)[^>]*>/gi;
  const textareaRegex = /<(textarea|Textarea)[^>]*>/gi;
  
  const formElements = [
    ...(content.match(inputRegex) || []),
    ...(content.match(selectRegex) || []),
    ...(content.match(textareaRegex) || [])
  ];
  
  formElements.forEach((element) => {
    const id = element.match(/id\s*=\s*["']([^"']*)/i)?.[1];
    if (id && !content.includes(`htmlFor="${id}"`) && !content.includes(`htmlFor={'${id}'}`)) {
      issues.push({
        file: filePath,
        type: 'Form element without associated label',
        line: element
      });
    }
  });
}

// Check color contrast (basic check for hardcoded colors)
function checkColorContrast(filePath, content) {
  const colorRegex = /(?:text|bg)-\[#([A-Fa-f0-9]{6})\]/g;
  const matches = content.matchAll(colorRegex);
  
  for (const match of matches) {
    const color = match[1];
    // Check for very light colors on white background
    if (parseInt(color, 16) > 0xE0E0E0) {
      issues.push({
        file: filePath,
        type: 'Potential color contrast issue',
        line: match[0],
        note: 'Light color that may not meet WCAG AA standards'
      });
    }
  }
}

// Scan all TSX files
function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules') && !file.startsWith('.')) {
      scanDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      const content = fs.readFileSync(filePath, 'utf8');
      checkAltTexts(filePath, content);
      checkAriaLabels(filePath, content);
      checkFormLabels(filePath, content);
      checkColorContrast(filePath, content);
    }
  });
}

// Run the scan
const projectRoot = path.join(__dirname, '..');
scanDirectory(path.join(projectRoot, 'app'));
scanDirectory(path.join(projectRoot, 'components'));

// Report results
console.log('📊 ACCESSIBILITY CHECK RESULTS\n');
console.log('================================\n');

if (issues.length === 0) {
  console.log('✅ No accessibility issues found!\n');
} else {
  console.log(`⚠️  Found ${issues.length} potential accessibility issues:\n`);
  
  const groupedIssues = issues.reduce((acc, issue) => {
    if (!acc[issue.type]) acc[issue.type] = [];
    acc[issue.type].push(issue);
    return acc;
  }, {});
  
  Object.entries(groupedIssues).forEach(([type, typeIssues]) => {
    console.log(`\n${type} (${typeIssues.length} issues):`);
    typeIssues.slice(0, 5).forEach((issue) => {
      console.log(`  - ${issue.file.replace(projectRoot, '.')}`);
      if (issue.note) console.log(`    Note: ${issue.note}`);
    });
    if (typeIssues.length > 5) {
      console.log(`  ... and ${typeIssues.length - 5} more`);
    }
  });
}

console.log('\n✨ Accessibility check complete!');