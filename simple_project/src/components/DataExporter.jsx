import { useState } from 'react'
import './DataExporter.css'

export default function DataExporter({ userData, deviceInfo, locationData, networkInfo, ipInfo, behaviorData }) {
  const [exportFormat, setExportFormat] = useState('json')
  const [includeRaw, setIncludeRaw] = useState(true)

  const exportData = () => {
    const data = {
      timestamp: new Date().toISOString(),
      user: userData,
      device: deviceInfo,
      location: locationData,
      network: networkInfo,
      ip: ipInfo,
      behavior: behaviorData,
      metadata: {
        exportFormat,
        includeRaw,
        version: '1.0.0'
      }
    }

    if (exportFormat === 'json') {
      downloadJSON(data)
    } else if (exportFormat === 'csv') {
      downloadCSV(data)
    } else if (exportFormat === 'xml') {
      downloadXML(data)
    }
  }

  const downloadJSON = (data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    downloadFile(blob, 'user-data.json')
  }

  const downloadCSV = (data) => {
    const flatData = flattenObject(data)
    const csv = Object.entries(flatData).map(([key, value]) => `${key},${value}`).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    downloadFile(blob, 'user-data.csv')
  }

  const downloadXML = (data) => {
    const xml = objectToXML(data, 'userData')
    const blob = new Blob([xml], { type: 'application/xml' })
    downloadFile(blob, 'user-data.xml')
  }

  const downloadFile = (blob, filename) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const flattenObject = (obj, prefix = '') => {
    const flattened = {}
    for (const key in obj) {
      if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        Object.assign(flattened, flattenObject(obj[key], `${prefix}${key}.`))
      } else {
        flattened[`${prefix}${key}`] = Array.isArray(obj[key]) ? JSON.stringify(obj[key]) : obj[key]
      }
    }
    return flattened
  }

  const objectToXML = (obj, rootName) => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n`
    
    const convertToXML = (obj, indent = '  ') => {
      let result = ''
      for (const key in obj) {
        if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
          result += `${indent}<${key}>\n${convertToXML(obj[key], indent + '  ')}${indent}</${key}>\n`
        } else {
          const value = Array.isArray(obj[key]) ? JSON.stringify(obj[key]) : obj[key]
          result += `${indent}<${key}>${value}</${key}>\n`
        }
      }
      return result
    }
    
    xml += convertToXML(obj)
    xml += `</${rootName}>`
    return xml
  }

  const copyToClipboard = () => {
    const data = {
      user: userData,
      device: deviceInfo,
      location: locationData,
      network: networkInfo,
      ip: ipInfo,
      behavior: behaviorData
    }
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
  }

  return (
    <div className="data-exporter">
      <h3>Export Data</h3>
      <div className="export-options">
        <div className="format-selector">
          <label>Format:</label>
          <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)}>
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
            <option value="xml">XML</option>
          </select>
        </div>
        
        <div className="options">
          <label>
            <input
              type="checkbox"
              checked={includeRaw}
              onChange={(e) => setIncludeRaw(e.target.checked)}
            />
            Include raw data
          </label>
        </div>
      </div>
      
      <div className="export-actions">
        <button onClick={exportData} className="export-btn">
          📥 Download Data
        </button>
        <button onClick={copyToClipboard} className="copy-btn">
          📋 Copy to Clipboard
        </button>
      </div>
    </div>
  )
}