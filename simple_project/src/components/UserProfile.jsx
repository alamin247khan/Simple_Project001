import { useState, useEffect } from 'react'
import DataExporter from './DataExporter'
import './UserProfile.css'

export default function UserProfile({ user, userInfo, providerData, extendedData, deviceInfo, locationData, networkInfo, ipInfo, behaviorData, advancedFingerprint, realtimeData, onSignOut }) {
  const [showRawData, setShowRawData] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

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