#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const pages = [
  { name: 'Landing Page', url: 'http://localhost:3001/' },
  { name: 'Experiences Grid', url: 'http://localhost:3001/experiences' },
  { name: 'Host Application', url: 'http://localhost:3001/become-a-host' },
  { name: 'Traveler Dashboard', url: 'http://localhost:3001/dashboard' },
  { name: 'Host Dashboard', url: 'http://localhost:3001/host/dashboard' },
  { name: 'Admin Dashboard', url: 'http://localhost:3001/admin' }
];

// Create reports directory
const reportsDir = path.join(__dirname, '../lighthouse-reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir);
}

console.log('🏗️  Running Lighthouse audits...\n');

const results = [];

for (const page of pages) {
  console.log(`📊 Auditing: ${page.name}`);
  const reportPath = path.join(reportsDir, `${page.name.toLowerCase().replace(/\s+/g, '-')}.html`);
  
  try {
    const output = execSync(
      `lighthouse ${page.url} --output=html --output-path="${reportPath}" --quiet --chrome-flags="--headless"`,
      { encoding: 'utf8' }
    );
    
    // Extract scores from the output
    const scoreMatch = output.match(/Performance:\s+(\d+)/);
    const accessibilityMatch = output.match(/Accessibility:\s+(\d+)/);
    const bestPracticesMatch = output.match(/Best Practices:\s+(\d+)/);
    const seoMatch = output.match(/SEO:\s+(\d+)/);
    
    const scores = {
      performance: scoreMatch ? parseInt(scoreMatch[1]) : 0,
      accessibility: accessibilityMatch ? parseInt(accessibilityMatch[1]) : 0,
      bestPractices: bestPracticesMatch ? parseInt(bestPracticesMatch[1]) : 0,
      seo: seoMatch ? parseInt(seoMatch[1]) : 0
    };
    
    results.push({
      page: page.name,
      url: page.url,
      scores,
      report: reportPath
    });
    
    console.log(`✅ ${page.name} - Performance: ${scores.performance}, Accessibility: ${scores.accessibility}, Best Practices: ${scores.bestPractices}, SEO: ${scores.seo}\n`);
  } catch (error) {
    console.error(`❌ Error auditing ${page.name}: ${error.message}\n`);
    results.push({
      page: page.name,
      url: page.url,
      error: error.message
    });
  }
}

// Generate summary report
console.log('\n📋 LIGHTHOUSE AUDIT SUMMARY\n');
console.log('========================\n');

let passCount = 0;
let totalPages = 0;

for (const result of results) {
  if (result.error) {
    console.log(`❌ ${result.page}: ERROR - ${result.error}`);
  } else {
    totalPages++;
    const { scores } = result;
    const passed = scores.performance >= 90 && scores.accessibility >= 95;
    
    if (passed) passCount++;
    
    console.log(`${passed ? '✅' : '⚠️ '} ${result.page}:`);
    console.log(`   Performance: ${scores.performance} ${scores.performance >= 90 ? '✓' : '✗'}`);
    console.log(`   Accessibility: ${scores.accessibility} ${scores.accessibility >= 95 ? '✓' : '✗'}`);
    console.log(`   Best Practices: ${scores.bestPractices}`);
    console.log(`   SEO: ${scores.seo}`);
    console.log(`   Report: ${result.report}\n`);
  }
}

console.log(`\n📊 Overall: ${passCount}/${totalPages} pages meet target scores`);
console.log('🎯 Targets: Performance ≥ 90, Accessibility ≥ 95\n');

// Save results as JSON
const summaryPath = path.join(reportsDir, 'summary.json');
fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2));
console.log(`💾 Full results saved to: ${summaryPath}`);