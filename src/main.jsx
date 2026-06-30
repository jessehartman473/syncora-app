import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log("CHECKPOINT 1: Entry file loaded. Attempting to mount React tree...");

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    alert("CRITICAL: Could not find the HTML container with id 'root'!");
  } else {
    console.log("CHECKPOINT 2: 'root' element found in index.html. Rendering App...");
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
    console.log("CHECKPOINT 3: React render function completed successfully.");
  }
} catch (globalError) {
  console.error("FATAL ENTRY CRASH:", globalError);
  alert("FATAL EXCEPTION DURING MOUNT: " + globalError.message);
}