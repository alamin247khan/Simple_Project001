# 🔐 Authentication Demo

A modern React authentication app with Firebase integration, featuring Google and GitHub sign-in.

## ✨ Features

- **Multi-Provider Auth**: Google & GitHub OAuth integration
- **Real-time State**: Persistent authentication state
- **Modern UI**: Responsive design with dark/light theme support
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Data Persistence**: Local storage for session data
- **Developer Tools**: Raw data viewer and debugging features
- **Toast Notifications**: User-friendly feedback system

## 🚀 Tech Stack

- **React 19** - Latest React with modern hooks
- **Vite** - Fast build tool and dev server
- **Firebase Auth** - Secure authentication service
- **CSS3** - Modern styling with animations
- **LocalStorage** - Client-side data persistence

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AuthButtons.jsx   # Sign-in buttons
│   ├── UserProfile.jsx   # User information display
│   ├── ErrorBoundary.jsx # Error handling
│   └── Toast.jsx         # Notifications
├── hooks/               # Custom React hooks
│   └── useAuth.js       # Authentication logic
├── utils/               # Utility functions
│   └── storage.js       # LocalStorage helpers
├── fairbase/            # Firebase configuration
│   └── fairbase.init.js # Firebase setup
└── App.jsx              # Main application
```

## 🛠️ Setup

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Configure Firebase**: Update `src/fairbase/fairbase.init.js` with your config
4. **Start development**: `npm run dev`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Key Components

### useAuth Hook
Custom hook managing authentication state and operations with error handling.

### ErrorBoundary
Catches React errors and provides user-friendly fallback UI.

### Toast System
Provides real-time feedback for user actions with auto-dismiss.

### Storage Utils
Safe localStorage operations with error handling.

## 🔒 Security Features

- Firebase security rules
- Error boundary protection
- Safe data persistence
- Input validation
- Secure token handling

## 📱 Responsive Design

- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interactions
- Cross-browser compatibility
