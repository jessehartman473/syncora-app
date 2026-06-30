import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      hasError: true,
      error: error,
      errorInfo: errorInfo
    });
    console.error("CRITICAL COMPONENT CRASH DETECTED:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif', color: '#111' }}>
          <h1 style={{ color: '#dc2626', fontSize: '28px', marginBottom: '10px' }}>⚠️ System Intercepted a Crash</h1>
          <p style={{ fontSize: '16px', color: '#4b5563', marginBottom: '20px' }}>
            We stopped the white screen! A file in your project is trying to execute a bad Supabase connection. Here is the exact culprit location:
          </p>
          <div style={{ backgroundColor: '#f3f4f6', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb', overflowX: 'auto' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>Error Message:</h3>
            <pre style={{ color: '#b91c1c', fontWeight: 'bold', margin: '0 0 20px 0', whiteSpace: 'pre-wrap' }}>
              {this.state.error?.toString()}
            </pre>
            <h3 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>Component Stack Trace:</h3>
            <pre style={{ color: '#475569', fontSize: '13px', margin: '0', whiteSpace: 'pre-wrap' }}>
              {this.state.errorInfo?.componentStack}
            </pre>
          </div>
          <button 
            onClick={() => { window.localStorage.clear(); window.location.reload(); }}
            style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '640' }}
          >
            Clear Local Cache & Force Restart
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}