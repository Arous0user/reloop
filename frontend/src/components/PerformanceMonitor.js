import React, { useState, useEffect } from 'react';

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    responseTime: 0,
    cacheHitRate: 0,
    activeUsers: 0,
    productListings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // In a real implementation, this would call your monitoring API
        // For now, we'll simulate the data
        const simulatedMetrics = {
          responseTime: Math.floor(Math.random() * 100) + 50, // 50-150ms
          cacheHitRate: Math.floor(Math.random() * 30) + 70, // 70-100%
          activeUsers: Math.floor(Math.random() * 1000) + 4500, // 4500-5500
          productListings: 200000 // Fixed at 200,000
        };
        
        setMetrics(simulatedMetrics);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
        setLoading(false);
      }
    };

    fetchMetrics();
    
    // Update metrics every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Monitor</h3>
        <p>Loading metrics...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Monitor</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border rounded-lg p-4">
          <div className="text-sm text-gray-500 mb-1">Response Time</div>
          <div className="text-2xl font-bold text-gray-900">{metrics.responseTime}ms</div>
          <div className="text-xs text-green-600 mt-1">
            {metrics.responseTime < 100 ? 'Excellent' : metrics.responseTime < 200 ? 'Good' : 'Needs improvement'}
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="text-sm text-gray-500 mb-1">Cache Hit Rate</div>
          <div className="text-2xl font-bold text-gray-900">{metrics.cacheHitRate}%</div>
          <div className="text-xs text-green-600 mt-1">
            {metrics.cacheHitRate > 90 ? 'Excellent' : metrics.cacheHitRate > 80 ? 'Good' : 'Needs improvement'}
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="text-sm text-gray-500 mb-1">Active Users</div>
          <div className="text-2xl font-bold text-gray-900">{metrics.activeUsers.toLocaleString()}</div>
          <div className="text-xs text-green-600 mt-1">
            {metrics.activeUsers > 5000 ? 'Capacity exceeded' : 'Within limits'}
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="text-sm text-gray-500 mb-1">Product Listings</div>
          <div className="text-2xl font-bold text-gray-900">{metrics.productListings.toLocaleString()}</div>
          <div className="text-xs text-green-600 mt-1">Capacity: 200,000</div>
        </div>
      </div>
      
      <div className="mt-6">
        <h4 className="font-medium text-gray-900 mb-2">System Status</h4>
        <div className="flex items-center">
          <div className={`h-3 w-3 rounded-full mr-2 ${metrics.responseTime < 200 && metrics.cacheHitRate > 80 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <span className="text-sm">
            {metrics.responseTime < 200 && metrics.cacheHitRate > 80 ? 'All systems operational' : 'Performance degradation'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;
