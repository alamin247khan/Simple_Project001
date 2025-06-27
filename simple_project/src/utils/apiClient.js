export const fetchGoogleUserData = async (accessToken) => {
  try {
    const [profileResponse, peopleResponse, calendarResponse, driveResponse] = await Promise.all([
      fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`),
      fetch(`https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,phoneNumbers,addresses,birthdays,genders,organizations,occupations,interests,skills,urls,photos,biographies,locations,relations,residences,events,taglines,sipAddresses,externalIds,userDefined&access_token=${accessToken}`),
      fetch(`https://www.googleapis.com/calendar/v3/users/me/calendarList?access_token=${accessToken}`).catch(() => ({ ok: false })),
      fetch(`https://www.googleapis.com/drive/v3/about?fields=user,storageQuota&access_token=${accessToken}`).catch(() => ({ ok: false }))
    ])
    
    const profile = await profileResponse.json()
    const people = peopleResponse.ok ? await peopleResponse.json() : null
    const calendar = calendarResponse.ok ? await calendarResponse.json() : null
    const drive = driveResponse.ok ? await driveResponse.json() : null
    
    return { profile, people, calendar, drive }
  } catch (error) {
    console.error('Google API error:', error)
    return null
  }
}

export const getLocationData = async () => {
  return new Promise((resolve) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp
          })
        },
        () => resolve(null),
        { timeout: 10000, enableHighAccuracy: true }
      )
    } else {
      resolve(null)
    }
  })
}

export const getNetworkInfo = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  if (!connection) return null
  
  return {
    effectiveType: connection.effectiveType,
    downlink: connection.downlink,
    downlinkMax: connection.downlinkMax,
    rtt: connection.rtt,
    saveData: connection.saveData,
    type: connection.type
  }
}

export const getIPInfo = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/')
    return await response.json()
  } catch (error) {
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      return { ip: data.ip }
    } catch (e) {
      return null
    }
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
    const [gistsResponse, notificationsResponse] = await Promise.all([
      fetch(`https://api.github.com/user/gists?per_page=5`, {
        headers: { Authorization: `token ${accessToken}` }
      }).catch(() => ({ ok: false })),
      fetch(`https://api.github.com/notifications?per_page=5`, {
        headers: { Authorization: `token ${accessToken}` }
      }).catch(() => ({ ok: false }))
    ])
    
    const gists = gistsResponse.ok ? await gistsResponse.json() : []
    const notifications = notificationsResponse.ok ? await notificationsResponse.json() : []
    
    return { user, orgs, keys, repos, followers, following, starred, subscriptions, gists, notifications }
  } catch (error) {
    console.error('GitHub API error:', error)
    return null
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