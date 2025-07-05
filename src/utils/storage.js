const cache = new Map()

export const storage = {
  set: (key, value) => {
    try {
      const serialized = JSON.stringify(value)
      localStorage.setItem(key, serialized)
      cache.set(key, value)
    } catch (error) {
      console.error('Storage set error:', error)
    }
  },
  
  get: (key) => {
    try {
      if (cache.has(key)) {
        return cache.get(key)
      }
      const item = localStorage.getItem(key)
      const parsed = item ? JSON.parse(item) : null
      if (parsed) cache.set(key, parsed)
      return parsed
    } catch (error) {
      console.error('Storage get error:', error)
      return null
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key)
      cache.delete(key)
    } catch (error) {
      console.error('Storage remove error:', error)
    }
  },
  
  clear: () => {
    try {
      localStorage.clear()
      cache.clear()
    } catch (error) {
      console.error('Storage clear error:', error)
    }
  }
}