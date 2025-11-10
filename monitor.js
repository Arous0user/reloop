const os = require('os');
const http = require('http');

// Configuration
const HEALTH_CHECK_URL = 'http://localhost:5002/health/full';
const MONITOR_INTERVAL = 5000; // 5 seconds

console.log('Starting application performance monitor...');
console.log(`Monitoring: ${HEALTH_CHECK_URL}`);
console.log(`Interval: ${MONITOR_INTERVAL/1000} seconds\n`);

// Function to get system metrics
function getSystemMetrics() {
  const cpuUsage = os.loadavg();
  const memoryUsage = process.memoryUsage();
  const freeMemory = os.freemem();
  const totalMemory = os.totalmem();
  
  return {
    cpu: {
      load1: cpuUsage[0].toFixed(2),
      load5: cpuUsage[1].toFixed(2),
      load15: cpuUsage[2].toFixed(2)
    },
    memory: {
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
      systemUsed: Math.round((totalMemory - freeMemory) / 1024 / 1024) + ' MB',
      systemTotal: Math.round(totalMemory / 1024 / 1024) + ' MB'
    }
  };
}

// Function to check application health
function checkApplicationHealth() {
  return new Promise((resolve, reject) => {
    http.get(HEALTH_CHECK_URL, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const healthData = JSON.parse(data);
          resolve(healthData);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// Main monitoring function
async function monitor() {
  try {
    const systemMetrics = getSystemMetrics();
    const appHealth = await checkApplicationHealth();
    
    console.log('=== System Metrics ===');
    console.log(`CPU Load (1/5/15 min): ${systemMetrics.cpu.load1}/${systemMetrics.cpu.load5}/${systemMetrics.cpu.load15}`);
    console.log(`Memory Usage: ${systemMetrics.memory.heapUsed}/${systemMetrics.memory.heapTotal} (Heap)`);
    console.log(`System Memory: ${systemMetrics.memory.systemUsed}/${systemMetrics.memory.systemTotal}`);
    
    console.log('\n=== Application Health ===');
    console.log(`Status: ${appHealth.status}`);
    console.log(`Database: ${appHealth.database}`);
    console.log(`Cache: ${appHealth.cache}`);
    console.log(`Uptime: ${Math.round(appHealth.uptime)} seconds`);
    
    console.log('\n' + '='.repeat(50) + '\n');
  } catch (error) {
    console.error('Monitoring error:', error.message);
  }
}

// Start monitoring
monitor();
const intervalId = setInterval(monitor, MONITOR_INTERVAL);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Stopping monitor...');
  clearInterval(intervalId);
  process.exit(0);
});