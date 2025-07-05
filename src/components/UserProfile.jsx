import { useState, useEffect, useMemo, useCallback } from 'react'
import DataExporter from './DataExporter'
import './UserProfile.css'

export default function UserProfile({ user, userInfo, providerData, extendedData, deviceInfo, systemInfo, browserData, locationData, networkInfo, ipInfo, behaviorData, advancedFingerprint, userBehavior, socialData, realtimeData, advancedTracking, onSignOut }) {
  const [showRawData, setShowRawData] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  
  const totalDataPoints = useMemo(() => {
    return Object.keys({...user, ...userInfo, ...providerData, ...extendedData, ...deviceInfo, ...systemInfo, ...browserData, ...locationData, ...networkInfo, ...ipInfo, ...behaviorData, ...userBehavior, ...socialData, ...advancedTracking}).length
  }, [user, userInfo, providerData, extendedData, deviceInfo, systemInfo, browserData, locationData, networkInfo, ipInfo, behaviorData, userBehavior, socialData, advancedTracking])
  
  const formatDate = useCallback((timestamp) => {
    return new Date(timestamp).toLocaleString()
  }, [])
  
  const copyToClipboard = useCallback((text) => {
    navigator.clipboard.writeText(text)
  }, [])

  return (
    <div className="user-profile">
      <div className="profile-header">
        <img src={user.photoURL} alt="Profile" className="profile-image" />
        <h2>Welcome, {user.displayName || 'User'}!</h2>
        <div className="profile-actions">
          <button 
            onClick={() => setShowRawData(!showRawData)}
            className="toggle-btn"
          >
            {showRawData ? 'Hide' : 'Show'} Raw Data
          </button>
        </div>
      </div>
      
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'basic' ? 'active' : ''}`}
          onClick={() => setActiveTab('basic')}
        >
          Basic Info
        </button>
        <button 
          className={`tab-btn ${activeTab === 'provider' ? 'active' : ''}`}
          onClick={() => setActiveTab('provider')}
        >
          Provider Data
        </button>
        <button 
          className={`tab-btn ${activeTab === 'extended' ? 'active' : ''}`}
          onClick={() => setActiveTab('extended')}
        >
          Extended Data
        </button>
        <button 
          className={`tab-btn ${activeTab === 'technical' ? 'active' : ''}`}
          onClick={() => setActiveTab('technical')}
        >
          Technical
        </button>
        <button 
          className={`tab-btn ${activeTab === 'device' ? 'active' : ''}`}
          onClick={() => setActiveTab('device')}
        >
          Device Info
        </button>
        <button 
          className={`tab-btn ${activeTab === 'location' ? 'active' : ''}`}
          onClick={() => setActiveTab('location')}
        >
          Location & Network
        </button>
        <button 
          className={`tab-btn ${activeTab === 'behavior' ? 'active' : ''}`}
          onClick={() => setActiveTab('behavior')}
        >
          Behavior
        </button>
        <button 
          className={`tab-btn ${activeTab === 'export' ? 'active' : ''}`}
          onClick={() => setActiveTab('export')}
        >
          Export Data
        </button>
        <button 
          className={`tab-btn ${activeTab === 'realtime' ? 'active' : ''}`}
          onClick={() => setActiveTab('realtime')}
        >
          Real-time
        </button>
        <button 
          className={`tab-btn ${activeTab === 'system' ? 'active' : ''}`}
          onClick={() => setActiveTab('system')}
        >
          System
        </button>
        <button 
          className={`tab-btn ${activeTab === 'browser' ? 'active' : ''}`}
          onClick={() => setActiveTab('browser')}
        >
          Browser
        </button>
        <button 
          className={`tab-btn ${activeTab === 'social' ? 'active' : ''}`}
          onClick={() => setActiveTab('social')}
        >
          Social
        </button>
        <button 
          className={`tab-btn ${activeTab === 'patterns' ? 'active' : ''}`}
          onClick={() => setActiveTab('patterns')}
        >
          Patterns
        </button>
        <button 
          className={`tab-btn ${activeTab === 'advanced' ? 'active' : ''}`}
          onClick={() => setActiveTab('advanced')}
        >
          Advanced
        </button>
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button 
          className={`tab-btn ${activeTab === 'financial' ? 'active' : ''}`}
          onClick={() => setActiveTab('financial')}
        >
          Financial
        </button>
        <button 
          className={`tab-btn ${activeTab === 'health' ? 'active' : ''}`}
          onClick={() => setActiveTab('health')}
        >
          Health
        </button>
        <button 
          className={`tab-btn ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          Insights
        </button>
        <button 
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Data
        </button>
      </div>

      <div className="info-grid">
        {activeTab === 'basic' && (
          <>
            <div className="info-card">
              <h3>Personal Information</h3>
              <div className="info-item">
                <span className="label">Display Name:</span>
                <span className="value">{user.displayName || 'Not provided'}</span>
              </div>
              <div className="info-item">
                <span className="label">Email:</span>
                <span className="value">{user.email}</span>
              </div>
              <div className="info-item">
                <span className="label">Phone:</span>
                <span className="value">{user.phoneNumber || 'Not provided'}</span>
              </div>
              <div className="info-item">
                <span className="label">Email Verified:</span>
                <span className={`status ${user.emailVerified ? 'verified' : 'unverified'}`}>
                  {user.emailVerified ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            <div className="info-card">
              <h3>Account Status</h3>
              <div className="info-item">
                <span className="label">Account Type:</span>
                <span className="value">{userInfo?.isNewUser ? 'New User' : 'Returning User'}</span>
              </div>
              <div className="info-item">
                <span className="label">Multi-Factor:</span>
                <span className="value">{user.multiFactor?.enrolledFactors?.length > 0 ? 'Enabled' : 'Disabled'}</span>
              </div>
              <div className="info-item">
                <span className="label">Anonymous:</span>
                <span className="value">{user.isAnonymous ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </>
        )}

        {activeTab === 'provider' && (
          <>
            <div className="info-card">
              <h3>Provider Information</h3>
              {user.providerData.map((provider, index) => (
                <div key={index} className="provider-section">
                  <div className="info-item">
                    <span className="label">Provider:</span>
                    <span className="value">{provider.providerId}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Provider UID:</span>
                    <span className="value uid">{provider.uid}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Provider Email:</span>
                    <span className="value">{provider.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Provider Name:</span>
                    <span className="value">{provider.displayName || 'Not provided'}</span>
                  </div>
                </div>
              ))}
            </div>

            {providerData?.profile && (
              <div className="info-card">
                <h3>Basic Provider Data</h3>
                <div className="info-item">
                  <span className="label">Username:</span>
                  <span className="value">{providerData.username || userInfo?.username || 'Not provided'}</span>
                </div>
                {providerData.profile.location && (
                  <div className="info-item">
                    <span className="label">Location:</span>
                    <span className="value">{providerData.profile.location}</span>
                  </div>
                )}
                {providerData.profile.company && (
                  <div className="info-item">
                    <span className="label">Company:</span>
                    <span className="value">{providerData.profile.company}</span>
                  </div>
                )}
                {providerData.profile.blog && (
                  <div className="info-item">
                    <span className="label">Website:</span>
                    <span className="value">
                      <a href={providerData.profile.blog} target="_blank" rel="noopener noreferrer">
                        {providerData.profile.blog}
                      </a>
                    </span>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {activeTab === 'extended' && extendedData && (
          <>
            {extendedData.people && (
              <div className="info-card">
                <h3>Google People API Data</h3>
                {extendedData.people.birthdays?.[0] && (
                  <div className="info-item">
                    <span className="label">Birthday:</span>
                    <span className="value">
                      {extendedData.people.birthdays[0].date ? 
                        `${extendedData.people.birthdays[0].date.month}/${extendedData.people.birthdays[0].date.day}/${extendedData.people.birthdays[0].date.year}` : 
                        'Partial data available'
                      }
                    </span>
                  </div>
                )}
                {extendedData.people.genders?.[0] && (
                  <div className="info-item">
                    <span className="label">Gender:</span>
                    <span className="value">{extendedData.people.genders[0].value}</span>
                  </div>
                )}
                {extendedData.people.phoneNumbers?.[0] && (
                  <div className="info-item">
                    <span className="label">Phone:</span>
                    <span className="value">{extendedData.people.phoneNumbers[0].value}</span>
                  </div>
                )}
                {extendedData.people.addresses?.[0] && (
                  <div className="info-item">
                    <span className="label">Address:</span>
                    <span className="value">{extendedData.people.addresses[0].formattedValue}</span>
                  </div>
                )}
                {extendedData.people.organizations?.[0] && (
                  <div className="info-item">
                    <span className="label">Organization:</span>
                    <span className="value">{extendedData.people.organizations[0].name}</span>
                  </div>
                )}
              </div>
            )}
            
            {extendedData.user && (
              <div className="info-card">
                <h3>GitHub Extended Data</h3>
                <div className="info-item">
                  <span className="label">GitHub ID:</span>
                  <span className="value">{extendedData.user.id}</span>
                </div>
                <div className="info-item">
                  <span className="label">Node ID:</span>
                  <span className="value">{extendedData.user.node_id}</span>
                </div>
                <div className="info-item">
                  <span className="label">Account Type:</span>
                  <span className="value">{extendedData.user.type}</span>
                </div>
                <div className="info-item">
                  <span className="label">Site Admin:</span>
                  <span className="value">{extendedData.user.site_admin ? 'Yes' : 'No'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Hireable:</span>
                  <span className="value">{extendedData.user.hireable ? 'Yes' : 'No'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Public Gists:</span>
                  <span className="value">{extendedData.user.public_gists}</span>
                </div>
                <div className="info-item">
                  <span className="label">Disk Usage:</span>
                  <span className="value">{extendedData.user.disk_usage} KB</span>
                </div>
                <div className="info-item">
                  <span className="label">Private Repos:</span>
                  <span className="value">{extendedData.user.total_private_repos}</span>
                </div>
                {extendedData.user.twitter_username && (
                  <div className="info-item">
                    <span className="label">Twitter:</span>
                    <span className="value">@{extendedData.user.twitter_username}</span>
                  </div>
                )}
                <div className="info-item">
                  <span className="label">Plan:</span>
                  <span className="value">{extendedData.user.plan?.name || 'Free'}</span>
                </div>
              </div>
            )}
            
            {extendedData.repos && extendedData.repos.length > 0 && (
              <div className="info-card">
                <h3>Recent Repositories</h3>
                {extendedData.repos.slice(0, 3).map((repo, index) => (
                  <div key={index} className="info-item">
                    <span className="label">{repo.name}:</span>
                    <span className="value">{repo.language || 'No language'}</span>
                  </div>
                ))}
              </div>
            )}
            
            {extendedData.calendar && (
              <div className="info-card">
                <h3>Google Calendar</h3>
                <div className="info-item">
                  <span className="label">Calendars:</span>
                  <span className="value">{extendedData.calendar.items?.length || 0}</span>
                </div>
              </div>
            )}
            
            {extendedData.drive && (
              <div className="info-card">
                <h3>Google Drive</h3>
                <div className="info-item">
                  <span className="label">Storage Used:</span>
                  <span className="value">{Math.round(extendedData.drive.storageQuota?.usage / 1024 / 1024)} MB</span>
                </div>
                <div className="info-item">
                  <span className="label">Storage Limit:</span>
                  <span className="value">{Math.round(extendedData.drive.storageQuota?.limit / 1024 / 1024 / 1024)} GB</span>
                </div>
              </div>
            )}
            
            {extendedData.gmail && (
              <div className="info-card">
                <h3>Gmail Data</h3>
                <div className="info-item">
                  <span className="label">Email Address:</span>
                  <span className="value">{extendedData.gmail.emailAddress}</span>
                </div>
                <div className="info-item">
                  <span className="label">Messages Total:</span>
                  <span className="value">{extendedData.gmail.messagesTotal}</span>
                </div>
                <div className="info-item">
                  <span className="label">Threads Total:</span>
                  <span className="value">{extendedData.gmail.threadsTotal}</span>
                </div>
              </div>
            )}
            
            {extendedData.youtube && extendedData.youtube.items?.length > 0 && (
              <div className="info-card">
                <h3>YouTube Channel</h3>
                <div className="info-item">
                  <span className="label">Channel Title:</span>
                  <span className="value">{extendedData.youtube.items[0].snippet.title}</span>
                </div>
                <div className="info-item">
                  <span className="label">Subscribers:</span>
                  <span className="value">{extendedData.youtube.items[0].statistics.subscriberCount}</span>
                </div>
                <div className="info-item">
                  <span className="label">Videos:</span>
                  <span className="value">{extendedData.youtube.items[0].statistics.videoCount}</span>
                </div>
                <div className="info-item">
                  <span className="label">Views:</span>
                  <span className="value">{extendedData.youtube.items[0].statistics.viewCount}</span>
                </div>
              </div>
            )}
            
            {extendedData.orgs && extendedData.orgs.length > 0 && (
              <div className="info-card">
                <h3>GitHub Organizations</h3>
                {extendedData.orgs.slice(0, 5).map((org, index) => (
                  <div key={index} className="info-item">
                    <span className="label">{org.login}:</span>
                    <span className="value">{org.description || 'No description'}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'device' && (
          <>
            <div className="info-card">
              <h3>Browser Fingerprint</h3>
              <div className="info-item">
                <span className="label">Platform:</span>
                <span className="value">{deviceInfo.platform}</span>
              </div>
              <div className="info-item">
                <span className="label">Language:</span>
                <span className="value">{deviceInfo.language}</span>
              </div>
              <div className="info-item">
                <span className="label">Timezone:</span>
                <span className="value">{deviceInfo.timezone}</span>
              </div>
              <div className="info-item">
                <span className="label">Canvas:</span>
                <span className="value">{deviceInfo.canvas}</span>
              </div>
              <div className="info-item">
                <span className="label">WebGL Vendor:</span>
                <span className="value">{deviceInfo.webgl?.vendor || 'Not available'}</span>
              </div>
              <div className="info-item">
                <span className="label">Audio Context:</span>
                <span className="value">{deviceInfo.audio?.sampleRate || 'Not available'} Hz</span>
              </div>
            </div>
            
            <div className="info-card">
              <h3>Hardware & Capabilities</h3>
              <div className="info-item">
                <span className="label">CPU Cores:</span>
                <span className="value">{deviceInfo.hardwareConcurrency}</span>
              </div>
              <div className="info-item">
                <span className="label">Device Memory:</span>
                <span className="value">{deviceInfo.deviceMemory || 'Unknown'} GB</span>
              </div>
              <div className="info-item">
                <span className="label">Touch Points:</span>
                <span className="value">{deviceInfo.maxTouchPoints}</span>
              </div>
              <div className="info-item">
                <span className="label">Screen:</span>
                <span className="value">{deviceInfo.screen.width}x{deviceInfo.screen.height} ({deviceInfo.screen.colorDepth}bit)</span>
              </div>
              <div className="info-item">
                <span className="label">Viewport:</span>
                <span className="value">{deviceInfo.viewport.width}x{deviceInfo.viewport.height}</span>
              </div>
              <div className="info-item">
                <span className="label">Pixel Ratio:</span>
                <span className="value">{deviceInfo.viewport.devicePixelRatio}</span>
              </div>
            </div>
            
            <div className="info-card">
              <h3>Browser Features</h3>
              <div className="info-item">
                <span className="label">Local Storage:</span>
                <span className="value">{deviceInfo.localStorage ? 'Available' : 'Blocked'}</span>
              </div>
              <div className="info-item">
                <span className="label">Session Storage:</span>
                <span className="value">{deviceInfo.sessionStorage ? 'Available' : 'Blocked'}</span>
              </div>
              <div className="info-item">
                <span className="label">IndexedDB:</span>
                <span className="value">{deviceInfo.indexedDB ? 'Available' : 'Not available'}</span>
              </div>
              <div className="info-item">
                <span className="label">WebRTC:</span>
                <span className="value">{deviceInfo.webRTC ? 'Available' : 'Not available'}</span>
              </div>
              <div className="info-item">
                <span className="label">Fonts Detected:</span>
                <span className="value">{deviceInfo.fonts?.length || 0}</span>
              </div>
              <div className="info-item">
                <span className="label">Plugins:</span>
                <span className="value">{deviceInfo.plugins?.length || 0}</span>
              </div>
            </div>
          </>
        )}

        {activeTab === 'location' && (
          <>
            {locationData && (
              <div className="info-card">
                <h3>Location Data</h3>
                <div className="info-item">
                  <span className="label">Latitude:</span>
                  <span className="value">{locationData.latitude.toFixed(6)}</span>
                </div>
                <div className="info-item">
                  <span className="label">Longitude:</span>
                  <span className="value">{locationData.longitude.toFixed(6)}</span>
                </div>
                <div className="info-item">
                  <span className="label">Accuracy:</span>
                  <span className="value">{locationData.accuracy} meters</span>
                </div>
                {locationData.altitude && (
                  <div className="info-item">
                    <span className="label">Altitude:</span>
                    <span className="value">{locationData.altitude} meters</span>
                  </div>
                )}
              </div>
            )}
            
            {ipInfo && (
              <div className="info-card">
                <h3>IP & Location Info</h3>
                <div className="info-item">
                  <span className="label">IP Address:</span>
                  <span className="value">{ipInfo.ip}</span>
                </div>
                {ipInfo.city && (
                  <div className="info-item">
                    <span className="label">City:</span>
                    <span className="value">{ipInfo.city}</span>
                  </div>
                )}
                {ipInfo.region && (
                  <div className="info-item">
                    <span className="label">Region:</span>
                    <span className="value">{ipInfo.region}</span>
                  </div>
                )}
                {ipInfo.country_name && (
                  <div className="info-item">
                    <span className="label">Country:</span>
                    <span className="value">{ipInfo.country_name}</span>
                  </div>
                )}
                {ipInfo.org && (
                  <div className="info-item">
                    <span className="label">ISP:</span>
                    <span className="value">{ipInfo.org}</span>
                  </div>
                )}
              </div>
            )}
            
            {networkInfo && (
              <div className="info-card">
                <h3>Network Information</h3>
                <div className="info-item">
                  <span className="label">Connection Type:</span>
                  <span className="value">{networkInfo.effectiveType}</span>
                </div>
                <div className="info-item">
                  <span className="label">Downlink:</span>
                  <span className="value">{networkInfo.downlink} Mbps</span>
                </div>
                <div className="info-item">
                  <span className="label">RTT:</span>
                  <span className="value">{networkInfo.rtt} ms</span>
                </div>
                <div className="info-item">
                  <span className="label">Data Saver:</span>
                  <span className="value">{networkInfo.saveData ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>
            )}
            
            {deviceInfo.battery && (
              <div className="info-card">
                <h3>Battery Information</h3>
                <div className="info-item">
                  <span className="label">Charging:</span>
                  <span className="value">{deviceInfo.battery.charging ? 'Yes' : 'No'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Level:</span>
                  <span className="value">{Math.round(deviceInfo.battery.level * 100)}%</span>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'behavior' && behaviorData && (
          <>
            <div className="info-card">
              <h3>User Behavior</h3>
              <div className="info-item">
                <span className="label">Mouse Movements:</span>
                <span className="value">{behaviorData.mouseMovements?.length || 0}</span>
              </div>
              <div className="info-item">
                <span className="label">Clicks:</span>
                <span className="value">{behaviorData.clicks?.length || 0}</span>
              </div>
              <div className="info-item">
                <span className="label">Keystrokes:</span>
                <span className="value">{behaviorData.keystrokes?.length || 0}</span>
              </div>
              <div className="info-item">
                <span className="label">Scroll Events:</span>
                <span className="value">{behaviorData.scrolls?.length || 0}</span>
              </div>
            </div>
            
            {behaviorData.performance && (
              <div className="info-card">
                <h3>Performance Metrics</h3>
                <div className="info-item">
                  <span className="label">Load Time:</span>
                  <span className="value">{Math.round(behaviorData.performance.loadTime || 0)} ms</span>
                </div>
                <div className="info-item">
                  <span className="label">First Paint:</span>
                  <span className="value">{Math.round(behaviorData.performance.firstPaint || 0)} ms</span>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'export' && (
          <DataExporter 
            userData={user}
            deviceInfo={deviceInfo}
            locationData={locationData}
            networkInfo={networkInfo}
            ipInfo={ipInfo}
            behaviorData={behaviorData}
          />
        )}

        {activeTab === 'system' && systemInfo && (
          <>
            <div className="info-card">
              <h3>Page Information</h3>
              <div className="info-item">
                <span className="label">URL:</span>
                <span className="value">{systemInfo.url}</span>
              </div>
              <div className="info-item">
                <span className="label">Domain:</span>
                <span className="value">{systemInfo.domain}</span>
              </div>
              <div className="info-item">
                <span className="label">Protocol:</span>
                <span className="value">{systemInfo.protocol}</span>
              </div>
              <div className="info-item">
                <span className="label">Referrer:</span>
                <span className="value">{systemInfo.referrer || 'Direct'}</span>
              </div>
              <div className="info-item">
                <span className="label">Title:</span>
                <span className="value">{systemInfo.title}</span>
              </div>
            </div>
            
            <div className="info-card">
              <h3>Document State</h3>
              <div className="info-item">
                <span className="label">Ready State:</span>
                <span className="value">{systemInfo.readyState}</span>
              </div>
              <div className="info-item">
                <span className="label">Visibility:</span>
                <span className="value">{systemInfo.visibilityState}</span>
              </div>
              <div className="info-item">
                <span className="label">Hidden:</span>
                <span className="value">{systemInfo.hidden ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </>
        )}

        {activeTab === 'browser' && browserData && (
          <>
            <div className="info-card">
              <h3>Browser Capabilities</h3>
              <div className="info-item">
                <span className="label">WebDriver:</span>
                <span className="value">{browserData.webdriver ? 'Yes' : 'No'}</span>
              </div>
              <div className="info-item">
                <span className="label">Service Worker:</span>
                <span className="value">{browserData.serviceWorker ? 'Supported' : 'Not supported'}</span>
              </div>
              <div className="info-item">
                <span className="label">Web Share:</span>
                <span className="value">{browserData.share ? 'Supported' : 'Not supported'}</span>
              </div>
              <div className="info-item">
                <span className="label">Clipboard API:</span>
                <span className="value">{browserData.clipboard ? 'Supported' : 'Not supported'}</span>
              </div>
              <div className="info-item">
                <span className="label">USB API:</span>
                <span className="value">{browserData.usb ? 'Supported' : 'Not supported'}</span>
              </div>
              <div className="info-item">
                <span className="label">Bluetooth API:</span>
                <span className="value">{browserData.bluetooth ? 'Supported' : 'Not supported'}</span>
              </div>
            </div>
          </>
        )}

        {activeTab === 'realtime' && realtimeData && (
          <>
            <div className="info-card">
              <h3>Live Performance 📊</h3>
              {realtimeData.performance?.length > 0 && (
                <>
                  <div className="info-item">
                    <span className="label">Memory Usage:</span>
                    <span className="value">
                      {Math.round((realtimeData.performance[realtimeData.performance.length - 1].memory?.used || 0) / 1024 / 1024)} MB
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Performance Now:</span>
                    <span className="value">
                      {Math.round(realtimeData.performance[realtimeData.performance.length - 1].timing || 0)} ms
                    </span>
                  </div>
                </>
              )}
            </div>
            
            {realtimeData.network?.length > 0 && (
              <div className="info-card">
                <h3>Live Network 🌐</h3>
                <div className="info-item">
                  <span className="label">Connection:</span>
                  <span className="value">{realtimeData.network[realtimeData.network.length - 1].effectiveType}</span>
                </div>
                <div className="info-item">
                  <span className="label">Downlink:</span>
                  <span className="value">{realtimeData.network[realtimeData.network.length - 1].downlink} Mbps</span>
                </div>
                <div className="info-item">
                  <span className="label">RTT:</span>
                  <span className="value">{realtimeData.network[realtimeData.network.length - 1].rtt} ms</span>
                </div>
              </div>
            )}
            
            {realtimeData.battery?.length > 0 && (
              <div className="info-card">
                <h3>Live Battery 🔋</h3>
                <div className="info-item">
                  <span className="label">Level:</span>
                  <span className="value">{Math.round(realtimeData.battery[realtimeData.battery.length - 1].level * 100)}%</span>
                </div>
                <div className="info-item">
                  <span className="label">Charging:</span>
                  <span className="value">{realtimeData.battery[realtimeData.battery.length - 1].charging ? 'Yes' : 'No'}</span>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'social' && socialData && (
          <>
            <div className="info-card">
              <h3>Social Media Detection</h3>
              <div className="info-item">
                <span className="label">Installed Apps:</span>
                <span className="value">{socialData.installedApps?.join(', ') || 'None detected'}</span>
              </div>
              <div className="info-item">
                <span className="label">Facebook Widget:</span>
                <span className="value">{socialData.socialWidgets?.facebook ? 'Detected' : 'Not found'}</span>
              </div>
              <div className="info-item">
                <span className="label">Twitter Widget:</span>
                <span className="value">{socialData.socialWidgets?.twitter ? 'Detected' : 'Not found'}</span>
              </div>
              <div className="info-item">
                <span className="label">Google Widget:</span>
                <span className="value">{socialData.socialWidgets?.google ? 'Detected' : 'Not found'}</span>
              </div>
              <div className="info-item">
                <span className="label">LinkedIn Widget:</span>
                <span className="value">{socialData.socialWidgets?.linkedin ? 'Detected' : 'Not found'}</span>
              </div>
            </div>
          </>
        )}

        {activeTab === 'patterns' && userBehavior && (
          <>
            <div className="info-card">
              <h3>User Behavior Patterns</h3>
              <div className="info-item">
                <span className="label">Mouse Movements:</span>
                <span className="value">{userBehavior.mousePattern?.movements || 0}</span>
              </div>
              <div className="info-item">
                <span className="label">Average Mouse Speed:</span>
                <span className="value">{Math.round(userBehavior.mousePattern?.avgSpeed || 0)} px/ms</span>
              </div>
              <div className="info-item">
                <span className="label">Keystrokes:</span>
                <span className="value">{userBehavior.keyboardPattern?.keystrokes || 0}</span>
              </div>
              <div className="info-item">
                <span className="label">Avg Keystroke Interval:</span>
                <span className="value">{Math.round(userBehavior.keyboardPattern?.avgInterval || 0)} ms</span>
              </div>
              <div className="info-item">
                <span className="label">Scroll Events:</span>
                <span className="value">{userBehavior.scrollBehavior?.scrolls || 0}</span>
              </div>
              <div className="info-item">
                <span className="label">Click Events:</span>
                <span className="value">{userBehavior.clickPattern?.clicks || 0}</span>
              </div>
            </div>
            
            {userBehavior.biometrics && (
              <div className="info-card">
                <h3>Biometric Data</h3>
                <div className="info-item">
                  <span className="label">Face Data:</span>
                  <span className="value">{userBehavior.biometrics.faceData ? 'Captured' : 'Not available'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Touch Pressure:</span>
                  <span className="value">{userBehavior.biometrics.touchPressure?.length || 0} samples</span>
                </div>
              </div>
            )}
            
            {userBehavior.hardwareFingerprint && (
              <div className="info-card">
                <h3>Hardware Performance</h3>
                <div className="info-item">
                  <span className="label">CPU Benchmark:</span>
                  <span className="value">{Math.round(userBehavior.hardwareFingerprint.cpuBenchmark || 0)} ms</span>
                </div>
                <div className="info-item">
                  <span className="label">GPU Benchmark:</span>
                  <span className="value">{Math.round(userBehavior.hardwareFingerprint.gpuBenchmark || 0)} ms</span>
                </div>
                <div className="info-item">
                  <span className="label">Memory Benchmark:</span>
                  <span className="value">{Math.round(userBehavior.hardwareFingerprint.memoryBenchmark || 0)} ms</span>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'advanced' && advancedTracking && (
          <>
            <div className="info-card">
              <h3>Eye Tracking</h3>
              <div className="info-item">
                <span className="label">Gaze Points:</span>
                <span className="value">{advancedTracking.eyeTracking?.gazePoints?.length || 0}</span>
              </div>
              <div className="info-item">
                <span className="label">Fixations:</span>
                <span className="value">{advancedTracking.eyeTracking?.fixations?.length || 0}</span>
              </div>
            </div>
            
            <div className="info-card">
              <h3>Keystroke Dynamics</h3>
              <div className="info-item">
                <span className="label">Dwell Times:</span>
                <span className="value">{advancedTracking.keystrokeDynamics?.dwellTimes?.length || 0}</span>
              </div>
              <div className="info-item">
                <span className="label">Flight Times:</span>
                <span className="value">{advancedTracking.keystrokeDynamics?.flightTimes?.length || 0}</span>
              </div>
            </div>
            
            <div className="info-card">
              <h3>Mouse Gestures</h3>
              <div className="info-item">
                <span className="label">Velocity Samples:</span>
                <span className="value">{advancedTracking.mouseGestures?.velocity?.length || 0}</span>
              </div>
              <div className="info-item">
                <span className="label">Acceleration Samples:</span>
                <span className="value">{advancedTracking.mouseGestures?.acceleration?.length || 0}</span>
              </div>
            </div>
            
            <div className="info-card">
              <h3>Device Sensors</h3>
              <div className="info-item">
                <span className="label">Orientation Data:</span>
                <span className="value">{advancedTracking.deviceOrientation?.orientations?.length || 0}</span>
              </div>
              <div className="info-item">
                <span className="label">Light Readings:</span>
                <span className="value">{advancedTracking.ambientLight?.readings?.length || 0}</span>
              </div>
              <div className="info-item">
                <span className="label">Proximity Data:</span>
                <span className="value">{advancedTracking.proximityData?.readings?.length || 0}</span>
              </div>
            </div>
          </>
        )}

        {activeTab === 'profile' && userBehavior?.personalAnalytics && (
          <>
            <div className="info-card">
              <h3>Personal Analytics</h3>
              <div className="info-item">
                <span className="label">Working Hours:</span>
                <span className="value">{userBehavior.personalAnalytics.workingHours?.isWorkingHours ? 'Yes' : 'No'}</span>
              </div>
              <div className="info-item">
                <span className="label">Sleep Pattern:</span>
                <span className="value">{userBehavior.personalAnalytics.sleepPattern?.estimatedSleepTime}</span>
              </div>
              <div className="info-item">
                <span className="label">Activity Level:</span>
                <span className="value">{userBehavior.personalAnalytics.activityLevel?.tabFocus ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="info-item">
                <span className="label">Interests:</span>
                <span className="value">{Object.entries(userBehavior.personalAnalytics.interests || {}).filter(([k,v]) => v).map(([k]) => k).join(', ') || 'None detected'}</span>
              </div>
            </div>
          </>
        )}

        {activeTab === 'financial' && userBehavior?.financialProfile && (
          <>
            <div className="info-card">
              <h3>Financial Profile</h3>
              <div className="info-item">
                <span className="label">Device Value:</span>
                <span className="value">{userBehavior.financialProfile.deviceValue?.estimate}</span>
              </div>
              <div className="info-item">
                <span className="label">Wealthy Region:</span>
                <span className="value">{userBehavior.financialProfile.locationWealth?.wealthyRegion ? 'Yes' : 'No'}</span>
              </div>
              <div className="info-item">
                <span className="label">Premium Browser:</span>
                <span className="value">{userBehavior.financialProfile.spendingIndicators?.premiumBrowser ? 'Yes' : 'No'}</span>
              </div>
              <div className="info-item">
                <span className="label">Investment Interest:</span>
                <span className="value">{userBehavior.financialProfile.investmentBehavior?.cryptoInterest || userBehavior.financialProfile.investmentBehavior?.stockMarket ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </>
        )}

        {activeTab === 'health' && userBehavior?.healthMetrics && (
          <>
            <div className="info-card">
              <h3>Health Metrics</h3>
              <div className="info-item">
                <span className="label">Age Estimate:</span>
                <span className="value">{userBehavior.healthMetrics.medicalIndicators?.ageEstimate}</span>
              </div>
              <div className="info-item">
                <span className="label">Fitness Interest:</span>
                <span className="value">{userBehavior.healthMetrics.fitnessLevel?.healthInterest ? 'Yes' : 'No'}</span>
              </div>
              <div className="info-item">
                <span className="label">Sleep Quality:</span>
                <span className="value">{userBehavior.healthMetrics.mentalHealth?.sleepQuality?.optimalSleepTime ? 'Good' : 'Poor'}</span>
              </div>
              <div className="info-item">
                <span className="label">Stress Level:</span>
                <span className="value">{userBehavior.healthMetrics.mentalHealth?.stressIndicators?.lateNightUsage ? 'High' : 'Normal'}</span>
              </div>
            </div>
            
            {userBehavior.psychologicalProfile && (
              <div className="info-card">
                <h3>Psychological Profile</h3>
                <div className="info-item">
                  <span className="label">Personality:</span>
                  <span className="value">{Object.entries(userBehavior.psychologicalProfile.personality || {}).filter(([k,v]) => v).map(([k]) => k).join(', ') || 'Unknown'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Risk Profile:</span>
                  <span className="value">{userBehavior.psychologicalProfile.riskProfile?.financialRisk ? 'High' : 'Low'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Emotional State:</span>
                  <span className="value">{userBehavior.psychologicalProfile.emotionalState?.positiveEmotions ? 'Positive' : 'Neutral'}</span>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'insights' && advancedTracking?.correlatedInsights && (
          <>
            <div className="info-card">
              <h3>Economic Profile</h3>
              <div className="info-item">
                <span className="label">Estimated Income:</span>
                <span className="value">{advancedTracking.correlatedInsights.economicProfile?.likelyIncome || 'Unknown'}</span>
              </div>
              <div className="info-item">
                <span className="label">Working Professional:</span>
                <span className="value">{advancedTracking.correlatedInsights.economicProfile?.workingProfessional ? 'Yes' : 'No'}</span>
              </div>
              <div className="info-item">
                <span className="label">Location Advantage:</span>
                <span className="value">{advancedTracking.correlatedInsights.economicProfile?.locationAdvantage ? 'Yes' : 'No'}</span>
              </div>
              <div className="info-item">
                <span className="label">VPN Usage:</span>
                <span className="value">{advancedTracking.correlatedInsights.economicProfile?.vpnUsage ? 'Yes' : 'No'}</span>
              </div>
              <div className="info-item">
                <span className="label">ISP Type:</span>
                <span className="value">{advancedTracking.correlatedInsights.economicProfile?.ispType || 'Unknown'}</span>
              </div>
            </div>
            
            <div className="info-card">
              <h3>Security Profile</h3>
              <div className="info-item">
                <span className="label">Privacy Aware:</span>
                <span className="value">{advancedTracking.correlatedInsights.securityProfile?.privacyAware ? 'Yes' : 'No'}</span>
              </div>
              <div className="info-item">
                <span className="label">Location Masking:</span>
                <span className="value">{advancedTracking.correlatedInsights.securityProfile?.locationMasking ? 'Yes' : 'No'}</span>
              </div>
              <div className="info-item">
                <span className="label">Network Security:</span>
                <span className="value">{advancedTracking.correlatedInsights.securityProfile?.networkSecurity || 'Unknown'}</span>
              </div>
            </div>
            
            <div className="info-card">
              <h3>Lifestyle Analysis</h3>
              <div className="info-item">
                <span className="label">Work-Life Balance:</span>
                <span className="value">{advancedTracking.correlatedInsights.lifestyleProfile?.workLifeBalance || 'Unknown'}</span>
              </div>
              <div className="info-item">
                <span className="label">Health Risk:</span>
                <span className="value">{advancedTracking.correlatedInsights.lifestyleProfile?.healthRisk || 'Unknown'}</span>
              </div>
              <div className="info-item">
                <span className="label">Stress Level:</span>
                <span className="value">{advancedTracking.correlatedInsights.lifestyleProfile?.stressLevel || 'Unknown'}</span>
              </div>
            </div>
            
            {advancedTracking.predictiveProfile && (
              <div className="info-card">
                <h3>Predictive Profile</h3>
                <div className="info-item">
                  <span className="label">Likely Purchases:</span>
                  <span className="value">{advancedTracking.predictiveProfile.likelyPurchases?.join(', ') || 'None predicted'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Health Trends:</span>
                  <span className="value">{advancedTracking.predictiveProfile.healthTrends?.join(', ') || 'None predicted'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Risk Factors:</span>
                  <span className="value">{advancedTracking.predictiveProfile.riskFactors?.join(', ') || 'None identified'}</span>
                </div>
              </div>
            )}
            
            {advancedTracking.riskAssessment && (
              <div className="info-card">
                <h3>Risk Assessment</h3>
                <div className="info-item">
                  <span className="label">Overall Risk:</span>
                  <span className="value">{advancedTracking.riskAssessment.overallRisk}</span>
                </div>
                <div className="info-item">
                  <span className="label">Financial Risk:</span>
                  <span className="value">{advancedTracking.riskAssessment.financialRisk}</span>
                </div>
                <div className="info-item">
                  <span className="label">Privacy Risk:</span>
                  <span className="value">{advancedTracking.riskAssessment.privacyRisk}</span>
                </div>
                <div className="info-item">
                  <span className="label">Network Risk:</span>
                  <span className="value">{advancedTracking.riskAssessment.networkRisk}</span>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'all' && (
          <>
            <div className="info-card">
              <h3>Complete User Profile</h3>
              <div className="info-item">
                <span className="label">Total Data Points:</span>
                <span className="value">{totalDataPoints}</span>
              </div>
              <div className="info-item">
                <span className="label">Collection Time:</span>
                <span className="value">{formatDate(Date.now())}</span>
              </div>
            </div>
            
            {user && (
              <div className="info-card">
                <h3>Firebase User Data</h3>
                <pre style={{fontSize: '0.7rem', maxHeight: '200px', overflow: 'auto'}}>{JSON.stringify(user, null, 2)}</pre>
              </div>
            )}
            
            {extendedData && (
              <div className="info-card">
                <h3>API Extended Data</h3>
                <pre style={{fontSize: '0.7rem', maxHeight: '200px', overflow: 'auto'}}>{JSON.stringify(extendedData, null, 2)}</pre>
              </div>
            )}
            
            {deviceInfo && (
              <div className="info-card">
                <h3>Device Fingerprint</h3>
                <pre style={{fontSize: '0.7rem', maxHeight: '200px', overflow: 'auto'}}>{JSON.stringify(deviceInfo, null, 2)}</pre>
              </div>
            )}
            
            {locationData && (
              <div className="info-card">
                <h3>Location Data</h3>
                <pre style={{fontSize: '0.7rem', maxHeight: '200px', overflow: 'auto'}}>{JSON.stringify(locationData, null, 2)}</pre>
              </div>
            )}
            
            {ipInfo && (
              <div className="info-card">
                <h3>IP Information</h3>
                <pre style={{fontSize: '0.7rem', maxHeight: '200px', overflow: 'auto'}}>{JSON.stringify(ipInfo, null, 2)}</pre>
              </div>
            )}
            
            {userBehavior && (
              <div className="info-card">
                <h3>Behavior Analysis</h3>
                <pre style={{fontSize: '0.7rem', maxHeight: '200px', overflow: 'auto'}}>{JSON.stringify(userBehavior, null, 2)}</pre>
              </div>
            )}
            
            {advancedTracking && (
              <div className="info-card">
                <h3>Advanced Tracking</h3>
                <pre style={{fontSize: '0.7rem', maxHeight: '200px', overflow: 'auto'}}>{JSON.stringify(advancedTracking, null, 2)}</pre>
              </div>
            )}
            
            {networkInfo && (
              <div className="info-card">
                <h3>Network Analysis</h3>
                <pre style={{fontSize: '0.7rem', maxHeight: '200px', overflow: 'auto'}}>{JSON.stringify(networkInfo, null, 2)}</pre>
              </div>
            )}
            
            {systemInfo && (
              <div className="info-card">
                <h3>System Information</h3>
                <pre style={{fontSize: '0.7rem', maxHeight: '200px', overflow: 'auto'}}>{JSON.stringify(systemInfo, null, 2)}</pre>
              </div>
            )}
            
            {browserData && (
              <div className="info-card">
                <h3>Browser Capabilities</h3>
                <pre style={{fontSize: '0.7rem', maxHeight: '200px', overflow: 'auto'}}>{JSON.stringify(browserData, null, 2)}</pre>
              </div>
            )}
            
            {socialData && (
              <div className="info-card">
                <h3>Social Media Data</h3>
                <pre style={{fontSize: '0.7rem', maxHeight: '200px', overflow: 'auto'}}>{JSON.stringify(socialData, null, 2)}</pre>
              </div>
            )}
            
            {realtimeData && (
              <div className="info-card">
                <h3>Real-time Monitoring</h3>
                <pre style={{fontSize: '0.7rem', maxHeight: '200px', overflow: 'auto'}}>{JSON.stringify(realtimeData, null, 2)}</pre>
              </div>
            )}
          </>
        )}

        {activeTab === 'technical' && (
          <>
            <div className="info-card">
              <h3>Account Metadata</h3>
              <div className="info-item">
                <span className="label">Created:</span>
                <span className="value">{formatDate(user.metadata.creationTime)}</span>
              </div>
              <div className="info-item">
                <span className="label">Last Sign In:</span>
                <span className="value">{formatDate(user.metadata.lastSignInTime)}</span>
              </div>
              <div className="info-item">
                <span className="label">Last Refresh:</span>
                <span className="value">{user.metadata.lastRefreshTime ? formatDate(user.metadata.lastRefreshTime) : 'Not available'}</span>
              </div>
            </div>

            <div className="info-card">
              <h3>Technical Details</h3>
              <div className="info-item">
                <span className="label">UID:</span>
                <span className="value uid" onClick={() => copyToClipboard(user.uid)} title="Click to copy">
                  {user.uid}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Tenant ID:</span>
                <span className="value">{user.tenantId || 'Default'}</span>
              </div>
              {userInfo && (
                <>
                  <div className="info-item">
                    <span className="label">Operation:</span>
                    <span className="value">{userInfo.operationType}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Provider ID:</span>
                    <span className="value">{userInfo.providerId}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Session Time:</span>
                    <span className="value">{formatDate(userInfo.timestamp)}</span>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>



      {showRawData && (
        <div className="raw-data">
          <h3>Raw User Data</h3>
          <pre>{JSON.stringify(user, null, 2)}</pre>
          {userInfo && (
            <>
              <h3>Session Data</h3>
              <pre>{JSON.stringify(userInfo, null, 2)}</pre>
            </>
          )}
          {providerData && (
            <>
              <h3>Provider Data</h3>
              <pre>{JSON.stringify(providerData, null, 2)}</pre>
            </>
          )}
          {extendedData && (
            <>
              <h3>Extended API Data</h3>
              <pre>{JSON.stringify(extendedData, null, 2)}</pre>
            </>
          )}
          {deviceInfo && (
            <>
              <h3>Device Information</h3>
              <pre>{JSON.stringify(deviceInfo, null, 2)}</pre>
            </>
          )}
          {locationData && (
            <>
              <h3>Location Data</h3>
              <pre>{JSON.stringify(locationData, null, 2)}</pre>
            </>
          )}
          {networkInfo && (
            <>
              <h3>Network Information</h3>
              <pre>{JSON.stringify(networkInfo, null, 2)}</pre>
            </>
          )}
          {ipInfo && (
            <>
              <h3>IP Information</h3>
              <pre>{JSON.stringify(ipInfo, null, 2)}</pre>
            </>
          )}
          {behaviorData && (
            <>
              <h3>Behavior Data</h3>
              <pre>{JSON.stringify(behaviorData, null, 2)}</pre>
            </>
          )}
          {realtimeData && (
            <>
              <h3>Real-time Data</h3>
              <pre>{JSON.stringify(realtimeData, null, 2)}</pre>
            </>
          )}
          {socialData && (
            <>
              <h3>Social Media Data</h3>
              <pre>{JSON.stringify(socialData, null, 2)}</pre>
            </>
          )}
          {userBehavior && (
            <>
              <h3>User Behavior</h3>
              <pre>{JSON.stringify(userBehavior, null, 2)}</pre>
            </>
          )}
          {advancedTracking && (
            <>
              <h3>Advanced Tracking</h3>
              <pre>{JSON.stringify(advancedTracking, null, 2)}</pre>
            </>
          )}
        </div>
      )}

      <div className="profile-footer">
        <button onClick={onSignOut} className="sign-out-btn">
          🚪 Sign Out
        </button>
      </div>
    </div>
  )
}