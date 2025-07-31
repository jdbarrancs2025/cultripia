// Simple performance check script
const https = require('https');
const http = require('http');
const { performance } = require('perf_hooks');
const url = require('url');

async function checkPerformance(targetUrl) {
  const urlParts = url.parse(targetUrl);
  const protocol = urlParts.protocol === 'https:' ? https : http;
  
  console.log(`\nChecking performance for: ${targetUrl}\n`);
  
  const start = performance.now();
  
  return new Promise((resolve, reject) => {
    protocol.get(targetUrl, (res) => {
      let data = '';
      let firstByteTime = null;
      
      res.on('data', (chunk) => {
        if (!firstByteTime) {
          firstByteTime = performance.now() - start;
        }
        data += chunk;
      });
      
      res.on('end', () => {
        const totalTime = performance.now() - start;
        const sizeInKB = Buffer.byteLength(data) / 1024;
        
        console.log('Performance Metrics:');
        console.log(`- Status Code: ${res.statusCode}`);
        console.log(`- Time to First Byte: ${firstByteTime.toFixed(2)}ms`);
        console.log(`- Total Load Time: ${totalTime.toFixed(2)}ms`);
        console.log(`- Page Size: ${sizeInKB.toFixed(2)}KB`);
        console.log(`- Headers: ${JSON.stringify(res.headers, null, 2)}`);
        
        resolve({
          statusCode: res.statusCode,
          ttfb: firstByteTime,
          totalTime: totalTime,
          size: sizeInKB
        });
      });
    }).on('error', (err) => {
      console.error('Error:', err);
      reject(err);
    });
  });
}

// Check main pages
const pages = [
  'http://localhost:3000',
  'http://localhost:3000/experiences',
  'http://localhost:3000/become-a-host'
];

async function runChecks() {
  for (const page of pages) {
    await checkPerformance(page);
  }
}

runChecks().catch(console.error);