// Import necessary modules from React and ReactDOM
import React from 'react'
import ReactDOM from 'react-dom/client'

// Import the main App component and styling
import './index.css'
import App from './App'

// Import utility for reporting web vitals
import reportWebVitals from './reportWebVitals'

// Create a root for rendering React components
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

// Render the main App component within React StrictMode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
