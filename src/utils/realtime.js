export const createRealtimeMonitor = () => {
  const monitor = {
    active: true,
    data: {
      performance: [],
      network: [],
      battery: [],
      memory: [],
      location: []
    }
  }

  const updatePerformance = () => {
    if (!monitor.active) return
    
    monitor.data.performance.push({
      timestamp: Date.now(),
      memory: performance.memory ? {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize
      } : null,
      timing: performance.now()
    })
    
    if (monitor.data.performance.length > 100) {
      monitor.data.performance.shift()
    }
  }

  const updateNetwork = () => {
    if (!monitor.active || !navigator.connection) return
    
    monitor.data.network.push({
      timestamp: Date.now(),
      effectiveType: navigator.connection.effectiveType,
      downlink: navigator.connection.downlink,
      rtt: navigator.connection.rtt,
      saveData: navigator.connection.saveData
    })
    
    if (monitor.data.network.length > 50) {
      monitor.data.network.shift()
    }
  }

  const updateBattery = async () => {
    if (!monitor.active || !('getBattery' in navigator)) return
    
    try {
      const battery = await navigator.getBattery()
      monitor.data.battery.push({
        timestamp: Date.now(),
        level: battery.level,
        charging: battery.charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime
      })
      
      if (monitor.data.battery.length > 50) {
        monitor.data.battery.shift()
      }
    } catch (e) {
      // Battery API not available
    }
  }

  const updateLocation = () => {
    if (!monitor.active || !('geolocation' in navigator)) return
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        monitor.data.location.push({
          timestamp: Date.now(),
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          speed: position.coords.speed
        })
        
        if (monitor.data.location.length > 20) {
          monitor.data.location.shift()
        }
      },
      () => {}, // Error callback - do nothing
      { timeout: 5000, enableHighAccuracy: false }
    )
  }

  // Start monitoring
  const performanceInterval = setInterval(updatePerformance, 1000)
  const networkInterval = setInterval(updateNetwork, 5000)
  const batteryInterval = setInterval(updateBattery, 10000)
  const locationInterval = setInterval(updateLocation, 30000)

  // Initial updates
  updatePerformance()
  updateNetwork()
  updateBattery()
  updateLocation()

  return {
    getData: () => monitor.data,
    stop: () => {
      monitor.active = false
      clearInterval(performanceInterval)
      clearInterval(networkInterval)
      clearInterval(batteryInterval)
      clearInterval(locationInterval)
    }
  }
}