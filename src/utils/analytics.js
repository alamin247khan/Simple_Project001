export const trackUserBehavior = () => {
  const behavior = {
    mouseMovements: [],
    clicks: [],
    keystrokes: [],
    scrolls: [],
    focus: [],
    visibility: [],
    performance: getPerformanceMetrics(),
    startTime: Date.now()
  }

  // Track mouse movements
  document.addEventListener('mousemove', (e) => {
    behavior.mouseMovements.push({
      x: e.clientX,
      y: e.clientY,
      timestamp: Date.now()
    })
    if (behavior.mouseMovements.length > 100) behavior.mouseMovements.shift()
  })

  // Track clicks
  document.addEventListener('click', (e) => {
    behavior.clicks.push({
      x: e.clientX,
      y: e.clientY,
      target: e.target.tagName,
      timestamp: Date.now()
    })
  })

  // Track keystrokes (without capturing actual keys for privacy)
  document.addEventListener('keydown', () => {
    behavior.keystrokes.push(Date.now())
    if (behavior.keystrokes.length > 50) behavior.keystrokes.shift()
  })

  // Track scroll behavior
  document.addEventListener('scroll', () => {
    behavior.scrolls.push({
      scrollY: window.scrollY,
      timestamp: Date.now()
    })
    if (behavior.scrolls.length > 50) behavior.scrolls.shift()
  })

  // Track focus/blur events
  window.addEventListener('focus', () => {
    behavior.focus.push({ type: 'focus', timestamp: Date.now() })
  })
  window.addEventListener('blur', () => {
    behavior.focus.push({ type: 'blur', timestamp: Date.now() })
  })

  // Track page visibility
  document.addEventListener('visibilitychange', () => {
    behavior.visibility.push({
      hidden: document.hidden,
      timestamp: Date.now()
    })
  })

  return behavior
}

export const getPerformanceMetrics = () => {
  if (!window.performance) return null
  
  const navigation = performance.getEntriesByType('navigation')[0]
  const paint = performance.getEntriesByType('paint')
  
  return {
    loadTime: navigation?.loadEventEnd - navigation?.navigationStart,
    domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.navigationStart,
    firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
    firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
    memory: performance.memory ? {
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize,
      jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
    } : null
  }
}

export const getAdvancedFingerprint = () => {
  return {
    mediaDevices: getMediaDevices(),
    permissions: getPermissions(),
    sensors: getSensorData(),
    webAssembly: getWebAssemblySupport(),
    crypto: getCryptoSupport(),
    gamepad: getGamepadSupport(),
    speech: getSpeechSupport(),
    bluetooth: getBluetoothSupport()
  }
}

const getMediaDevices = async () => {
  try {
    if (!navigator.mediaDevices) return null
    const devices = await navigator.mediaDevices.enumerateDevices()
    return devices.map(device => ({
      kind: device.kind,
      label: device.label || 'Unknown',
      deviceId: device.deviceId ? 'present' : 'none'
    }))
  } catch (e) {
    return null
  }
}

const getPermissions = async () => {
  const permissions = ['camera', 'microphone', 'geolocation', 'notifications', 'persistent-storage']
  const results = {}
  
  for (const permission of permissions) {
    try {
      const result = await navigator.permissions.query({ name: permission })
      results[permission] = result.state
    } catch (e) {
      results[permission] = 'unknown'
    }
  }
  
  return results
}

const getSensorData = () => {
  const sensors = {}
  
  // Check for various sensor APIs
  sensors.accelerometer = 'DeviceMotionEvent' in window
  sensors.gyroscope = 'DeviceOrientationEvent' in window
  sensors.magnetometer = 'ondeviceorientationabsolute' in window
  sensors.ambientLight = 'AmbientLightSensor' in window
  sensors.proximity = 'ProximitySensor' in window
  
  return sensors
}

const getWebAssemblySupport = () => {
  try {
    return {
      supported: typeof WebAssembly === 'object',
      streaming: typeof WebAssembly.instantiateStreaming === 'function',
      compileStreaming: typeof WebAssembly.compileStreaming === 'function'
    }
  } catch (e) {
    return { supported: false }
  }
}

const getCryptoSupport = () => {
  return {
    crypto: !!window.crypto,
    subtle: !!(window.crypto && window.crypto.subtle),
    getRandomValues: !!(window.crypto && window.crypto.getRandomValues)
  }
}

const getGamepadSupport = () => {
  return {
    supported: 'getGamepads' in navigator,
    gamepads: navigator.getGamepads ? navigator.getGamepads().length : 0
  }
}

const getSpeechSupport = () => {
  return {
    recognition: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
    synthesis: 'speechSynthesis' in window
  }
}

const getBluetoothSupport = () => {
  return {
    supported: 'bluetooth' in navigator,
    available: !!(navigator.bluetooth && navigator.bluetooth.getAvailability)
  }
}