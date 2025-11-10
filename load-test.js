const http = require('http');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

// Configuration
const TARGET_URL = 'http://localhost:5002/api/products?limit=24';
const CONCURRENT_USERS = 1000; // Simulate 1000 concurrent users
const TEST_DURATION = 60000; // 1 minute test
const REQUEST_INTERVAL = 100; // ms between requests per user

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  console.log(`Simulating ${CONCURRENT_USERS} concurrent users`);
  console.log(`Test duration: ${TEST_DURATION/1000} seconds`);
  
  // Fork workers
  for (let i = 0; i < Math.min(numCPUs, 4); i++) {
    cluster.fork();
  }
  
  // Track statistics
  let totalRequests = 0;
  let successfulRequests = 0;
  let failedRequests = 0;
  let totalResponseTime = 0;
  
  // Collect stats from workers
  cluster.on('message', (worker, msg) => {
    if (msg.type === 'stats') {
      totalRequests += msg.totalRequests;
      successfulRequests += msg.successfulRequests;
      failedRequests += msg.failedRequests;
      totalResponseTime += msg.totalResponseTime;
    }
  });
  
  // Log results periodically
  const logInterval = setInterval(() => {
    console.log(`Requests: ${totalRequests}, Success: ${successfulRequests}, Failed: ${failedRequests}`);
  }, 5000);
  
  // End test after duration
  setTimeout(() => {
    clearInterval(logInterval);
    console.log('\n=== LOAD TEST RESULTS ===');
    console.log(`Total Requests: ${totalRequests}`);
    console.log(`Successful Requests: ${successfulRequests}`);
    console.log(`Failed Requests: ${failedRequests}`);
    console.log(`Success Rate: ${((successfulRequests/totalRequests)*100).toFixed(2)}%`);
    if (successfulRequests > 0) {
      console.log(`Average Response Time: ${(totalResponseTime/successfulRequests).toFixed(2)}ms`);
    }
    console.log('========================\n');
    
    // Kill all workers
    for (const id in cluster.workers) {
      cluster.workers[id].kill();
    }
  }, TEST_DURATION);
  
} else {
  // Worker process
  console.log(`Worker ${process.pid} started`);
  
  let totalRequests = 0;
  let successfulRequests = 0;
  let failedRequests = 0;
  let totalResponseTime = 0;
  
  // Function to make HTTP request
  function makeRequest() {
    totalRequests++;
    const startTime = Date.now();
    
    http.get(TARGET_URL, (res) => {
      const endTime = Date.now();
      totalResponseTime += (endTime - startTime);
      
      if (res.statusCode === 200) {
        successfulRequests++;
      } else {
        failedRequests++;
      }
      
      // Clean up response
      res.resume();
    }).on('error', (err) => {
      failedRequests++;
      console.error(`Request failed: ${err.message}`);
    });
  }
  
  // Create virtual users
  for (let i = 0; i < Math.ceil(CONCURRENT_USERS / (numCPUs * 2)); i++) {
    setInterval(makeRequest, REQUEST_INTERVAL);
  }
  
  // Send stats to master periodically
  setInterval(() => {
    process.send({
      type: 'stats',
      totalRequests,
      successfulRequests,
      failedRequests,
      totalResponseTime
    });
    
    // Reset counters
    totalRequests = 0;
    successfulRequests = 0;
    failedRequests = 0;
    totalResponseTime = 0;
  }, 5000);
}