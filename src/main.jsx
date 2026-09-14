import './i18n';
import PreferencesProvider from './preferences/PreferencesProvider';
import './preferences/preferences.css';
import './index.css'
import App from './App.jsx'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { initializeClarity } from './utils/clarity.js'

initializeClarity()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
<BrowserRouter basename='/'>
      <PreferencesProvider>
        <App />
      </PreferencesProvider>
</BrowserRouter>
  </React.StrictMode>,
)
